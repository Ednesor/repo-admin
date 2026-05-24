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