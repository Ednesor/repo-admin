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
    //TODO : BUG GRAVE - Esta función no envía parámetros de paginación. El backend tiene `limit=20` por defecto, por lo que solo se obtienen los primeros 20 ingredientes. Cualquier filtro o select que asuma tener TODOS los ingredientes está roto.
    const response = await apiClient.get<{ data: IngredientsPublic[] }>(
        INGREDIENTES,
    );
    return response.data.data;
}

export async function getIngredientsList(
    offset?: number,
    limit?: number,
): Promise<GetIngredientsResponse> {
    //TODO : Deuda técnica - El backend acepta filtros por "estado" e "is_alergeno". El frontend no envía ninguno de los dos a pesar de ser útiles para las tablas.
    const params = new URLSearchParams();

    if (offset !== undefined) {
        params.append("offset", String(offset));
    }
    if (limit !== undefined) {
        params.append("limit", String(limit));
    }

    const queryString = params.toString();
    const url = queryString ? `${INGREDIENTES}?${queryString}` : INGREDIENTES;

    const response = await apiClient.get<GetIngredientsResponse>(url);
    return response.data;
}

export async function getIngredientById(
    id: number,
): Promise<IngredientDetail> {
    //TODO : Deuda técnica - Falta mapear el parámetro "?incluir_eliminado=true" que permite ver un ingrediente aunque haya sufrido soft-delete.
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