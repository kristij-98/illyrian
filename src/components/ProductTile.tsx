import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../lib/data';
import { motionTokens } from '../motion/tokens';
import type { Product } from '../types';
import { RevealImage } from './RevealImage';

export function ProductTile({ product, large = false }: { product: Product; large?: boolean }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(false);

  return (
    <Link
      to={`/products/${product.handle}`}
      className="group relative block border border-hairline bg-panel"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      <motion.div
        animate={
          reduce
            ? { opacity: active ? 0.95 : 1 }
            : { opacity: active ? 0.95 : 1, scale: active ? 1.01 : 1 }
        }
        transition={{ duration: motionTokens.durations.fast, ease: motionTokens.easing.easeOutSoft }}
      >
        <RevealImage
          src={product.featuredImage ?? product.images[0]}
          alt={product.title}
          className={large ? 'aspect-[4/5] p-16 object-contain' : 'aspect-square p-10 object-contain'}
        />
      </motion.div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-hairline bg-paper px-[10px] py-[6px]"
            initial={{ opacity: 0, y: reduce ? 0 : motionTokens.distances.sm }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -motionTokens.distances.sm / 2 }}
            transition={{ duration: motionTokens.durations.base, ease: motionTokens.easing.easeOutSoft }}
          >
            <p className="max-w-[22ch] truncate text-[1.1rem] uppercase tracking-editorial text-ink">{product.title}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 right-0 border-t border-hairline bg-panel/95 px-3 pb-3 pt-2">
        <div className="grid grid-cols-[1fr_auto_auto] items-end gap-3 text-[1.05rem] uppercase tracking-editorial text-ink/80">
          <span className="relative truncate after:absolute after:bottom-[-2px] after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-200 after:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100">
            {product.title}
          </span>
          <span className="whitespace-nowrap">{formatPrice(product.price)}</span>
          <span aria-hidden="true" className="text-[1.3rem] leading-none">♡</span>
        </div>
      </div>
    </Link>
  );
}
