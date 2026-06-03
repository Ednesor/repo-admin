import { Outlet } from 'react-router-dom';

export function App() {
  return (
    //TODO : Deuda técnica - Los links del nav (`/products`, `/orders`) no coinciden con las rutas reales definidas en AppRouter (`/productos`, `/pedidos`). Estos links van a devolver 404.
    //TODO : Deuda técnica - Este componente App.tsx tiene su propio `<nav>` y `<main>`, pero el router ya renderiza `<DashboardLayout>` que incluye su propia navbar. Este App.tsx parece ser un remanente de una versión anterior y probablemente no se esté usando.
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