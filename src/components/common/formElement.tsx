import { 
    FC, 
    cloneElement, 
    ReactElement, 
    HTMLAttributes, 
} from 'react';

interface FormElementProps {
    children: ReactElement<HTMLAttributes<HTMLElement>>;
}

/**
 * @component FormElement
 * @description Wrapper component that injects a base set of standardized Tailwind CSS classes
 * into its child input or select element to ensure consistent styling across the application.
 * @param {FormElementProps} props - The component's props.
 * @param {ReactElement<any>} props.children - The single <input> or <select> element to style.
 */
export const FormElement: FC<FormElementProps> = ({ children }) => {
    
    const baseClasses = 'block w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm border-gray-300 text-gray-800';
    const originalClassName = children.props.className || '';

    const propsToMerge = {
        className: `${baseClasses} ${originalClassName}`,
    };

    return cloneElement(children, propsToMerge as Partial<HTMLAttributes<HTMLElement>>);
};