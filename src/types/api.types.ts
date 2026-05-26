import type { ProductsPublic } from "./products.types";

export interface CategoriaCreatePayload {
    nombre: string;
    descripcion?: string;
}

export interface GetProductsResponse {
    data: ProductsPublic[];
    total: number;
}

export interface CategoriaUpdatePayload {
    nombre?: string;
    descripcion?: string;
}
