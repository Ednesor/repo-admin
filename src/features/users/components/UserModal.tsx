import { useState, useEffect, useRef } from "react";
import { FiX, FiLoader } from "react-icons/fi";
import type { CreateUserInput, UpdateUserInput, RoleCode, UserPublicAdminPanel } from "@/types/user.types";
import { ROLE_LABELS } from "@/types/user.types";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateUserInput | UpdateUserInput) => Promise<void>;
    mode: "create" | "edit";
    user?: UserPublicAdminPanel | null;
}

const ROLES: RoleCode[] = ["ADMIN", "STOCK", "PEDIDOS", "COCINA"];

const defaultCreateForm: CreateUserInput = {
    nombre: "",
    apellido: "",
    email: "",
    celular: "",
    password: "",
    roles_codigos: [],
};

const defaultEditForm: UpdateUserInput = {
    nombre: "",
    apellido: "",
    celular: "",
    roles_codigos: [],
};

export default function UserModal({
    isOpen,
    onClose,
    onSubmit,
    mode,
    user,
}: Props) {
    const [form, setForm] = useState<CreateUserInput | UpdateUserInput>(
        mode === "create" ? defaultCreateForm : defaultEditForm,
    );
    const [rolesOpen, setRolesOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [missingFields, setMissingFields] = useState<string[]>([]);
    const lastLoadedUserId = useRef<number | null>(null);

    useEffect(() => {
        if (mode === "edit" && user && user.id !== lastLoadedUserId.current) {
            lastLoadedUserId.current = user.id;
            setForm({
                nombre: user.nombre,
                apellido: user.apellido,
                celular: user.celular ?? "",
                roles_codigos: user.roles.map((r) => r.codigo as RoleCode),
            });
        }
    }, [mode, user]);

    const toggleRole = (codigo: RoleCode) => {
        setForm((prev) => {
            const currentRoles = [...prev.roles_codigos];
            if (currentRoles.includes(codigo)) {
                return {
                    ...prev,
                    roles_codigos: currentRoles.filter((r) => r !== codigo),
                };
            }
            return {
                ...prev,
                roles_codigos: [...currentRoles, codigo],
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMissingFields([]);

        const missing: string[] = [];
        if (!form.nombre.trim()) missing.push("Nombre");
        if (!form.apellido.trim()) missing.push("Apellido");
        if (!form.celular.trim()) missing.push("Celular");
        if (form.roles_codigos.length === 0) missing.push("Roles");

        if (mode === "create") {
            const createForm = form as CreateUserInput;
            if (!createForm.email.trim()) missing.push("Email");
            if (!createForm.password.trim()) missing.push("Password");
        }

        if (missing.length > 0) {
            setMissingFields(missing);
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(form);
            resetForm();
            onClose();
        } catch (err: unknown) {
            const message =
                (err as { response?: { data?: { mensaje?: string } } })?.response
                    ?.data?.mensaje ?? "Error al guardar el usuario";
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setForm(mode === "create" ? defaultCreateForm : defaultEditForm);
        setError(null);
        setMissingFields([]);
        lastLoadedUserId.current = null;
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleEmailChange = (value: string) => {
        if (mode === "create") {
            setForm((prev) => ({ ...prev, email: value }));
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={handleClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {mode === "create" ? "Nuevo usuario" : "Editar usuario"}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <FiX className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {error && (
                    <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                {missingFields.length > 0 && (
                    <div className="mx-6 mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                        <p className="text-sm text-amber-700 font-medium mb-1">
                            Completá los siguientes campos:
                        </p>
                        <ul className="text-sm text-amber-600">
                            {missingFields.map((field) => (
                                <li key={field}>• {field}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="overflow-y-auto flex-1 p-6">
                    <form id="user-form" onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nombre *
                                    </label>
                                    <input
                                        type="text"
                                        value={form.nombre}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                nombre: e.target.value,
                                            }))
                                        }
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder="Nombre"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Apellido *
                                    </label>
                                    <input
                                        type="text"
                                        value={form.apellido}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                apellido: e.target.value,
                                            }))
                                        }
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder="Apellido"
                                    />
                                </div>
                            </div>

                            {mode === "create" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        value={(form as CreateUserInput).email}
                                        onChange={(e) =>
                                            handleEmailChange(e.target.value)
                                        }
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder="email@example.com"
                                    />
                                </div>
                            )}

                            {mode === "create" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Password *
                                    </label>
                                    <input
                                        type="password"
                                        value={(form as CreateUserInput).password}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                password: e.target.value,
                                            }))
                                        }
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder="********"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Celular *
                                </label>
                                <input
                                    type="text"
                                    value={form.celular}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            celular: e.target.value,
                                        }))
                                    }
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    placeholder="2611234567"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Roles *
                                </label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setRolesOpen((prev) => !prev)
                                        }
                                        className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white flex items-center justify-between text-sm text-gray-700 hover:border-gray-300 transition-colors"
                                    >
                                        <span>
                                            {form.roles_codigos.length > 0
                                                ? `${form.roles_codigos.length} roles`
                                                : "Seleccionar roles"}
                                        </span>
                                        <svg
                                            className={`w-4 h-4 transition-transform ${
                                                rolesOpen
                                                    ? "rotate-180"
                                                    : ""
                                            }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </button>

                                    {rolesOpen && (
                                        <div className="absolute top-14 left-0 w-full max-h-64 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl z-50 p-2">
                                            {ROLES.map((codigo) => (
                                                <button
                                                    key={codigo}
                                                    type="button"
                                                    onClick={() =>
                                                        toggleRole(codigo)
                                                    }
                                                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors mb-1 ${
                                                        form.roles_codigos.includes(
                                                            codigo
                                                        )
                                                            ? "bg-amber-100 text-amber-700"
                                                            : "hover:bg-gray-100 text-gray-700"
                                                    }`}
                                                >
                                                    <div
                                                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                                                            form.roles_codigos.includes(
                                                                codigo
                                                            )
                                                                ? "bg-amber-500 border-amber-500"
                                                                : "border-gray-300"
                                                        }`}
                                                    >
                                                        {form.roles_codigos.includes(
                                                            codigo
                                                        ) && (
                                                            <div className="w-2 h-2 bg-white rounded-sm" />
                                                        )}
                                                    </div>
                                                    <span className="font-medium">
                                                        {ROLE_LABELS[codigo]}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        form="user-form"
                        disabled={
                            isSubmitting ||
                            !form.nombre.trim() ||
                            !form.apellido.trim()
                        }
                        className="px-5 py-2.5 rounded-xl bg-amber-600 text-sm font-medium text-white hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <FiLoader className="w-4 h-4 animate-spin" />
                                {mode === "create" ? "Creando..." : "Guardando..."}
                            </>
                        ) : mode === "create" ? (
                            "Crear usuario"
                        ) : (
                            "Guardar cambios"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
