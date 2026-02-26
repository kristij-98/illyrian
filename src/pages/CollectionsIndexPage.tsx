import { Link } from 'react-router-dom';
import { collections } from '../lib/data';

export function CollectionsIndexPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12 md:px-8">
      <h1 className="editorial-title mb-10">Collections</h1>
      <div className="grid grid-cols-1 border border-hairline md:grid-cols-2">
        {collections.collections.map((collection) => (
          <Link key={collection.handle} to={`/collections/${collection.handle}`} className="border border-hairline bg-panel p-8">
            <p className="text-[1.2rem] uppercase tracking-editorial">{collection.title}</p>
            <p className="caption mt-2">{collection.productHandles.length} products</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
