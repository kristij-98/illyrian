import { formatPrice } from '../lib/data';
import { useCart } from '../store/cart';

export function CartPage() {
  const { items, updateQty, removeItem } = useCart();
  const total = items.reduce((sum, item) => {
    const raw = typeof item.price === 'string' ? Number(item.price) : item.price ?? 0;
    const value = raw > 1000 ? raw / 100 : raw;
    return sum + value * item.qty;
  }, 0);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 md:px-8">
      <h1 className="editorial-title mb-8">Cart</h1>
      <div className="border border-hairline">
        {items.map((item) => (
          <div key={item.handle} className="grid grid-cols-[1fr_auto] border-b border-hairline p-4">
            <div>
              <p className="text-[1.2rem] uppercase tracking-editorial">{item.title}</p>
              <p className="caption">{formatPrice(item.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQty(item.handle, item.qty - 1)}>-</button>
              <span>{item.qty}</span>
              <button onClick={() => updateQty(item.handle, item.qty + 1)}>+</button>
              <button onClick={() => removeItem(item.handle)} className="underline-hover ml-3">Remove</button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-between border-t border-hairline pt-4 text-[1.2rem] uppercase tracking-editorial">
        <span>Total</span>
        <span>€{total.toFixed(2)}</span>
      </div>
    </main>
  );
}
