import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { ProductsPage } from "@/features/products/pages/ProductsPage";
import { DashboardLayout } from "@/shared/components/DashboardLayout";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<LoginPage />} />
                <Route element={<DashboardLayout />}>
                    <Route element={<ProtectedRoute allowedRoles={["admin", "user"]} />}>
                        <Route path="/products" element={<ProductsPage />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
