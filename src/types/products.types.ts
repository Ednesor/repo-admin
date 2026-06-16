import type { CategoriaPublic } from "./categoria.types";
import type { IngredientsPublic } from "./ingredients.types";

export interface ProductsPublic {
    id: number;
    nombre: string;
    descripcion: string;
    precio_base: string;
    imagenes_url: string[];
    stock_cantidad: number;
    disponible: boolean;
    categorias: CategoriaPublic[];
    ingredientes: IngredientsPublic[];
}

export interface ProductFilters {
    offset?: number;
    limit?: number;
    disponible?: boolean;
    categoria_ids?: number[];
    ingrediente_ids?: number[];
    q?: string;
}

export interface ProductoIngredienteInput {
    ingrediente_id: number;
    es_removible: boolean;
}

export interface CreateProductInput {
    nombre: string;
    descripcion?: string;
    unidad_venta_id?: number;
    precio_base: number;
    imagenes_url?: string[];
    stock_cantidad?: number;
    disponible?: boolean;
    categoria_ids: number[];
    ingredientes?: ProductoIngredienteInput[];
}

export type UpdateProductInput = Partial<CreateProductInput>;