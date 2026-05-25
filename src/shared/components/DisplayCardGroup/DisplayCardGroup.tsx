import DisplayCard from "../DisplayCard/DisplayCard";
import type { IconType } from "react-icons";

export interface StatCardItem {
  title: string;
  description: string;
  Icon: IconType;
  iconColor?: string;
}

interface Props {
  items: StatCardItem[];
}

export default function StatsCards({ items }: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {items.map((item, index) => (
                <DisplayCard
                    key={`${item.description}-${index}`}
                    Icon={item.Icon}
                    title={item.title}
                    description={item.description}
                    iconColor={item.iconColor}
                />
            ))}
        </div>
    );
}
