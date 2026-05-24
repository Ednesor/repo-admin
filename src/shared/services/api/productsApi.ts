import type { GetProductsResponse } from "@/types/api.types";
import type { ProductFilters } from "@/types/products.types";
import apiClient from "./axiosInstance";

const PRODUCTOS = "/productos/";

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
    if (filters.include_only_active !== undefined) {
        params.append(
            "include_only_active",
            String(filters.include_only_active),
        );
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

// import type { GetProductsResponse } from "@/types/api.types";

// export async function requestProducts(
//     filters: ProductFilters = {},
// ): Promise<GetProductsResponse[]> {
//     const params = new URLSearchParams();

//     if (filters.offset !== undefined) {
//         params.append("offset", String(filters.offset));
//     }
//     if (filters.limit !== undefined) {
//         params.append("limit", String(filters.limit));
//     }
//     if (filters.include_only_active !== undefined) {
//         params.append(
//             "include_only_active",
//             String(filters.include_only_active),
//         );
//     }
//     if (filters.categoria_ids?.length) {
//         filters.categoria_ids.forEach((id) =>
//             params.append("categoria_ids", String(id)),
//         );
//     }
//     if (filters.ingrediente_ids?.length) {
//         filters.ingrediente_ids.forEach((id) =>
//             params.append("ingrediente_ids", String(id)),
//         );
//     }

//     const queryString = params.toString();
//     const url = queryString ? `${PRODUCTS}?${queryString}` : PRODUCTS;

//     const response = await apiClient.get<Product[]>(url);
//     return response.data;
// }
