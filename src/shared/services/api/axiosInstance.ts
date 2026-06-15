import axios, { type AxiosError, type AxiosResponse } from "axios";
import { API_BASE_URL } from "./config";
import { useAuthStore } from "@/store/useAuthStore";

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

apiClient.interceptors.request.use(
    (config) => {
        return config;
    },
    (error: AxiosError) => {
        console.error("Error en request: ", error);
        return Promise.reject(error);
    },
);

apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError) => {
        if (error.response?.status === 401) {
            console.warn("Session expirada (401), limpiando...");
            useAuthStore.getState().clearSession();
        }
        return Promise.reject(error);
    },
);

export default apiClient;
