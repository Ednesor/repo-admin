import type { IngredientsPublic } from "@/types/ingredients.types";
import apiClient from "./axiosInstance";

export async function getIngredients(): Promise<IngredientsPublic[]> {
    const response = await apiClient.get("/ingredientes/");

    return response.data.data;
}
