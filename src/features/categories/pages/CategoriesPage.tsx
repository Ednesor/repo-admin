import { useAuthStore } from "@/store/useAuthStore";

export default function CategoriesPage() {
    const role = useAuthStore((state) => state.role);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Categorias</h1>
            <p className="text-gray-600">Current role: {role}</p>
            {role === "Empleado" && (
                <p className="mt-2 text-blue-600">Acceso Cajero</p>
            )}
        </div>
    );
}
