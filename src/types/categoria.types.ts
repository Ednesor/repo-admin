export interface CategoriaPublic {
    parent_id: number | null;
    nombre: string;
    descripcion: string;
    imagen_url: string;
    id: number;
    //TODO : Deuda técnica - El backend solo devuelve `subcategorias` cuando se llama al endpoint `/arbol`. En un GET normal, este campo viene vacío o undefined. Debería ser opcional `subcategorias?: CategoriaPublic[]`.
    subcategorias: CategoriaPublic[];
    productos?: { id: number; nombre: string }[];
}

export interface CategoriaDetail {
    id: number;
    parent_id: number | null;
    nombre: string;
    descripcion: string;
    imagen_url: string;
    subcategorias: CategoriaPublic[];
    productos: { id: number; nombre: string }[];
}

export interface CreateCategoryInput {
    parent_id: number | null;
    nombre: string;
    descripcion: string;
    imagen_url: string;
}

export interface UpdateCategoryInput {
    parent_id?: number | null;
    nombre?: string;
    descripcion?: string;
    imagen_url?: string;
}

export interface GetCategoriesResponse {
    data: CategoriaPublic[];
    total: number;
}

export interface CategoryTreeResponse {
    data: CategoriaPublic[];
}