import type {
    CategoriaDetail,
    CreateCategoryInput,
    GetCategoriesResponse,
    UpdateCategoryInput,
    CategoryTreeResponse,
} from "@/types/categoria.types";
import apiClient from "./axiosInstance";

const CATEGORIAS = "/api/v1/categorias/";

export async function getCategories(
    offset?: number,
    limit?: number,
    estado?: string,
    is_principal?: boolean,
    parent_id?: number,
): Promise<GetCategoriesResponse> {
    const params = new URLSearchParams();

    if (offset !== undefined) {
        params.append("offset", String(offset));
    }
    if (limit !== undefined) {
        params.append("limit", String(limit));
    }
    if (estado !== undefined) {
        params.append("estado", estado);
    }
    if (is_principal !== undefined) {
        params.append("is_principal", String(is_principal));
    }
    if (parent_id !== undefined) {
        params.append("parent_id", String(parent_id));
    }
    const queryString = params.toString();
    const url = queryString ? `${CATEGORIAS}?${queryString}` : CATEGORIAS;

    const response = await apiClient.get<GetCategoriesResponse>(url);
    return response.data;
}

export async function getCategoriesTree(): Promise<CategoryTreeResponse> {
    const response = await apiClient.get<CategoryTreeResponse>(
        `${CATEGORIAS}arbol`,
    );
    return response.data;
}

export async function getCategoryById(
    id: number,
): Promise<CategoriaDetail> {
    const response = await apiClient.get<CategoriaDetail>(
        `${CATEGORIAS}${id}`,
    );
    return response.data;
}

export async function createCategory(
    data: CreateCategoryInput,
): Promise<CategoriaDetail> {
    const response = await apiClient.post(CATEGORIAS, data);
    return response.data;
}

export async function updateCategory(
    id: number,
    data: UpdateCategoryInput,
): Promise<CategoriaDetail> {
    const response = await apiClient.patch(`${CATEGORIAS}${id}`, data);
    return response.data;
}

export async function deleteCategory(id: number): Promise<void> {
    // Rutas sin barra final (`${id}` en vez de `${id}/`) en get/update/delete para coincidir con el backend.
    await apiClient.delete(`${CATEGORIAS}${id}`);
}