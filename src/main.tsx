import { StrictMode, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import AppRouter from './router/AppRouter';
import { useAuthStore } from './store/useAuthStore';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            retry: 1,
        },
    },
});

export function AuthInitializer({ children }: { children: React.ReactNode }) {
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            useAuthStore.getState().checkAuth();
        }
    }, []);

    return <>{children}</>;
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <AuthInitializer>
                <AppRouter />
            </AuthInitializer>
        </QueryClientProvider>
    </StrictMode>
);