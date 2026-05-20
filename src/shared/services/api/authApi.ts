import type { UserPublic, UserRegisterPayload } from "@/types/api.types";
import apiClient from "./axiosInstance";

const AUTH = "/auth";

export async function requestLogin(
    username: string,
    password: string,
): Promise<void> {
    const body = new URLSearchParams({ username, password });
    await apiClient.post(`${AUTH}/token`, body, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
}

export async function requestRegister(
  payload: UserRegisterPayload,
): Promise<UserPublic> {
  const response = await apiClient.post<UserPublic>(
    `${AUTH}/register`,
    payload,
  );
  return response.data;
}

export async function requestMe(): Promise<UserPublic> {
  const response = await apiClient.get<UserPublic>(`${AUTH}/me`);
  return response.data;
}

export async function requestLogout(): Promise<void> {
  await apiClient.post(`${AUTH}/logout`);
}
