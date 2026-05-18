import { createBrowserRouter } from 'react-router-dom';
import { ProductsPage } from '@/features/products/pages/ProductsPage';
import { OrdersPage } from '@/features/orders/pages/OrdersPage';
import { App } from '@/App';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'products',
        element: <ProductsPage />,
      },
      {
        path: 'orders',
        element: <OrdersPage />,
      },
    ],
  },
]);

export { router };