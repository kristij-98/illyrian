import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { formatPrice } from '../lib/data';
import { RevealImage } from './RevealImage';

export function ProductTile({ product, large = false }: { product: Product; large?: boolean }) {
  return (
    <Link to={`/products/${product.handle}`} className="group relative border border-hairline bg-panel">
      <motion.div whileHover={{ scale: 1.01, opacity: 0.95 }} transition={{ duration: 0.18 }}>
        <RevealImage
          src={product.featuredImage ?? product.images[0]}
          alt={product.title}
          className={large ? 'aspect-[4/5] p-16 object-contain' : 'aspect-square p-10 object-contain'}
        />
      </motion.div>
      <div className="pointer-events-none absolute bottom-3 left-3">
        <p className="caption underline-hover inline-block">{product.title}</p>
        <p className="caption">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
