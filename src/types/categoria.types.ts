export interface CategoriaPublic {
    parent_id: number;
    nombre: string;
    descripcion: string;
    imagen_url: string;
    id: number;
    subcategorias: CategoriaPublic[]
}