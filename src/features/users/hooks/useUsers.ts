import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, createUser, updateUser, deleteUser } from "@/shared/services/api/usersApi";
import type { CreateUserInput, UpdateUserInput } from "@/types/user.types";


interface Props {
    page: number;
    pageSize: number;
    rolCodigo?: string;
}

export function useUsers({ page, pageSize, rolCodigo }: Props) {
    return useQuery({
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
    });
}

// create User
export function useCreateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateUserInput) => createUser(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
}

// update User
export function useUpdateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateUserInput }) =>
            updateUser(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
}

// delete User
export function useDeleteUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
}
