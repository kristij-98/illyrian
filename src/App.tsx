import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { CartDrawer } from './components/CartDrawer';
import { SearchOverlay } from './components/SearchOverlay';
import { motionTokens } from './motion/tokens';
import { useState } from 'react';

export default function App() {
  const location = useLocation();
  const reduce = useReducedMotion();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Header onSearch={() => setSearchOpen(true)} />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: reduce ? 0 : motionTokens.distances.md }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduce ? 0 : -motionTokens.distances.sm }}
          transition={{ duration: motionTokens.durations.slow, ease: motionTokens.easing.easeOutSoft }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer />
    </div>
  );
}
