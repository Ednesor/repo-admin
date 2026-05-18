# Admin App

Sistema de administración desarrollado con React, TypeScript, Vite y Tailwind CSS.

## Arquitectura

El proyecto sigue una **arquitectura basada en features** (módulos por dominio):

```
src/
├── features/          # Módulos por dominio
│   ├── products/      # Gestión de productos
│   └── orders/        # Gestión de órdenes
├── shared/            # Componentes y utilidades compartidas
├── store/             # Estado global (Zustand)
└── router/            # Configuración de rutas
```

Cada feature contiene:
- `components/` - Componentes reutilizables del dominio
- `hooks/` - Hooks personalizados
- `pages/` - Páginas/vistas principal
- `services/` - Llamadas a APIs
- `types.ts` - Tipos específicos del dominio

## Requisitos Previos

- Node.js 18+
- pnpm 8+

## Instalación

```bash
# Instalar dependencias
pnpm install

# Crear archivo de entorno
cp .env.example .env
```

## Desarrollo

```bash
# Iniciar servidor de desarrollo
pnpm dev
```

La aplicación estará disponible en `http://localhost:5173`

## Librerías Principales

| Librería | Propósito |
|----------|-----------|
| React Router DOM | Enrutamiento |
| TanStack Query | Gestión de estado servidor |
| TanStack Table | Tablas de datos |
| TanStack Form | Formularios |
| Axios | Cliente HTTP |
| Zustand | Estado global cliente |
| Tailwind CSS | Estilos |

## Variables de Entorno

| Variable | Descripción |
|----------|-------------|
| `VITE_API_URL` | URL base de la API |