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
    include_only_active?: boolean;
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
    //TODO : BUG GRAVE - El backend espera `ingredientes: { ingrediente_id: number, es_removible: boolean }[]` (array de objetos con id + flag booleano), pero el frontend envía `ingrediente_ids: number[]` (array plano de números). Esto causa que la creación y edición de productos FALLE con error de validación. Debe cambiarse a `ingredientes: { ingrediente_id: number; es_removible: boolean }[]`.
    ingrediente_ids: number[];
}