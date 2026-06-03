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
): Promise<GetCategoriesResponse> {
    //TODO : Deuda técnica - El backend permite filtrar por "is_principal", "parent_id" y "estado". El frontend actualmente ignora estos filtros en el GET, limitando la capacidad de la tabla.
    const params = new URLSearchParams();

    if (offset !== undefined) {
        params.append("offset", String(offset));
    }
    if (limit !== undefined) {
        params.append("limit", String(limit));
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
    //TODO : Deuda técnica - El backend acepta un query param "?incluir_eliminado=true" para traer categorías dadas de baja, el frontend no lo expone.
    const response = await apiClient.get<CategoriaDetail>(
        `${CATEGORIAS}${id}/`,
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
    const response = await apiClient.patch(`${CATEGORIAS}${id}/`, data);
    return response.data;
}

export async function deleteCategory(id: number): Promise<void> {
    await apiClient.delete(`${CATEGORIAS}${id}/`);
}