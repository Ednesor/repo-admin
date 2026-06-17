import type { CategoriaPublic } from "./categoria.types";
import type { IngredientsPublic } from "./ingredients.types";

// TODO: Cloudinary - Se agregó imagenes_public_id a las interfaces para poder eliminar las imágenes de Cloudinary al actualizar o borrar.
export interface ProductsPublic {
    id: number;
    nombre: string;
    descripcion: string;
    precio_base: string;
    imagenes_url: string[];
    // public_ids de Cloudinary, en PARALELO a imagenes_url (mismo orden e índice). Se persisten para borrar cada imagen al editar/eliminar el producto.
    imagenes_public_id: string[];
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
    // public_ids que se mandan junto a imagenes_url (los devuelve cada upload) para asociar los archivos de Cloudinary al producto.
    imagenes_public_id?: string[];
    stock_cantidad?: number;
    disponible?: boolean;
    categoria_ids: number[];
    ingredientes?: ProductoIngredienteInput[];
}

export type UpdateProductInput = Partial<CreateProductInput>;