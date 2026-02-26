import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { XMLParser } from 'fast-xml-parser';
import pLimit from 'p-limit';
import * as cheerio from 'cheerio';

type CrawlError = { scope: string; url?: string; message: string };

type Product = {
  handle: string;
  title: string;
  url: string;
  available?: boolean;
  price?: number | string;
  compareAtPrice?: number | string;
  currency?: string;
  images: string[];
  featuredImage?: string;
  description?: string;
  vendor?: string;
  tags?: string[];
  variants?: { id?: string | number; title?: string; available?: boolean; price?: string | number }[];
  sourceCollections?: string[];
};

const seeds = [
  { handle: 'new-arrivals', url: 'https://illyrianbloodline.com/en-al/collections/new-arrivals' },
  { handle: 'mens-wear', url: 'https://illyrianbloodline.com/en-al/collections/mens-wear' },
  { handle: 'womens-wear', url: 'https://illyrianbloodline.com/en-al/collections/womens-wear' },
  { handle: 'see-all', url: 'https://illyrianbloodline.com/en-al/collections/see-all' }
] as const;

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128 Safari/537.36';

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_'
});

const errors: CrawlError[] = [];

async function fetchText(url: string, retries = 2): Promise<string> {
  for (let i = 0; i <= retries; i += 1) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 20000);
      const response = await fetch(url, {
        headers: { 'user-agent': UA, accept: '*/*' },
        signal: controller.signal
      });
      clearTimeout(timer);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.text();
    } catch (err) {
      if (i === retries) throw err;
      await new Promise((resolve) => setTimeout(resolve, 450 * (i + 1)));
    }
  }
  throw new Error('unreachable');
}

function toAbsoluteImage(url: string): string {
  if (!url) return url;
  if (url.startsWith('http')) return url;
  if (url.startsWith('//')) return `https:${url}`;
  return new URL(url, 'https://illyrianbloodline.com').toString();
}

function extractHandle(href: string): string | null {
  if (!href.includes('/products/')) return null;
  const part = href.split('/products/')[1];
  if (!part) return null;
  return part.split('?')[0].split('#')[0].replace(/^\/+/, '').trim() || null;
}

async function crawlCollection(seed: (typeof seeds)[number]) {
  const seenPages = new Set<string>();
  const handles = new Set<string>();
  let pageUrl: string | undefined = seed.url;

  while (pageUrl && !seenPages.has(pageUrl)) {
    seenPages.add(pageUrl);
    try {
      const html = await fetchText(pageUrl);
      const $ = cheerio.load(html);
      const beforeCount = handles.size;

      $('a[href*="/products/"]').each((_, el) => {
        const href = $(el).attr('href') ?? '';
        const handle = extractHandle(href);
        if (handle) handles.add(handle);
      });

      let nextUrl: string | undefined;
      const relNext = $('a[rel="next"]').first().attr('href');
      if (relNext) {
        nextUrl = new URL(relNext, pageUrl).toString();
      } else {
        $('a').each((_, el) => {
          if (nextUrl) return;
          const href = $(el).attr('href') ?? '';
          const txt = $(el).text().trim().toLowerCase();
          if (href.includes('page=') || txt.includes('next')) {
            nextUrl = new URL(href, pageUrl).toString();
          }
        });
      }

      if (handles.size === beforeCount && nextUrl && seenPages.has(nextUrl)) {
        pageUrl = undefined;
      } else {
        pageUrl = nextUrl;
      }
    } catch (err) {
      errors.push({ scope: 'collection', url: pageUrl, message: String(err) });
      break;
    }
  }

  return Array.from(handles).sort();
}

async function fetchProduct(handle: string, sourceCollections: string[]): Promise<Product | null> {
  const urls = [
    `https://illyrianbloodline.com/products/${handle}.js`,
    `https://illyrianbloodline.com/products/${handle}.json`
  ];
  for (const url of urls) {
    try {
      const text = await fetchText(url);
      const parsed = JSON.parse(text);
      const raw = parsed.product ?? parsed;
      const images = (raw.images ?? [])
        .map((img: unknown) => (typeof img === 'string' ? img : img && typeof img === 'object' ? (img as any).src : ''))
        .map((img: string) => toAbsoluteImage(img))
        .filter(Boolean);
      const variants = (raw.variants ?? []).map((v: any) => ({
        id: v.id,
        title: v.title,
        available: v.available,
        price: v.price
      }));
      const product: Product = {
        handle,
        title: raw.title ?? handle,
        url: `https://illyrianbloodline.com/products/${handle}`,
        available: raw.available,
        price: raw.price ?? raw.variants?.[0]?.price,
        compareAtPrice: raw.compare_at_price ?? raw.variants?.[0]?.compare_at_price,
        currency: raw.currency,
        images,
        featuredImage: toAbsoluteImage(raw.featured_image ?? images[0] ?? ''),
        description: raw.description,
        vendor: raw.vendor,
        tags: raw.tags ?? [],
        variants,
        sourceCollections
      };
      return product;
    } catch (err) {
      if (url.endsWith('.json')) {
        errors.push({ scope: 'product', url, message: String(err) });
      }
    }
  }
  return null;
}

function extractImageLocs(node: any): string[] {
  if (!node || typeof node !== 'object') return [];
  const out: string[] = [];
  for (const [key, value] of Object.entries(node)) {
    if (key === 'image:loc' || key.endsWith(':loc') && key.includes('image')) {
      if (Array.isArray(value)) out.push(...value.map(String));
      else out.push(String(value));
    } else if (typeof value === 'object') {
      if (Array.isArray(value)) value.forEach((v) => out.push(...extractImageLocs(v)));
      else out.push(...extractImageLocs(value));
    }
  }
  return out;
}

async function fetchSitemapImages(): Promise<string[]> {
  try {
    const xml = await fetchText('https://illyrianbloodline.com/sitemap.xml');
    const root = xmlParser.parse(xml);
    const rawLocs = root?.sitemapindex?.sitemap ?? [];
    const sitemapNodes = Array.isArray(rawLocs) ? rawLocs : [rawLocs];
    const sitemapLocs = sitemapNodes.map((s: any) => s.loc).filter(Boolean);
    const limit = pLimit(5);
    const imageSet = new Set<string>();

    await Promise.all(
      sitemapLocs.map((loc: string) =>
        limit(async () => {
          try {
            const mapXml = await fetchText(loc);
            const parsed = xmlParser.parse(mapXml);
            const images = extractImageLocs(parsed);
            images.forEach((img) => imageSet.add(toAbsoluteImage(img)));
          } catch (err) {
            errors.push({ scope: 'sitemap', url: loc, message: String(err) });
          }
        })
      )
    );

    return Array.from(imageSet).sort();
  } catch (err) {
    errors.push({ scope: 'sitemap-index', url: 'https://illyrianbloodline.com/sitemap.xml', message: String(err) });
    return [];
  }
}

async function writeIfChanged(filePath: string, value: unknown) {
  const next = `${JSON.stringify(value, null, 2)}\n`;
  let prev = '';
  try {
    prev = await fs.readFile(filePath, 'utf8');
  } catch {
    prev = '';
  }
  if (prev !== next) {
    await fs.writeFile(filePath, next, 'utf8');
    console.log(`updated ${path.basename(filePath)}`);
  } else {
    console.log(`unchanged ${path.basename(filePath)}`);
  }
}

async function main() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const repoRoot = path.resolve(__dirname, '..');
  const dataDir = path.join(repoRoot, 'src', 'data');
  await fs.mkdir(dataDir, { recursive: true });

  const collectionMap = new Map<string, string[]>();
  for (const seed of seeds) {
    const handles = await crawlCollection(seed);
    collectionMap.set(seed.handle, handles);
  }

  const sourceMap = new Map<string, string[]>();
  for (const [collectionHandle, handles] of collectionMap) {
    handles.forEach((h) => {
      const source = sourceMap.get(h) ?? [];
      if (!source.includes(collectionHandle)) source.push(collectionHandle);
      sourceMap.set(h, source);
    });
  }

  const uniqueHandles = Array.from(sourceMap.keys()).sort();
  const limit = pLimit(5);
  const products = (
    await Promise.all(
      uniqueHandles.map((handle) => limit(() => fetchProduct(handle, sourceMap.get(handle) ?? [])))
    )
  )
    .filter(Boolean)
    .sort((a, b) => a!.handle.localeCompare(b!.handle)) as Product[];

  const allImages = await fetchSitemapImages();
  const generatedAt = new Date().toISOString();

  const collections = seeds.map((seed) => ({
    handle: seed.handle,
    title: seed.handle.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    url: seed.url,
    productHandles: collectionMap.get(seed.handle) ?? []
  }));

  await writeIfChanged(path.join(dataDir, 'assets.json'), { generatedAt, allImages });
  await writeIfChanged(path.join(dataDir, 'catalog.json'), { generatedAt, products });
  await writeIfChanged(path.join(dataDir, 'collections.json'), { generatedAt, collections });
  await writeIfChanged(path.join(dataDir, 'urls.json'), { generatedAt, pages: seeds.map((s) => s.url) });
  await writeIfChanged(path.join(dataDir, 'crawl-log.json'), { generatedAt, errors });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
