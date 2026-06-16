import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { isAxiosError } from "axios";

export function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login, isLoggingIn, loginError } = useAuth({ enabled: false });
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            return;
        }

        try {
            await login({ username, password });
            navigate("/inicio");
        } catch {
            // Error handled by mutation
        }
    };

    const getErrorMessage = (error: unknown): string => {
        if (isAxiosError(error)) {
            if (error.response?.status === 401) {
                return "Usuario o contraseña incorrectos";
            }
            if (error.response?.status === 403) {
                return "No tenés permisos para acceder";
            }
            if (error.response?.status === 422) {
                return "Datos inválidos. Verificá los campos";
            }
            if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
                return "No se pudo conectar al servidor";
            }
        }
        if (error instanceof Error && error.message === "INSUFFICIENT_PERMISSIONS") {
            return "No tenés permisos para acceder al panel de administración";
        }
        return "Ocurrió un error. Intentá de nuevo";
    };

    return (
        <div className="min-h-screen bg-[#fafaf7] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-amber-600 px-8 py-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 rounded-lg w-12 h-12 flex items-center justify-center">
                                <span className="text-white text-2xl font-bold">F</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">FOOD STORE</h1>
                                <p className="text-amber-100 text-sm">Panel de Administración</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">
                            Iniciar Sesión
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium text-gray-700 mb-1.5"
                                >
                                    Usuario
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Ingresá tu usuario"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-gray-800 placeholder-gray-400"
                                    disabled={isLoggingIn}
                                    autoComplete="username"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 mb-1.5"
                                >
                                    Contraseña
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-gray-800 placeholder-gray-400"
                                    disabled={isLoggingIn}
                                    autoComplete="current-password"
                                />
                            </div>

                            {loginError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                                    {getErrorMessage(loginError)}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoggingIn || !username.trim() || !password.trim()}
                                className="w-full bg-amber-600 text-white py-3 rounded-xl font-semibold hover:bg-amber-700 disabled:bg-amber-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                            >
                                {isLoggingIn ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Ingresando...</span>
                                    </>
                                ) : (
                                    <span>Iniciar Sesión</span>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}