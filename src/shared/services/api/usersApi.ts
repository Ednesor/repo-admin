import type { GetUsersResponse } from "@/types/api.types";
import type { CreateUserInput, UpdateUserInput, UserFilters, UserPublicAdminPanel } from "@/types/user.types";
import apiClient from "./axiosInstance";

const USUARIOS = "/api/v1/admin/usuarios/";

export async function getUsers(
    filters: UserFilters = {},
): Promise<GetUsersResponse> {
    const params = new URLSearchParams();

    if (filters.page !== undefined) {
        params.append("page", String(filters.page));
    }
    if (filters.size !== undefined) {
        params.append("size", String(filters.size));
    }
    if (filters.rol_codigo) {
        params.append("rol_codigo", filters.rol_codigo);
    }

    const queryString = params.toString();

    const url = queryString ? `${USUARIOS}?${queryString}` : USUARIOS;

    const response = await apiClient.get<GetUsersResponse>(url);
    return response.data;
}

export async function createUser(data: CreateUserInput): Promise<UserPublicAdminPanel> {
    const response = await apiClient.post<UserPublicAdminPanel>(
        `${USUARIOS}createUser`,
        data,
    );
    return response.data;
}

export async function updateUser(
    id: number,
    data: UpdateUserInput,
): Promise<UserPublicAdminPanel> {
    const response = await apiClient.patch<UserPublicAdminPanel>(
        `${USUARIOS}${id}`,
        data,
    );
    return response.data;
}

export async function deleteUser(id: number): Promise<void> {
    await apiClient.delete(`${USUARIOS}${id}`);
}
