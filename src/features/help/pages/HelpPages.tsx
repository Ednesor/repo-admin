import { useAuthStore } from '@/store/useAuthStore';
export default function HelpPages() {
  const roles = useAuthStore((state) => state.roles);
  const roleName = roles[0]?.nombre || 'Usuario';
  
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Help</h1>
        <p className="text-gray-600">Current role: {roleName}</p>
        {roles.some(r => r.codigo === 'PEDIDOS') && (
          <p className="mt-2 text-blue-600">Acceso Cajero / Pedidos</p>
        )}
      </div>
    );
}
