import React, { FC } from 'react';

interface SimpleToggleProps {
    id: string;
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    description?: string; 
}

export const SimpleToggle: FC<SimpleToggleProps> = 
    ({ label, checked, onChange, id, description }) => (
        <div className="flex justify-between items-start py-4 border-b border-gray-100 last:border-b-0">
            <div className="flex flex-col">
                <label htmlFor={id} className="text-lg font-normal text-gray-700 cursor-pointer">
                    {label}
                </label>
                {description && (
                    <p className="text-sm text-gray-500 mt-1">{description}</p>
                )}
            </div>
            <input
                type="checkbox"
                id={id}
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="h-6 w-11 rounded-full appearance-none bg-gray-300 checked:bg-blue-600 transition duration-200 cursor-pointer relative after:absolute after:top-0.5 after:left-0.5 after:bg-white after:w-5 after:h-5 after:rounded-full after:shadow-md checked:after:translate-x-full flex-shrink-0 ml-4"
            />
        </div>
    );