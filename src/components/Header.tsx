import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../store/cart';

export function Header({ onSearch }: { onSearch: () => void }) {
  const { items, setDrawerOpen } = useCart();
  const count = items.reduce((sum, item) => sum + item.qty, 0);
  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4 md:px-8">
        <nav className="flex items-center gap-5 text-[1.1rem] uppercase tracking-editorial">
          <NavLink className="underline-hover" to="/collections/new-arrivals">New Arrivals</NavLink>
          <NavLink className="underline-hover" to="/collections/mens-wear">Men</NavLink>
          <NavLink className="underline-hover" to="/collections/womens-wear">Women</NavLink>
        </nav>
        <Link to="/" className="text-[1.3rem] uppercase tracking-[0.2em]">Illyrian Bloodline</Link>
        <div className="flex items-center gap-5 text-[1.1rem] uppercase tracking-editorial">
          <button className="underline-hover" onClick={onSearch}>Search</button>
          <button className="underline-hover" onClick={() => setDrawerOpen(true)}>Cart ({count})</button>
        </div>
      </div>
    </header>
  );
}
