import type { UserPublic } from "@/types/user.types";
import apiClient from "./axiosInstance";

const AUTH = "/api/v1/auth";
const USUARIOS = "/api/v1/usuarios";

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

export async function getCurrentUser(): Promise<UserPublic> {
    const response = await apiClient.get<UserPublic>(`${USUARIOS}/me`);
    return response.data;
}
