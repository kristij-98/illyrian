import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { HomePage } from './pages/HomePage';
import { CollectionsIndexPage } from './pages/CollectionsIndexPage';
import { CollectionPage } from './pages/CollectionPage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { DebugPage } from './pages/DebugPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'collections', element: <CollectionsIndexPage /> },
      { path: 'collections/:handle', element: <CollectionPage /> },
      { path: 'products/:handle', element: <ProductPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'debug', element: <DebugPage /> }
    ]
  }
]);
