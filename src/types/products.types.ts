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
    page?: number;
    size?: number;
    disponible?: boolean;
    categoria_ids?: number[];
    ingrediente_ids?: number[];
}

export interface CreateProductInput {
    nombre: string;
    descripcion: string;
    precio_base: number;
    imagenes_url: string[];
    stock_cantidad: number;
    disponible: boolean;
    categoria_ids: number[];
    ingredientes: { ingrediente_id: number; es_removible: boolean }[]; 
}