// TODO: Cloudinary - Servicio para subir imágenes al backend que se comunica con Cloudinary.
import apiClient from "@/shared/services/api/axiosInstance";

export interface UploadImageResponse {
    imagen_url: string;
    imagen_public_id: string;
}

/**
 * Sube una imagen a Cloudinary a través del backend.
 *
 * El backend valida:
 * - Tipo MIME: jpg, png, webp, gif, avif
 * - Tamaño máximo: 5 MB
 *
 * @param file - Archivo de imagen seleccionado por el usuario
 * @param tipo - Carpeta destino en Cloudinary según la entidad
 * @returns URL pública y public_id para persistir en la entidad
 */
export async function uploadImage(
    file: File,
    tipo: "categoria" | "ingrediente" | "producto" = "producto",
): Promise<UploadImageResponse> {
    // TODO: Cloudinary - Los nombres de campo ("archivo", "tipo") deben coincidir EXACTO con lo que espera el endpoint del backend. Se manda como multipart/form-data, no JSON, porque viaja un binario.
    const formData = new FormData();
    formData.append("archivo", file);
    formData.append("tipo", tipo);

    const response = await apiClient.post<UploadImageResponse>(
        "/api/v1/imagenes/upload",
        formData,
        {
            headers: { "Content-Type": "multipart/form-data" },
            timeout: 30000, // 30s — uploads pueden tardar más que un JSON request
        },
    );
    return response.data;
}
