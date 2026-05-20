import { createBrowserRouter } from 'react-router-dom';
import { ProductsPage } from '@/features/products/pages/ProductsPage';
import { OrdersPage } from '@/features/orders/pages/OrdersPage';
import { App } from '@/App';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
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