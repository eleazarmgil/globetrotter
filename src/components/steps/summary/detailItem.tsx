interface DetailItemProps {
    label: string;
    value: string;
    icon: React.ReactNode;
    isSubtotal?: boolean;
}

export const DetailItem: React.FC<DetailItemProps> = ({ label, value, icon, isSubtotal = false }) => (
    <div className={`flex justify-between items-center py-3 ${isSubtotal ? 'border-t border-dashed border-gray-300 font-semibold' : 'text-gray-700'}`}>
        <span className="flex items-center text-sm">
            {icon}
            <span className="ml-2">{label}</span>
        </span>
        <span className={isSubtotal ? 'text-lg text-blue-800' : 'text-sm'}>{value}</span>
    </div>
);