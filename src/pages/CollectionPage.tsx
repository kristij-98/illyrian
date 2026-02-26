import { useParams } from 'react-router-dom';
import { ProductTile } from '../components/ProductTile';
import { getCollectionByHandle, getProductsForCollection } from '../lib/data';

export function CollectionPage() {
  const { handle = '' } = useParams();
  const collection = getCollectionByHandle(handle);
  const products = getProductsForCollection(handle);

  return (
    <main className="px-0 py-8 md:px-0">
      <div className="px-4 md:px-8">
        <h1 className="editorial-title mb-8">{collection?.title ?? 'Collection'}</h1>
      </div>
      <div className="grid grid-cols-1 border-l border-t border-hairline sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6" style={{ gridAutoFlow: 'dense' }}>
        {products.map((product, idx) => {
          const large = idx % 13 === 0;
          const spanClass = idx % 7 === 0 ? 'lg:col-span-2' : '';

          return (
            <div className={`border-b border-r border-hairline ${spanClass}`} key={product.handle}>
              <ProductTile product={product} large={large} />
            </div>
          );
        })}
      </div>
    </main>
  );
}
