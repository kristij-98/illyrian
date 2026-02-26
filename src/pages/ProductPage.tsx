import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formatPrice, getProductByHandle } from '../lib/data';
import { RevealImage } from '../components/RevealImage';
import { useCart } from '../store/cart';

export function ProductPage() {
  const { handle = '' } = useParams();
  const product = getProductByHandle(handle);
  const [variant, setVariant] = useState(product?.variants?.[0]?.title ?? 'Default');
  const { addItem } = useCart();

  const accordions = useMemo(
    () => [
      { title: 'Details', body: product?.description || 'Crafted to honor Illyrian minimal tailoring.' },
      { title: 'Shipping', body: 'Worldwide dispatch in 2–5 business days.' },
      { title: 'Returns', body: 'Returns accepted within 14 days in original condition.' }
    ],
    [product?.description]
  );

  if (!product) return <main className="p-8">Product not found.</main>;

  return (
    <main className="grid grid-cols-1 md:grid-cols-2">
      <section className="border-r border-hairline">
        {(product.images.length ? product.images : [product.featuredImage]).map((image, idx) => (
          <div key={`${image}-${idx}`} className="border-b border-hairline">
            <RevealImage src={image} alt={product.title} className="aspect-[4/5]" />
          </div>
        ))}
      </section>
      <aside className="md:sticky md:top-16 h-fit p-8">
        <h1 className="editorial-title mb-4 max-w-[28rem]">{product.title}</h1>
        <p className="mb-6 text-[1.6rem]">{formatPrice(product.price)}</p>

        <label className="caption mb-2 block">Variant</label>
        <select className="mb-6 w-full border border-hairline bg-panel p-3" value={variant} onChange={(e) => setVariant(e.target.value)}>
          {(product.variants?.length ? product.variants : [{ title: 'Default' }]).map((item) => (
            <option key={item.title} value={item.title}>{item.title}</option>
          ))}
        </select>

        <button className="w-full border border-hairline bg-ink px-4 py-4 text-[1.1rem] uppercase tracking-editorial text-paper" onClick={() => addItem(product, variant)}>
          Add To Cart
        </button>

        <div className="mt-10 space-y-4">
          {accordions.map((section) => (
            <details key={section.title} className="border-t border-hairline py-3">
              <summary className="cursor-pointer text-[1.1rem] uppercase tracking-editorial">{section.title}</summary>
              <p className="mt-3 text-[1.3rem] leading-relaxed opacity-90" dangerouslySetInnerHTML={{ __html: section.body }} />
            </details>
          ))}
        </div>
      </aside>
    </main>
  );
}
