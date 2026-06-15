import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, createUser as apiCreateUser, updateUser as apiUpdateUser, deleteUser as apiDeleteUser } from "@/shared/services/api/usersApi";
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
    const getUsersAll = useQuery({
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
    const createUser = useMutation({
        mutationFn: (data: CreateUserInput) => apiCreateUser(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });

    // 3. Actualizar usuario
    const updateUser = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateUserInput }) =>
            apiUpdateUser(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });

    // 4. Eliminar usuario
    const deleteUser = useMutation({
        mutationFn: (id: number) => apiDeleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });

    return {
        // Datos
        data: getUsersAll.data,

        // Carga y recarga
        isLoading: getUsersAll.isLoading,
        isFetching: getUsersAll.isFetching,
        isError: getUsersAll.isError,
        refetch: getUsersAll.refetch,

        // Acciones
        createUser: createUser.mutateAsync,
        updateUser: updateUser.mutateAsync,
        deleteUser: deleteUser.mutateAsync,
    };
}
