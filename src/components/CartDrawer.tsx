import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { formatPrice } from '../lib/data';
import { motionTokens } from '../motion/tokens';
import { useCart } from '../store/cart';

export function CartDrawer() {
  const { items, drawerOpen, setDrawerOpen, updateQty, removeItem } = useCart();
  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.button className="fixed inset-0 z-40 bg-black/20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawerOpen(false)} />
          <motion.aside
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-hairline bg-paper p-6"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: motionTokens.durations.base, ease: motionTokens.easing.easeInOutSoft }}
          >
            <div className="mb-4 flex items-center justify-between border-b border-hairline pb-3">
              <h3 className="text-[1.2rem] uppercase tracking-editorial">Cart</h3>
              <button onClick={() => setDrawerOpen(false)} className="underline-hover text-[1.1rem]">Close</button>
            </div>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={`${item.handle}-${item.variantTitle}`} className="border-b border-hairline pb-3">
                  <p className="caption">{item.title}</p>
                  <p className="caption">{formatPrice(item.price)}</p>
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => updateQty(item.handle, item.qty - 1)}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.handle, item.qty + 1)}>+</button>
                    <button onClick={() => removeItem(item.handle)} className="ml-auto underline-hover text-[1rem]">Remove</button>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/cart" onClick={() => setDrawerOpen(false)} className="mt-6 block border border-hairline px-4 py-3 text-center text-[1.1rem] uppercase">View Cart</Link>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
