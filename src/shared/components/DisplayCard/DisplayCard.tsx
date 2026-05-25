import type { IconType } from "react-icons";

interface Props {
    Icon: IconType;
    iconColor?: string;

    title: string;
    description: string;
}

export default function DisplayCard({
    Icon,
    iconColor = "bg-sky-100",
    title,
    description,
}: Props) {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconColor}`}
            >
                <Icon size={20} />
            </div>

            <div className="flex flex-col">
                <p className="text-2xl font-bold text-gray-800 leading-none">
                    {title}
                </p>

                <p className="text-sm text-gray-400 mt-1">{description}</p>
            </div>
        </div>
    );
}
