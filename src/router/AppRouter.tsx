import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import CategoriesPage from "@/features/categories/pages/CategoriesPage";
import CategoryDetailPage from "@/features/categories/pages/CategoryDetailPage";
import ClientsPage from "@/features/clients/pages/ClientsPage";
import HelpPages from "@/features/help/pages/HelpPages";
import IngredientsPage from "@/features/ingredients/pages/IngredientsPage";
import IngredientDetailPage from "@/features/ingredients/pages/IngredientDetailPage";
import { ProductsPage } from "@/features/products/pages/ProductsPage";
import { ProductDetailPage } from "@/features/products/pages/ProductDetailPage";
import { DashboardLayout } from "@/shared/components/DashboardLayout/DashboardLayout";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<LoginPage />} />

                <Route element={<DashboardLayout />}>
                    <Route element={<ProtectedRoute allowedRoles={["ADMIN", "STOCK", "PEDIDOS"]} />}>
                        <Route path="/panel" element={<ProductsPage />} />
                        <Route path="/productos" element={<ProductsPage />} />
                        <Route path="/productos/:id" element={<ProductDetailPage />} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={["ADMIN", "PEDIDOS"]} />}>
                        <Route path="/pedidos" element={<ProductsPage />} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
                        <Route path="/ingredientes" element={<IngredientsPage />} />
                        <Route path="/ingredientes/:id" element={<IngredientDetailPage />} />
                        <Route path="/categorias" element={<CategoriesPage />} />
                        <Route path="/categorias/:id" element={<CategoryDetailPage />} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
                        <Route path="/clientes" element={<ClientsPage />} />
                    </Route>

                    <Route path="/ayuda" element={<HelpPages />} />
                    <Route path="*" element={<Navigate to="/panel" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
