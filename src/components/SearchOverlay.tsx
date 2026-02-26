import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { catalog, formatPrice } from '../lib/data';
import { motionTokens } from '../motion/tokens';

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const result = useMemo(
    () => catalog.products.filter((p) => p.title.toLowerCase().includes(query.toLowerCase())).slice(0, 8),
    [query]
  );
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 bg-paper/95"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: motionTokens.durations.fast }}
        >
          <div className="mx-auto mt-24 max-w-4xl border border-hairline bg-panel p-6">
            <div className="mb-4 flex justify-between">
              <h2 className="text-[1.2rem] uppercase tracking-editorial">Search</h2>
              <button className="underline-hover text-[1.1rem]" onClick={onClose}>Close</button>
            </div>
            <motion.input
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mb-6 w-full border-b border-hairline bg-transparent py-2 text-[2rem] outline-none"
              placeholder="Search products"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="space-y-2">
              {result.map((product, idx) => (
                <motion.div
                  key={product.handle}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * motionTokens.stagger.list }}
                  className="border-b border-hairline py-2"
                >
                  <Link onClick={onClose} to={`/products/${product.handle}`} className="flex justify-between text-[1.2rem] uppercase tracking-editorial">
                    <span>{product.title}</span>
                    <span>{formatPrice(product.price)}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
