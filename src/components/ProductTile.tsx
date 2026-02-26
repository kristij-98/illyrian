import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../lib/data';
import { motionTokens } from '../motion/tokens';
import type { Product } from '../types';
import { RevealImage } from './RevealImage';

const COLOR_MAP: Record<string, string> = {
  black: '#111111',
  white: '#f7f7f7',
  cream: '#efe9db',
  beige: '#d9ccb4',
  brown: '#7b5b45',
  olive: '#6f6a45',
  green: '#5f7d5d',
  navy: '#1f2b44',
  blue: '#355f9a',
  red: '#8b2f2f',
  burgundy: '#6b2b2b',
  gray: '#8e8e8e',
  grey: '#8e8e8e'
};

const COLOR_WORDS = Object.keys(COLOR_MAP);

function inferColorTokens(product: Product): string[] {
  const found = new Set<string>();
  const addIfColor = (value?: string) => {
    if (!value) return;
    const input = value.toLowerCase();
    COLOR_WORDS.forEach((word) => {
      if (input.includes(word)) found.add(word);
    });
  };

  product.tags?.forEach((tag) => addIfColor(String(tag)));
  product.variants?.forEach((variant) => {
    addIfColor(String(variant.title ?? ''));
  });

  const colorOptionExists = product.variants?.some((variant) => {
    const title = String(variant.title ?? '').toLowerCase();
    return /color|colour|ngjyra|colore/.test(title);
  });

  if (colorOptionExists || found.size > 0) {
    return Array.from(found).slice(0, 5);
  }

  return [];
}

export function ProductTile({ product, large = false }: { product: Product; large?: boolean }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(false);
  const swatches = useMemo(() => inferColorTokens(product), [product]);

  const imageHeight = large
    ? 'h-[42rem] md:h-[52rem]'
    : 'h-[36rem] md:h-[32rem] lg:h-[36rem]';
export function ProductTile({ product, large = false }: { product: Product; large?: boolean }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(false);

  return (
    <Link
      to={`/products/${product.handle}`}
      className="group relative block bg-panel focus-visible:outline-none"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      <div className={`relative ${imageHeight} px-8 py-10 md:px-10 md:py-12`}>
        {swatches.length > 0 && (
          <div className="pointer-events-none absolute right-3 top-3 flex gap-1">
            {swatches.map((swatch) => (
              <span
                key={`${product.handle}-${swatch}`}
                className="h-[9px] w-[9px] border border-hairline"
                style={{ background: COLOR_MAP[swatch] ?? '#dddddd' }}
                aria-hidden="true"
              />
            ))}
          </div>
        )}

        <motion.div
          animate={
            reduce
              ? { opacity: active ? 0.95 : 1 }
              : { opacity: active ? 0.95 : 1, scale: active ? 1.01 : 1 }
          }
          transition={{ duration: motionTokens.durations.fast, ease: motionTokens.easing.easeOutSoft }}
          className="h-full w-full"
        >
          <RevealImage
            src={product.featuredImage ?? product.images[0]}
            alt={product.title}
            className="h-full w-full"
            fit="contain"
          />
        </motion.div>

        <AnimatePresence>
          {active && (
            <motion.div
              className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 border border-hairline bg-paper px-[10px] py-[6px]"
              initial={{ opacity: 0, y: reduce ? 0 : motionTokens.distances.sm }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 0 }}
              transition={{ duration: motionTokens.durations.fast, ease: motionTokens.easing.easeOutSoft }}
            >
              <p className="max-w-[24ch] truncate text-[1.1rem] uppercase tracking-editorial text-ink">{product.title}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="h-[4.8rem] border-t border-hairline bg-panel/95 px-3 md:h-[4.4rem]">
        <div className="grid h-full grid-cols-[1fr_auto_auto] items-center gap-3 text-[1.05rem] uppercase tracking-editorial text-ink/80">
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
