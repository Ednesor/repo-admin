import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import CategoriesPage from "@/features/categories/pages/CategoriesPage";
import ClientsPage from "@/features/clients/pages/ClientsPage";
import HelpPages from "@/features/help/pages/HelpPages";
import IngredientsPage from "@/features/ingredients/pages/IngredientsPage";
import { ProductsPage } from "@/features/products/pages/ProductsPage";
import { DashboardLayout } from "@/shared/components/DashboardLayout/DashboardLayout";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<LoginPage />} />
                <Route element={<DashboardLayout />}>
                    <Route element={<ProtectedRoute allowedRoles={["admin", "user"]} />}>
                        <Route path="/productos" element={<ProductsPage />} />
                    </Route>
                    <Route element={<ProtectedRoute allowedRoles={["admin", "user"]} />}>
                        <Route path="/panel" element={<ProductsPage />} />
                    </Route>
                    <Route element={<ProtectedRoute allowedRoles={["admin", "user"]} />}>
                        <Route path="/pedidos" element={<ProductsPage />} />
                    </Route>
                    <Route element={<ProtectedRoute allowedRoles={["admin", "user"]} />}>
                        <Route path="/ingredientes" element={<IngredientsPage />} />
                    </Route>
                    <Route element={<ProtectedRoute allowedRoles={["admin", "user"]} />}>
                        <Route path="/categorias" element={<CategoriesPage />} />
                    </Route>
                    <Route element={<ProtectedRoute allowedRoles={["admin", "user"]} />}>
                        <Route path="/clientes" element={<ClientsPage />} />
                    </Route>
                    <Route element={<ProtectedRoute allowedRoles={["admin", "user"]} />}>
                        <Route path="/ayuda" element={<HelpPages />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
