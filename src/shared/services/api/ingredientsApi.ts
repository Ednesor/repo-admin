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
    const response = await apiClient.get<{ data: IngredientsPublic[] }>(`${INGREDIENTES}?limit=1000`);
    return response.data.data;
}

export async function getIngredientsList(
    offset?: number,
    limit?: number,
    estado?: string,
    is_alergeno?: boolean,
): Promise<GetIngredientsResponse> {
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
    if (is_alergeno !== undefined) {
        params.append("is_alergeno", String(is_alergeno));
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