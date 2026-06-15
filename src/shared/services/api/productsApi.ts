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
    if (filters.disponible !== undefined) {
        params.append("disponible", String(filters.disponible));
    }
    if (filters.q !== undefined) {
        params.append("q", filters.q);
    }
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
    return response.data;
}

export async function updateProduct(
    id: number,
    data: UpdateProductInput,
): Promise<ProductsPublic> {
    const response = await apiClient.patch(`${PRODUCTOS}${id}/`, data);
    return response.data;
}

export async function toggleProductAvailability(id: number): Promise<ProductsPublic> {
    const response = await apiClient.patch(`${PRODUCTOS}${id}/disponibilidad`);
    return response.data;
}

export async function deleteProduct(id: number): Promise<void> {
    await apiClient.delete(`/productos/${id}/`);
}