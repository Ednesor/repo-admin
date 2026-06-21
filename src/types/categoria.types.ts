// TODO: Cloudinary - Se agregó imagen_public_id a las interfaces para poder eliminar la imagen de Cloudinary al actualizar o borrar.
export interface CategoriaPublic {
    parent_id: number | null;
    nombre: string;
    descripcion: string;
    imagen_url: string;
    // public_id que devuelve Cloudinary; se persiste para poder borrar/reemplazar esta imagen más adelante.
    imagen_public_id?: string | null;
    id: number;
    subcategorias?: CategoriaPublic[];
    productos?: { id: number; nombre: string }[];
}

export interface CategoriaDetail {
    id: number;
    parent_id: number | null;
    nombre: string;
    descripcion: string;
    imagen_url: string;
    // public_id que devuelve Cloudinary; se persiste para poder borrar/reemplazar esta imagen más adelante.
    imagen_public_id?: string | null;
    subcategorias: CategoriaPublic[];
    productos: { id: number; nombre: string }[];
}

export interface CreateCategoryInput {
    parent_id: number | null;
    nombre: string;
    descripcion: string;
    imagen_url: string;
    // se envía junto con imagen_url (lo devuelve el upload) para que el backend asocie el archivo de Cloudinary a la categoría.
    imagen_public_id?: string | null;
}

export interface UpdateCategoryInput {
    parent_id?: number | null;
    nombre?: string;
    descripcion?: string;
    imagen_url?: string;
    // al cambiar o quitar la imagen, permite que el backend borre de Cloudinary la anterior usando su public_id.
    imagen_public_id?: string | null;
}

export interface GetCategoriesResponse {
    items: CategoriaPublic[];
    total: number;
    page: number;
    size: number;
    pages: number;
}

export interface CategoryTreeResponse {
    items: CategoriaPublic[];
}