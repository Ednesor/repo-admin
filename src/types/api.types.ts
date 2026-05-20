export type UserRole = "user" | "admin";

export interface UserPublic {
  id: number;
  username: string;
  full_name: string;
  email: string;
  role: UserRole;
  disabled: boolean;
}

export interface UserRegisterPayload {
  username: string;
  full_name: string;
  email: string;
  password: string;
}

export interface CategoriaPublic {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface CategoriaCreatePayload {
  nombre: string;
  descripcion?: string;
}

export interface CategoriaUpdatePayload {
  nombre?: string;
  descripcion?: string;
}
