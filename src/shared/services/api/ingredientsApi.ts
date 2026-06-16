import type {
    IngredientDetail,
    CreateIngredientInput,
    UpdateIngredientInput,
    GetIngredientsResponse,
    IngredientsPublic,
} from "@/types/ingredients.types";
import apiClient from "./axiosInstance";

const INGREDIENTES = "/api/v1/ingredientes/";

export async function getIngredients(): Promise<IngredientsPublic[]> {
    const response = await apiClient.get<GetIngredientsResponse>(
        `${INGREDIENTES}?page=1&size=100`
    );
    return response.data.items;
}

export async function getIngredientsList(
    page?: number,
    size?: number,
): Promise<GetIngredientsResponse> {
    const params = new URLSearchParams();

    if (page !== undefined) {
        params.append("page", String(page));
    }
    if (size !== undefined) {
        params.append("size", String(size));
    }

    const queryString = params.toString();
    const url = queryString ? `${INGREDIENTES}?${queryString}` : INGREDIENTES;

    const response = await apiClient.get<GetIngredientsResponse>(url);
    return response.data;
}

export async function getIngredientById(
    id: number,
): Promise<IngredientDetail> {
    const response = await apiClient.get<IngredientDetail>(
        `${INGREDIENTES}${id}/`,
    );
    return response.data;
}

export async function createIngredient(
    data: CreateIngredientInput,
): Promise<IngredientDetail> {
    const response = await apiClient.post(INGREDIENTES, data);
    return response.data;
}

export async function updateIngredient(
    id: number,
    data: UpdateIngredientInput,
): Promise<IngredientDetail> {
    const response = await apiClient.patch(`${INGREDIENTES}${id}/`, data);
    return response.data;
}

export async function deleteIngredient(id: number): Promise<void> {
    await apiClient.delete(`${INGREDIENTES}${id}/`);
}