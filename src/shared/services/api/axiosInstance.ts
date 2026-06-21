import axios, { type AxiosError, type AxiosResponse } from "axios";
import { API_BASE_URL } from "./config";
import { useAuthStore } from "@/store/useAuthStore";
import type { LoginResponse } from "./authApi";

// Marcamos el request como reintentado para evitar loops infinitos
// cuando un 401 dispara refresh automático.
type RetryableRequestConfig = NonNullable<AxiosError<unknown>["config"]> & {
    _retry?: boolean;
};

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
        const originalRequest = error.config as RetryableRequestConfig | undefined;

        if (!originalRequest) {
            return Promise.reject(error);
        }

        const requestUrl = originalRequest.url ?? "";
        const isLoginRequest = requestUrl.includes("/auth/login");
        const isRefreshRequest = requestUrl.includes("/auth/refresh");

        // Nunca refrescamos un login fallido, un refresh fallido
        // ni un request que ya fue reintentado.
        if (
            error.response?.status !== 401 ||
            isLoginRequest ||
            isRefreshRequest ||
            originalRequest._retry
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        const { refreshToken, setRefreshToken, clearSession } = useAuthStore.getState();

        if (!refreshToken) {
            clearSession();
            return Promise.reject(error);
        }

        try {
            // Refresh silencioso:
            // llamamos directo al backend para evitar dependencia circular con authApi.ts
            const tokenResponse = await axios.post<LoginResponse>(
                `${API_BASE_URL}/api/v1/auth/refresh`,
                { refresh_token: refreshToken },
                { withCredentials: true }
            );

            // El backend rota refresh tokens, por eso persistimos el nuevo valor
            // antes de reintentar el request original.
            setRefreshToken(tokenResponse.data.refresh_token);

            return apiClient(originalRequest);
        } catch (refreshError) {
            // Si el refresh falla, la sesión ya no es recuperable y se limpia localmente.
            clearSession();
            return Promise.reject(refreshError);
        }
    },
);

export default apiClient;
