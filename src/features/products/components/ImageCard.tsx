// TODO: Cloudinary - Componente para mostrar imágenes subidas o pendientes, con confirmación inline para eliminarlas.
import { useState } from "react";
import { FiTrash2, FiX, FiCheck } from "react-icons/fi";

interface ImageCardProps {
    url: string;
    onRemove: () => void;
    disabled?: boolean;
}

export default function ImageCard({ url, onRemove, disabled }: ImageCardProps) {
    const [isConfirming, setIsConfirming] = useState(false);

    return (
        <div className="relative group overflow-hidden rounded-xl bg-gray-100 aspect-square border border-gray-200 shadow-sm">
            <img 
                src={url} 
                alt="Product preview" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
            />
            
            {!disabled && !isConfirming && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                        type="button"
                        onClick={() => setIsConfirming(true)}
                        className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors transform hover:scale-110 shadow-lg"
                        title="Eliminar imagen"
                    >
                        <FiTrash2 size={20} />
                    </button>
                </div>
            )}

            {isConfirming && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-2 animate-in fade-in duration-200">
                    <span className="text-white text-xs font-medium text-center mb-3">
                        ¿Borrar?
                    </span>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setIsConfirming(false)}
                            className="bg-gray-600 text-white p-2 rounded-full hover:bg-gray-500 transition-colors shadow-sm"
                            title="Cancelar"
                        >
                            <FiX size={16} />
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setIsConfirming(false);
                                onRemove();
                            }}
                            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-400 transition-colors shadow-sm"
                            title="Confirmar"
                        >
                            <FiCheck size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}