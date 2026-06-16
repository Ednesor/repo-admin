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
    page?: number,
    size?: number,
): Promise<GetCategoriesResponse> {
    const params = new URLSearchParams();

    if (page !== undefined) params.append("page", String(page));
    if (size !== undefined) params.append("size", String(size));

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