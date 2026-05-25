import apiClient from "./axiosInstance";

export async function getCategoriesTree() {
    const response = await apiClient.get("/categorias/arbol");

    return response.data;
}