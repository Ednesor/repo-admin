import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { LoginPage } from "@/features/auth/pages/LoginPage";
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
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
