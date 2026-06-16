src\features\auth\hooks\useAuth.ts

import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import type { LoginCredentials } from "@/shared/services/api/authApi";

export function useLogin() {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const setError = useAuthStore((state) => state.setError);

    return useMutation({
        mutationFn: async (credentials: LoginCredentials) => {
            await login(credentials.username, credentials.password);
        },
        onSuccess: () => {
            navigate("/panel");
        },
        onError: (error: Error) => {
            setError(error.message || "Credenciales inválidas");
        },
    });
}

export function useLogout() {
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);

    return useMutation({
        mutationFn: async () => {
            await logout();
        },
        onSuccess: () => {
            navigate("/");
        },
        onError: () => {
            navigate("/");
        },
    });
}

export function useCurrentUser() {
    const checkAuth = useAuthStore((state) => state.checkAuth);

    return useQuery({
        queryKey: ["currentUser"],
        queryFn: checkAuth,
        retry: false,
        staleTime: 5 * 60 * 1000,
    });
}

export function useRequireAuth() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isLoadingInitial = useAuthStore((state) => state.isLoadingInitial);

    return {
        isAuthenticated,
        isLoading: isLoadingInitial,
    };
}


src\features\categories\hooks\useCategories.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCategories, getCategoriesTree, getCategoryById, createCategory, updateCategory, deleteCategory } from "@/shared/services/api/categoriesApi";
import type { CreateCategoryInput, UpdateCategoryInput } from "@/types/categoria.types";

interface Props {
    page: number;
    pageSize: number;
}

export interface UseCategoryOptions {
    id: number;
    enabled?: boolean;
}

export function useCategories({ page, pageSize }: Props) {
    return useQuery({
        queryKey: ["categories", page, pageSize],
        queryFn: async () => {
            const data = await getCategories(page * pageSize, pageSize);
            return data || { data: [], total: 0 };
        },
        staleTime: 5 * 60 * 1000, 
        refetchOnWindowFocus: false,
        retry: 1
    });
}

export function useCategoriesTree() {
    return useQuery({
        queryKey: ["categories-tree"],
        queryFn: async () => {
            const data = await getCategoriesTree();
            return data || [];
        },
        staleTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1
    });
}

export function useCategory({ id, enabled = true }: UseCategoryOptions) {
    return useQuery({
        queryKey: ["category", id],
        queryFn: async () => {
            const data = await getCategoryById(id);
            if (!data) throw new Error("Categoría no encontrada");
            return data;
        },
        enabled: enabled && id > 0,
        retry: 1
    });
}


// Create Category
export function useCreateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCategoryInput) => createCategory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["categories-tree"] });
        },
    });
}

// Update category

export function useUpdateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            data: UpdateCategoryInput;
        }) => updateCategory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["categories-tree"] });
        },
    });
}

// Delete category

export function useDeleteCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["categories-tree"] });
        },
    });
}


src\features\categories\hooks\useCategoriesTable.ts

import { useState } from "react";
import type { ColumnFiltersState, SortingState } from "@tanstack/react-table";

export function useCategoriesTable() {
    const [page, setPage] = useState(0);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    return {
        page,
        setPage,
        sorting,
        setSorting,
        columnFilters,
        setColumnFilters,
    };
}

src\features\ingredients\hooks\useIngredients.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getIngredientsList, getIngredientById, createIngredient, updateIngredient, deleteIngredient } from "@/shared/services/api/ingredientsApi";
import type { CreateIngredientInput, UpdateIngredientInput } from "@/types/ingredients.types";

interface Props {
    page: number;
    pageSize: number;
}

export interface UseIngredientOptions {
    id: number;
    enabled?: boolean;
}

export function useIngredients() {
    return useQuery({
        queryKey: ["ingredients"],
        queryFn: async () => {
            try {
                const response = await getIngredientsList(0, 100);
                return response?.items ??  [];
            } catch (error) {
                console.error("Error al cargar ingredientes en productos:", error);
                return []; 
            }
        },
        retry: false
    });
}

export function useIngredientsAll() {
    return useQuery({
        queryKey: ["ingredients"],
        queryFn: async () => {
            try {
                const data = await getIngredientsList();
                return data || []; 
            } catch (error) {
                console.error("Error al cargar ingredientes:", error);
                return [];
            }
        },
        staleTime: 5 * 60 * 1000,
        retry: false
    });
}

export function useIngredient({ id, enabled = true }: UseIngredientOptions) {
    return useQuery({
        queryKey: ["ingredient", id],
        queryFn: async () => {
            const data = await getIngredientById(id);
            return data || null;
        },
        enabled: enabled && !!id,
        staleTime: 60 * 1000,
        retry: false
    });
}

// Create Ingredient
export function useCreateIngredient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateIngredientInput) => createIngredient(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ingredients"] });
        },
    });
}

// Update Ingredient
export function useUpdateIngredient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            data: UpdateIngredientInput;
        }) => updateIngredient(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ingredients"] });
        },
    });
}

// Delete Ingredient
export function useDeleteIngredient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteIngredient(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ingredients"] });
        },
    });
}


src\features\ingredients\hooks\useIngredientsTable.ts

import { useState } from "react";
import type { ColumnFiltersState, SortingState } from "@tanstack/react-table";

export function useIngredientsTable() {
    const [page, setPage] = useState(0);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    return {
        page,
        setPage,
        sorting,
        setSorting,
        columnFilters,
        setColumnFilters,
    };
}

src\features\products\hooks\useIngredients.ts

import { useQuery } from "@tanstack/react-query";
import { getIngredients } from "@/shared/services/api/ingredientsApi";

export function useIngredients() {
    return useQuery({
        queryKey: ["ingredients"],
        queryFn: getIngredients,
    });
}

src\features\products\hooks\useProducts.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from "@/shared/services/api/productsApi";
import type { CreateProductInput } from "@/types/products.types";

interface Props {
    page: number;
    pageSize: number;
    avaliable?: boolean;
    categoryIds?: number[];
    ingredientIds?: number[];
}

export interface UseProductOptions {
    id: number;
    enabled?: boolean;
}

const EMPTY_PRODUCTS_RESPONSE = { data: [], total: 0 };

export function useProducts({
    page,
    pageSize,
    avaliable = true,
    categoryIds,
    ingredientIds,
}: Props) {
    return useQuery({
        queryKey: [
            "products",
            page,
            pageSize,
            avaliable,
            categoryIds,
            ingredientIds,
        ],
        queryFn: async () => {
            try {
                const response = await getProducts({
                    offset: page * pageSize,
                    limit: pageSize,
                    include_only_active: avaliable,
                    categoria_ids: categoryIds,
                    ingrediente_ids: ingredientIds,
                });
                return response ?? EMPTY_PRODUCTS_RESPONSE;
            } catch (error) {
                console.error("Error al cargar productos:", error);
                return EMPTY_PRODUCTS_RESPONSE;
            }
        },
        staleTime: 0,
        refetchOnWindowFocus: false,
        retry: false,
        placeholderData: (previousData) => previousData,
    });
}

export function useProduct({ id, enabled = true }: UseProductOptions) {
    return useQuery({
        queryKey: ["product", id],
        queryFn: () => getProductById(id),
        enabled,
    });
}

// create Product
export function useCreateProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateProductInput) => createProduct(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
}

// update Product
export function useUpdateProduct() { 
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number, data: CreateProductInput }) => updateProduct(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
}

// delete Product
export function useDeleteProduct() { 
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
}


src\features\products\hooks\useProductsTable.ts

import { useState } from "react";
import type { ColumnFiltersState, SortingState } from "@tanstack/react-table";

export function useProductsTable() {
    const [page, setPage] = useState(0);

    const [sorting, setSorting] = useState<SortingState>([]);

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    return {
        page,
        setPage,
        sorting,
        setSorting,
        columnFilters,
        setColumnFilters,
    };
}
