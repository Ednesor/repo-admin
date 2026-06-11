import { useAuthStore } from '@/store/useAuthStore';

export default function ClientsPage() {
  const roles = useAuthStore((state) => state.roles);
  
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Clients</h1>
        <p className="text-gray-600">Current role: {roles.map(r => r.codigo).join(', ')}</p>
        {roles.some(r => r.codigo === 'ADMIN') && (
          <p className="mt-2 text-blue-600">Acceso Administrador</p>
        )}
      </div>
    );
}
