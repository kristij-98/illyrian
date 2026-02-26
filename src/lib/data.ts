import assetsData from '../data/assets.json';
import catalogData from '../data/catalog.json';
import collectionsData from '../data/collections.json';
import crawlLogData from '../data/crawl-log.json';
import type { Collection, Product } from '../types';

type CatalogJson = { generatedAt: string; products: Product[] };
type CollectionsJson = { generatedAt: string; collections: Collection[] };
type AssetsJson = { generatedAt: string; allImages: string[] };
type CrawlLog = { generatedAt: string; errors: { scope: string; url?: string; message: string }[] };

export const catalog = catalogData as CatalogJson;
export const collections = collectionsData as CollectionsJson;
export const assets = assetsData as AssetsJson;
export const crawlLog = crawlLogData as CrawlLog;

const productMap = new Map(catalog.products.map((product) => [product.handle, product]));
const collectionMap = new Map(collections.collections.map((collection) => [collection.handle, collection]));

export function getProductByHandle(handle: string) {
  return productMap.get(handle);
}

export function getCollectionByHandle(handle: string) {
  return collectionMap.get(handle);
}

export function getProductsForCollection(handle: string) {
  const collection = getCollectionByHandle(handle);
  if (!collection) return [];
  return collection.productHandles
    .map((itemHandle) => getProductByHandle(itemHandle))
    .filter(Boolean) as Product[];
}

export function getHomepagePicks(count = 48) {
  const newArrivals = getProductsForCollection('new-arrivals');
  if (newArrivals.length >= count) return newArrivals.slice(0, count);
  const rest = catalog.products.filter((product) => !newArrivals.some((p) => p.handle === product.handle));
  return [...newArrivals, ...rest].slice(0, count);
}

export function getEditorialImage(index: number) {
  if (assets.allImages.length === 0) return undefined;
  return assets.allImages[index % assets.allImages.length];
}

export function formatPrice(input?: number | string): string {
  if (input === undefined || input === null || input === '') return '—';
  const value = typeof input === 'string' ? Number(input) : input;
  if (Number.isNaN(value)) return String(input);
  const normalized = value > 1000 ? value / 100 : value;
  return `€${normalized.toFixed(2)}`;
}
