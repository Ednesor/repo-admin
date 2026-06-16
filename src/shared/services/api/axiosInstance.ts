import axios, { type AxiosError, type AxiosResponse } from "axios";
import { getApiBase } from "./config";
import { useAuthStore } from "@/store/useAuthStore";

export const apiClient = axios.create({
    baseURL: getApiBase(),
    withCredentials: true,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

let isRefreshing = false;

apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && originalRequest && !originalRequest.headers._retry) {
            
            if (isRefreshing) {
                return Promise.reject(error);
            }

            originalRequest.headers._retry = true;
            isRefreshing = true;

            try {
                await apiClient.post("/api/v1/auth/refresh"); 
                
                isRefreshing = false;
                
                return apiClient(originalRequest);
            } catch (refreshError) {
                isRefreshing = false;
                console.warn("Refresh token expirado, cerrando sesión...");
                useAuthStore.getState().clearSession();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;