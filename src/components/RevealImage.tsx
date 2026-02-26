import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { motionTokens } from '../motion/tokens';

export function RevealImage({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  const reduce = useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  if (!src) return <div className={`bg-panel ${className ?? ''}`} />;
  return (
    <div className={`overflow-hidden bg-panel ${className ?? ''}`}>
      <motion.img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        initial={reduce ? { opacity: 0 } : { opacity: 0, clipPath: 'inset(0 0 100% 0)', filter: 'blur(8px)' }}
        animate={
          reduce
            ? { opacity: loaded ? 1 : 0.2 }
            : { opacity: loaded ? 1 : 0.2, clipPath: 'inset(0 0 0 0)', filter: loaded ? 'blur(0px)' : 'blur(8px)' }
        }
        transition={{ duration: motionTokens.durations.slow, ease: motionTokens.easing.easeOutSoft }}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
