export type UserRole = "user" | "admin";

export interface UserPublic {
    id: number;
    username: string;
    full_name: string;
    email: string;
    role: UserRole;
    disabled: boolean;
}
