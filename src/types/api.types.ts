import type { ProductsPublic } from "./products.types";
import type { UserPublicAdminPanel } from "./user.types";
import type { PaginatedResponse } from "./pagination.types";

export interface CategoriaCreatePayload {
    nombre: string;
    descripcion?: string;
}

export interface CategoriaUpdatePayload {
    nombre?: string;
    descripcion?: string;
}

export type GetProductsResponse = PaginatedResponse<ProductsPublic>;

export type GetUsersResponse = PaginatedResponse<UserPublicAdminPanel>;

export type ApiListResponseMultiple<T> = PaginatedResponse<T>;