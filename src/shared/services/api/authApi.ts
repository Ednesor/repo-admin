import type { UserPublicAdminPanel } from "@/types/user.types";
import apiClient from "./axiosInstance";

const AUTH = "/api/v1/auth";
const USUARIOS = "/api/v1/usuarios";


export interface LoginCredentials {
    username: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
}

export interface RefreshTokenRequest {
    refresh_token: string;
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

// Solicita una nueva sesión usando el refresh_token persistido.
// El backend rota tanto el access_token (cookie) como el refresh_token (response body).
export async function refresh(data: RefreshTokenRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(`${AUTH}/refresh`, data, { withCredentials: true });
    return response.data;
}

//export async function logout(): Promise<{ mensaje: string }> {
//    const response = await apiClient.post<{ mensaje: string }>(`${AUTH}/logout`);
//    return response.data;}

// Logout real:
// además de limpiar estado local, revoca el refresh_token en backend.
export async function logout(data: RefreshTokenRequest): Promise<{ mensaje: string }> {
    const response = await apiClient.post<{ mensaje: string }>(`${AUTH}/logout`, data, { withCredentials: true });
    return response.data;
}

export async function getCurrentUser(): Promise<UserPublicAdminPanel> {
    const response = await apiClient.get<UserPublicAdminPanel>(`${USUARIOS}/me`);
    return response.data;
}
