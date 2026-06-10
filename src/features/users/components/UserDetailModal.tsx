import { FiX, FiPhone, FiMail, FiUser } from "react-icons/fi";
import type { UserPublicAdminPanel, RoleCode } from "@/types/user.types";
import { ROLE_LABELS } from "@/types/user.types";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    user: UserPublicAdminPanel | null;
}

function getFullName(user: UserPublicAdminPanel): string {
    return `${user.nombre} ${user.apellido}`.trim();
}

export default function UserDetailModal({ isOpen, onClose, user }: Props) {
    if (!isOpen || !user) return null;

    const fullName = getFullName(user);
    const initials = user.nombre.slice(0, 2).toUpperCase();

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Detalles del usuario
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <FiX className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-700 font-bold text-2xl flex items-center justify-center mb-4">
                            {initials}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 text-center">
                            {fullName}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                            <FiUser size={12} />
                            ID: {user.id}
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                        <div className="flex items-center gap-3 mb-3">
                            <FiMail className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Email</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {user.email}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <FiPhone className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Celular</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {user.celular ?? "—"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                            Roles
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {user.roles.length === 0 ? (
                                <span className="text-gray-400 text-sm">
                                    Sin roles
                                </span>
                            ) : (
                                user.roles.map((role) => (
                                    <span
                                        key={role.codigo}
                                        className="bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium"
                                    >
                                        {ROLE_LABELS[role.codigo as RoleCode] ?? role.nombre}
                                    </span>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
