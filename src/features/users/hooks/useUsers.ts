import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, createUser, updateUser, deleteUser } from "@/shared/services/api/usersApi";
import type { CreateUserInput, UpdateUserInput } from "@/types/user.types";

interface Props {
    page?: number;
    pageSize?: number;
    rolCodigo?: string;
    enabled?: boolean;
}

export function useUsers({ page = 0, pageSize = 100, rolCodigo, enabled = true }: Props = {}) {
    const queryClient = useQueryClient();

    // --- QUERIES (GET) ---
    // 1. Listar usuarios (Paginados)
    const query = useQuery({
        queryKey: ["users", page, pageSize, rolCodigo],
        queryFn: () =>
            getUsers({
                offset: page * pageSize,
                limit: pageSize,
                rol_codigo: rolCodigo as CreateUserInput["roles_codigos"][number] | undefined,
            }),
        staleTime: 0,
        refetchOnWindowFocus: true,
        placeholderData: (previousData) => previousData,
        enabled,
    });

    // --- MUTATIONS (POST/PUT/DELETE) ---
    // 2. Crear usuario
    const createMutation = useMutation({
        mutationFn: (data: CreateUserInput) => createUser(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });

    // 3. Actualizar usuario
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateUserInput }) =>
            updateUser(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });

    // 4. Eliminar usuario
    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });

    return {
        // Datos
        data: query.data,
        
        // Carga y recarga
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        refetch: query.refetch,
        
        // Acciones
        create: createMutation.mutateAsync,
        update: updateMutation.mutateAsync,
        remove: deleteMutation.mutateAsync,
    };
}
