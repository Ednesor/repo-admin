import SearchFilter from "./SearchFilter";
import RolesFilters from "./RolesFilters";
import type { RoleCode } from "@/types/user.types";

interface Props {
    selectedRoles: RoleCode[];
    onRolesChange: (roles: RoleCode[]) => void;
}

export default function UserFilters({
    selectedRoles,
    onRolesChange,
}: Props) {
    return (
        <div className="flex flex-col xl:flex-row gap-3 mb-6">
            <SearchFilter />
            <RolesFilters
                selectedRoles={selectedRoles}
                onChange={onRolesChange}
            />
        </div>
    );
}
