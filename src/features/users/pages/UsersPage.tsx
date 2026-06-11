import { useState } from "react";
import { GoPeople } from "react-icons/go";
import { useAuthStore } from "@/store/useAuthStore";
import DisplayCardGroup from "@/shared/components/DisplayCardGroup/DisplayCardGroup";
import TableUsers from "../components/TableUsers";
import UserFilters from "../components/UserFilters";
import UserModal from "../components/UserModal";
import DeleteUserModal from "../components/DeleteUserModal";
import UserDetailModal from "../components/UserDetailModal";
import { useUsers } from "../hooks/useUsers";
import { useUsersTable } from "../hooks/useUsersTable";
import type { RoleCode, CreateUserInput, UpdateUserInput, UserPublicAdminPanel } from "@/types/user.types";

const PAGE_SIZE = 10;

export function UsersPage() {
    const canCreate = useAuthStore((state) => state.hasRole("ADMIN"));
    const [selectedRoles, setSelectedRoles] = useState<RoleCode[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserPublicAdminPanel | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
    const [deletingUserName, setDeletingUserName] = useState<string>("");
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [viewingUser, setViewingUser] = useState<UserPublicAdminPanel | null>(null);

    const {
        page,
        setPage,
        sorting,
        setSorting,
        columnFilters,
        setColumnFilters,
    } = useUsersTable();

    const { data, isLoading, isError, isFetching, create, update, remove } = useUsers({
        page,
        pageSize: PAGE_SIZE,
        rolCodigo: selectedRoles.length === 1 ? selectedRoles[0] : undefined,
    });

    const { data: dataAdmin } = useUsers({
        page: 0,
        pageSize: 1,
        rolCodigo: "ADMIN",
    });

    const { data: dataStock } = useUsers({
        page: 0,
        pageSize: 1,
        rolCodigo: "STOCK",
    });

    const { data: dataPedidos } = useUsers({
        page: 0,
        pageSize: 1,
        rolCodigo: "PEDIDOS",
    });

    const cardsItems = [
        {
            Icon: GoPeople,
            title: String(dataAdmin?.total ?? 0),
            description: "Administradores",
            iconColor: "bg-blue-200",
        },
        {
            Icon: GoPeople,
            title: String(dataStock?.total ?? 0),
            description: "Gestores de Stock",
            iconColor: "bg-green-200",
        },
        {
            Icon: GoPeople,
            title: String(dataPedidos?.total ?? 0),
            description: "Gestores de Pedidos",
            iconColor: "bg-orange-200",
        },
    ];

    const handleRolesChange = (roles: RoleCode[]) => {
        setSelectedRoles(roles);
        setPage(0);
    };

    const handleEditUser = (userId: number) => {
        const user = data?.data.find((u) => u.id === userId) ?? null;
        setEditingUser(user);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingUser(null);
    };

    const handleDeleteUser = (userId: number, userName: string) => {
        setDeletingUserId(userId);
        setDeletingUserName(userName);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeletingUserId(null);
        setDeletingUserName("");
    };

    const handleViewDetails = (userId: number) => {
        const user = data?.data.find((u) => u.id === userId) ?? null;
        setViewingUser(user);
        setIsDetailModalOpen(true);
    };

    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false);
        setViewingUser(null);
    };

    if (isLoading) {
        return <div className="p-6">Cargando usuarios...</div>;
    }
    if (isError) {
        return (
            <div className="p-6 text-red-600">Error al cargar usuarios</div>
        );
    }

    const totalPages = Math.ceil((data?.total ?? 0) / PAGE_SIZE);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Usuarios</h1>
                    <p className="text-gray-500 text-sm">
                        {data?.total ?? 0} usuarios · Página {page + 1} de{" "}
                        {totalPages}
                    </p>
                </div>
                {canCreate && (
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
                    >
                        + Nuevo usuario
                    </button>
                )}
            </div>

            <DisplayCardGroup items={cardsItems} />

            <UserFilters
                selectedRoles={selectedRoles}
                onRolesChange={handleRolesChange}
            />

            <TableUsers
                sorting={sorting}
                columnFilters={columnFilters}
                data={data}
                isFetching={isFetching}
                setSorting={setSorting}
                setColumnFilters={setColumnFilters}
                setPage={setPage}
                page={page}
                totalPages={totalPages}
                onEditUser={handleEditUser}
                onDeleteUser={handleDeleteUser}
                onViewDetails={handleViewDetails}
            />

            <UserModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={async (formData) => {
                    await create(formData as CreateUserInput);
                }}
                mode="create"
            />

            <UserModal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                onSubmit={async (formData) => {
                    if (editingUser !== null) {
                        await update({
                            id: editingUser.id,
                            data: formData as UpdateUserInput,
                        });
                    }
                }}
                mode="edit"
                user={editingUser}
            />

            <DeleteUserModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={async () => {
                    if (deletingUserId !== null) {
                        await remove(deletingUserId);
                    }
                }}
                userName={deletingUserName}
                userId={deletingUserId ?? 0}
            />

            <UserDetailModal
                isOpen={isDetailModalOpen}
                onClose={handleCloseDetailModal}
                user={viewingUser}
            />
        </div>
    );
}

export default UsersPage;
