import { Outlet } from 'react-router-dom';

export function App() {
  return (
    <div className="min-h-screen bg-blue-50">
      <nav className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex gap-4">
          <a href="/products" className="text-blue-600 hover:underline">
            Products
          </a>
          <a href="/orders" className="text-blue-600 hover:underline">
            Orders
          </a>
        </div>
      </nav>
      <main className="container mx-auto">
        <Outlet />
      </main>
    </div>
  );
}