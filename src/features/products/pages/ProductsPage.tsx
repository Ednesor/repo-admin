import { useAuthStore } from '@/store/useAuthStore';

export function ProductsPage() {
  const role = useAuthStore((state) => state.role);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <p className="text-gray-600">Current role: {role}</p>
      {role === 'Admin' && (
        <p className="mt-2 text-green-600">Acceso completo a productos</p>
      )}
    </div>
  );
}