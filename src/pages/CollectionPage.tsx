import { useParams } from 'react-router-dom';
import { getCollectionByHandle, getProductsForCollection } from '../lib/data';
import { ProductTile } from '../components/ProductTile';

export function CollectionPage() {
  const { handle = '' } = useParams();
  const collection = getCollectionByHandle(handle);
  const products = getProductsForCollection(handle);
  return (
    <main className="px-4 py-8 md:px-8">
      <h1 className="editorial-title mb-8">{collection?.title ?? 'Collection'}</h1>
      <div className="grid auto-rows-[26rem] grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6" style={{ gridAutoFlow: 'dense' }}>
        {products.map((product, idx) => {
          const spanClass = idx % 13 === 0 ? 'lg:col-span-2 lg:row-span-2' : idx % 7 === 0 ? 'lg:col-span-2' : '';
          return (
            <div className={spanClass} key={product.handle}>
              <ProductTile product={product} large={idx % 13 === 0} />
            </div>
          );
        })}
      </div>
    </main>
  );
}
