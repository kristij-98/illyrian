import { motion } from 'framer-motion';
import { getEditorialImage, getHomepagePicks } from '../lib/data';
import { motionTokens } from '../motion/tokens';
import { EditorialTile } from '../components/EditorialTile';
import { ProductTile } from '../components/ProductTile';

export function HomePage() {
  const products = getHomepagePicks(72);
  const blocks = Array.from({ length: 3 }, (_, i) => i);
  let cursor = 0;

  return (
    <main className="border-b border-hairline">
      {blocks.map((blockIdx) => (
        <section key={blockIdx}>
          {[0, 1, 2].map((rowIdx) => (
            <div key={rowIdx}>
              <motion.div
                initial={{ opacity: 0, y: motionTokens.distances.md }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: motionTokens.durations.slow }}
                className="grid grid-cols-1 md:grid-cols-2"
              >
                <EditorialTile src={getEditorialImage(blockIdx * 6 + rowIdx * 2)} />
                <EditorialTile src={getEditorialImage(blockIdx * 6 + rowIdx * 2 + 1)} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: motionTokens.distances.md }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: motionTokens.durations.slow, delay: 0.06 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              >
                {Array.from({ length: 4 }).map((_, i) => {
                  const product = products[cursor + i] ?? products[(cursor + i) % Math.max(products.length, 1)];
                  return product ? <ProductTile key={`${blockIdx}-${rowIdx}-${i}-${product.handle}`} product={product} /> : null;
                })}
              </motion.div>
            </div>
          ))}
          {(cursor += 12) && null}
        </section>
      ))}
    </main>
  );
}
