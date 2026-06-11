import type { GetProductsResponse } from "@/types/api.types";
import type { ProductFilters, CreateProductInput, ProductsPublic, UpdateProductInput } from "@/types/products.types";
import apiClient from "./axiosInstance";

const PRODUCTOS = "/api/v1/productos/";

export async function getProducts(
    filters: ProductFilters = {},
): Promise<GetProductsResponse> {
    const params = new URLSearchParams();

    if (filters.offset !== undefined) {
        params.append("offset", String(filters.offset));
    }
    if (filters.limit !== undefined) {
        params.append("limit", String(filters.limit));
    }
    //TODO : BUG GRAVE - El frontend envía `include_only_active` como string ("true"/"false") pero el backend espera `disponible` como boolean. Este parámetro se ignora completamente en el backend, causando que el filtro "solo disponibles" nunca funcione.
    if (filters.include_only_active !== undefined) {
        params.append(
            "include_only_active",
            String(filters.include_only_active),
        );
    }
    //TODO : Deuda técnica - Falta implementar el parámetro "q" en los filtros del frontend para permitir la búsqueda de productos por nombre/descripción, algo que el backend ya soporta.
    if (filters.categoria_ids?.length) {
        filters.categoria_ids.forEach((id) =>
            params.append("categoria_ids", String(id)),
        );
    }
    if (filters.ingrediente_ids?.length) {
        filters.ingrediente_ids.forEach((id) =>
            params.append("ingrediente_ids", String(id)),
        );
    }

    const queryString = params.toString();

    const url = queryString ? `${PRODUCTOS}?${queryString}` : PRODUCTOS;

    const response = await apiClient.get<GetProductsResponse>(url);
    return response.data;
}

export async function createProduct(data: CreateProductInput) {
    const response = await apiClient.post(PRODUCTOS, data);
    return response.data;
}

export async function getProductById(id: number): Promise<ProductsPublic> {
    const response = await apiClient.get<ProductsPublic>(`${PRODUCTOS}${id}`);
    //TODO : Deuda técnica - console.log en producción que expone datos de respuesta de la API. Debe eliminarse.
    console.log("getProductById response:", response.data);
    return response.data;
}

export async function updateProduct(
    id: number,
    data: UpdateProductInput,
): Promise<ProductsPublic> {
    const response = await apiClient.patch(`${PRODUCTOS}${id}/`, data);
    return response.data;
}

//TODO : Deuda técnica - El backend tiene un endpoint especializado `PATCH /productos/{id}/disponibilidad` para activar/desactivar un producto rápidamente sin enviar todo el payload. El frontend debería implementar una función `toggleProductAvailability` para usarlo.

export async function deleteProduct(id: number): Promise<void> {
    await apiClient.delete(`/productos/${id}/`);
}