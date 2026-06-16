import type { PaginatedResponse } from "./pagination.types";

export interface IngredientsPublic {
    id: number;
    nombre: string;
    es_alergeno: boolean;
}

export interface IngredientDetail {
    id: number;
    nombre: string;
    es_alergeno: boolean;
    descripcion: string;
    productos: {
        id: number;
        nombre: string;
    }[];
}

export interface CreateIngredientInput {
    nombre: string;
    es_alergeno: boolean;
    descripcion: string;
}

export interface UpdateIngredientInput {
    nombre?: string;
    es_alergeno?: boolean;
    descripcion?: string;
}

export type GetIngredientsResponse = PaginatedResponse<IngredientsPublic>;