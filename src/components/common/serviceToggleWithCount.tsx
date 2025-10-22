import React, { FC, useMemo } from 'react';
import { FormInputGroup } from '../common/formInputGroup'; 
import { FormElement } from '../common/formElement'; 

interface ServiceToggleWithCountProps {
    id: string;
    label: string;
    costPerUnit: number;
    isChecked: boolean;
    onToggleChange: (checked: boolean) => void;
    countLabel: string;
    countValue: number | undefined;
    onCountChange: (value: string) => void;
    maxCount: number;
}

/**
 * @component ServiceToggleWithCount
 * @description A component that combines a toggle switch for an optional service with an associated
 * numerical input field, which appears when the service is enabled. Includes basic validation logic.
 * @param {ServiceToggleWithCountProps} props - The component's props.
 * @param {string} props.id - Unique ID for the toggle and input elements.
 * @param {string} props.label - Display name of the service.
 * @param {number} props.costPerUnit - Cost associated with each unit of the service.
 * @param {boolean} props.isChecked - Current state of the toggle switch.
 * @param {(checked: boolean) => void} props.onToggleChange - Handler for toggle state change.
 * @param {string} props.countLabel - Label for the numerical input field (e.g., "Number of Pets").
 * @param {number | undefined} props.countValue - Current value of the numerical input.
 * @param {(value: string) => void} props.onCountChange - Handler for numerical input value change.
 * @param {number} props.maxCount - Maximum allowed value for the count input.
 */
export const ServiceToggleWithCount: FC<ServiceToggleWithCountProps> = ({
    id,
    label,
    costPerUnit,
    isChecked,
    onToggleChange,
    countLabel,
    countValue,
    onCountChange,
    maxCount,
}) => {
    
    const isInvalid = useMemo(() => {
        return isChecked && (!countValue || countValue < 1 || countValue > maxCount);
    }, [isChecked, countValue, maxCount]);

    return (
        <div className="space-y-4 p-4 border border-gray-200 rounded-xl">
            <div className="flex justify-between items-center">
                <label htmlFor={id} className="text-lg font-medium text-gray-700 cursor-pointer">
                    {label}
                    <span className="text-sm text-gray-500 ml-2">({`Costo ${costPerUnit}$ c/u`})</span>
                </label>
                <input
                    type="checkbox"
                    id={id}
                    checked={isChecked}
                    onChange={(e) => onToggleChange(e.target.checked)}
                    className="h-6 w-11 rounded-full appearance-none bg-gray-300 checked:bg-blue-600 transition duration-200 cursor-pointer relative after:absolute after:top-0.5 after:left-0.5 after:bg-white after:w-5 after:h-5 after:rounded-full after:shadow-md checked:after:translate-x-full"
                />
            </div>
            {isChecked && (
                <FormInputGroup 
                    label={countLabel} 
                    isInvalid={isInvalid}
                >
                    <FormElement>
                        <input
                            type="number"
                            id={`${id}-count`}
                            value={countValue || ''}
                            onChange={(e) => onCountChange(e.target.value)}
                            min="1"
                            max={maxCount}
                            placeholder="Cantidad"
                            required
                        />
                    </FormElement>
                    {isInvalid && (
                        <p className="mt-1 text-sm text-red-500">
                            La cantidad debe ser entre 1 y {maxCount}.
                        </p>
                    )}
                </FormInputGroup>
            )}
        </div>
    );
};