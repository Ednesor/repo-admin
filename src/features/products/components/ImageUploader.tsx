// TODO: Cloudinary - Componente de UI para seleccionar y validar imágenes (tamaño y formato) antes de subirlas.
import { useRef, useState } from "react";
import { FiUploadCloud } from "react-icons/fi";

interface ImageUploaderProps {
    onFileSelect: (file: File) => void;
    disabled?: boolean;
}

export default function ImageUploader({ onFileSelect, disabled }: ImageUploaderProps) {
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // TODO: Cloudinary - Validación en el cliente (tipo y tamaño) que ESPEJA la del backend. Es UX, no seguridad: evita un request inútil, pero el backend valida igual.
    const processFile = (file: File) => {
        if (!file.type.startsWith("image/")) {
            setError("El archivo debe ser una imagen válida.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB — mismo límite que el backend
            setError("El archivo no debe superar los 5MB.");
            return;
        }

        setError(null);
        onFileSelect(file);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!disabled) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (disabled) return;

        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    };

    return (
        <div className="space-y-2">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !disabled && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200' :
                        isDragging ? 'bg-amber-100 border-amber-500 scale-[1.02]' : 'hover:bg-amber-50 border-gray-300 hover:border-amber-400 cursor-pointer'
                    }`}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/jpeg, image/png, image/webp, image/gif, image/avif"
                    className="hidden"
                    disabled={disabled}
                />

                <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <FiUploadCloud className="w-7 h-7" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">
                        Hacé click o arrastrá para seleccionar una imagen
                    </p>
                    <p className="text-xs text-gray-500">
                        JPG, PNG, WEBP (Max 5MB)
                    </p>
                </div>
            </div>

            {error && <p className="text-sm text-red-500 font-medium px-2">{error}</p>}
        </div>
    );
}

