import { useAuthStore } from '@/store/useAuthStore';
import React from 'react'

export default function ClientsPage() {
  const role = useAuthStore((state) => state.role);
  
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Clients</h1>
        <p className="text-gray-600">Current role: {role}</p>
        {role === 'Empleado' && (
          <p className="mt-2 text-blue-600">Acceso Cajero</p>
        )}
      </div>
    );
}
