interface DetailItemProps {
    label: string;
    value: string;
    icon: React.ReactNode;
    isSubtotal?: boolean;
}

/**
 * @component
 * @description A utility component for displaying a single detail item (label and value) in a list.
 * Used primarily within summary cards to list costs or trip details.
 * @param {DetailItemProps} props - The component's props.
 * @param {string} props.label - The descriptive label for the item.
 * @param {string} props.value - The value associated with the label (e.g., a formatted currency string).
 * @param {React.ReactNode} props.icon - An icon to display next to the label.
 * @param {boolean} [props.isSubtotal=false] - If true, applies specific styling for subtotal/total rows.
 * @returns {React.FC<DetailItemProps>} The Detail Item component.
 */
export const DetailItem: React.FC<DetailItemProps> = ({ label, value, icon, isSubtotal = false }) => (
    <div className={`flex justify-between items-center py-3 ${isSubtotal ? 'border-t border-dashed border-gray-300 font-semibold' : 'text-gray-700'}`}>
        <span className="flex items-center text-sm">
            {icon}
            <span className="ml-2">{label}</span>
        </span>
        <span className={isSubtotal ? 'text-lg text-blue-800' : 'text-sm'}>{value}</span>
    </div>
);