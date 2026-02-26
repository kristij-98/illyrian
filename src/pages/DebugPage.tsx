import { useMemo, useState } from 'react';
import { assets, catalog, collections, crawlLog, formatPrice } from '../lib/data';
import { fetchJson } from '../lib/fetch';

export function DebugPage() {
  const [syncStatus, setSyncStatus] = useState('');
  const [previewTitles, setPreviewTitles] = useState<string[]>([]);

  const firstProducts = useMemo(() => catalog.products.slice(0, 20), []);
  const firstImages = useMemo(() => assets.allImages.slice(0, 20), []);

  const sync = async () => {
    setSyncStatus('Syncing canonical collections...');
    try {
      const seed = [
        'https://illyrianbloodline.com/en-al/collections/new-arrivals',
        'https://illyrianbloodline.com/en-al/collections/mens-wear',
        'https://illyrianbloodline.com/en-al/collections/womens-wear',
        'https://illyrianbloodline.com/en-al/collections/see-all'
      ];
      const data = await Promise.all(seed.map((url) => fetch(url).then((r) => r.text())));
      setPreviewTitles(data.map((txt) => txt.match(/<title>(.*?)<\/title>/i)?.[1] ?? 'collection'));
      const sample = await fetchJson<any>('https://illyrianbloodline.com/products.json?limit=5');
      setSyncStatus(`Fetched ${data.length} collections + ${sample.products?.length ?? 0} sample products. Run npm run crawl for full sync.`);
    } catch (error) {
      setSyncStatus(`Sync failed: ${String(error)}`);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 md:px-8">
      <h1 className="editorial-title mb-6">Debug</h1>
      <div className="mb-6 border border-hairline bg-panel p-4">
        <p className="caption">Catalog generatedAt: {catalog.generatedAt}</p>
        <p className="caption">Assets generatedAt: {assets.generatedAt}</p>
        <p className="caption">Collections generatedAt: {collections.generatedAt}</p>
        <p className="caption">Products: {catalog.products.length}</p>
        <p className="caption">Images: {assets.allImages.length}</p>
        <button onClick={sync} className="mt-4 border border-hairline px-4 py-2 text-[1.1rem] uppercase tracking-editorial">Sync Illyrian Content</button>
        {syncStatus && <p className="mt-3 text-[1.2rem]">{syncStatus}</p>}
        {previewTitles.length > 0 && <pre className="mt-2 text-[1rem] opacity-80">{previewTitles.join('\n')}</pre>}
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-[1.2rem] uppercase tracking-editorial">First 20 products</h2>
        <div className="grid grid-cols-1 gap-0 border border-hairline md:grid-cols-2">
          {firstProducts.map((product) => (
            <div key={product.handle} className="flex gap-3 border border-hairline p-3">
              <img src={product.featuredImage ?? product.images[0]} alt={product.title} className="h-16 w-16 object-cover" />
              <div>
                <p className="caption">{product.title}</p>
                <p className="caption">{formatPrice(product.price)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-[1.2rem] uppercase tracking-editorial">First 20 images</h2>
        <div className="grid grid-cols-2 border border-hairline md:grid-cols-5">
          {firstImages.map((image) => (
            <img key={image} src={image} alt="Sitemap asset" className="aspect-square border border-hairline object-cover" />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-[1.2rem] uppercase tracking-editorial">Crawl errors</h2>
        <pre className="max-h-96 overflow-auto border border-hairline bg-panel p-4 text-[1.1rem]">{JSON.stringify(crawlLog.errors, null, 2)}</pre>
      </section>
    </main>
  );
}
