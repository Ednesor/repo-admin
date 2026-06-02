import type { UserPublic } from "@/types/user.types";
import apiClient from "./axiosInstance";

const AUTH = "/api/v1/auth";
const USUARIOS = "/api/v1/usuarios";

//TODO : Feature faltante - El backend tiene endpoints en `/admin/usuarios` para crear, listar, editar roles y eliminar usuarios. El frontend no implementa `usersApi.ts`, por lo que no hay forma de administrar usuarios desde la UI.

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface LoginResponse {
    mensaje: string;
    access_token: string;
    token_type: string;
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
    const body = new URLSearchParams({
        username: credentials.username,
        password: credentials.password,
    });
    const response = await apiClient.post<LoginResponse>(`${AUTH}/login`, body, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        withCredentials: true,
    });
    return response.data;
}

export async function logout(): Promise<{ mensaje: string }> {
    const response = await apiClient.post<{ mensaje: string }>(`${AUTH}/logout`);
    return response.data;
}

//TODO : BUG GRAVE - `getCurrentUser` está tipeado como `Promise<UserPublic>` pero el backend `/usuarios/me` devuelve `UserPublicAdminPanel` que incluye `roles: List[RolPublic]`. Esto causa que el store nunca reciba los roles reales del backend y tenga que inferirlos por email (ver `useAuthStore.getDefaultRoleForUser`). Debe cambiarse a `Promise<UserPublicAdminPanel>`.
export async function getCurrentUser(): Promise<UserPublic> {
    const response = await apiClient.get<UserPublic>(`${USUARIOS}/me`);
    return response.data;
}
