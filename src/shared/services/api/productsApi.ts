import type { GetProductsResponse } from "@/types/api.types";
import type { ProductFilters, CreateProductInput, ProductsPublic } from "@/types/products.types";
import apiClient from "./axiosInstance";

const PRODUCTOS = "/api/v1/productos/";

export async function getProducts(
    filters: ProductFilters = {},
): Promise<GetProductsResponse> {
    const params = new URLSearchParams();

    if (filters.page !== undefined) params.append("page", String(filters.page));
    if (filters.size !== undefined) params.append("size", String(filters.size));
    
    // BUG ARREGLADO: El backend espera 'disponible' en vez de 'include_only_active'
    if (filters.disponible !== undefined) {
        params.append("disponible", String(filters.disponible));
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
    data: CreateProductInput,
): Promise<ProductsPublic> {
    const response = await apiClient.patch(`${PRODUCTOS}${id}/`, data);
    return response.data;
}

export async function deleteProduct(id: number): Promise<void> {
    // BUG ARREGLADO: Faltaba la constante PRODUCTOS
    await apiClient.delete(`${PRODUCTOS}${id}/`);
}