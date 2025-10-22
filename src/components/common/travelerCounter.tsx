import React, { FC } from 'react';
import { PlusIcon, MinusIcon } from 'lucide-react';

interface TravelerCounterProps {
    travelerCount: number;
    MIN_TRAVELERS: number;
    MAX_TRAVELERS: number;
    onCountChange: (newCount: number) => void;
}

/**
 * @component TravelerCounter
 * @description A control component for incrementing/decrementing the number of travelers,
 * enforcing minimum and maximum limits.
 * @param {TravelerCounterProps} props - The component's props.
 * @param {number} props.travelerCount - The current number of travelers.
 * @param {number} props.MIN_TRAVELERS - The minimum allowed number of travelers.
 * @param {number} props.MAX_TRAVELERS - The maximum allowed number of travelers.
 * @param {(newCount: number) => void} props.onCountChange - Handler function for count changes.
 */
export const TravelerCounter: FC<TravelerCounterProps> = ({
    travelerCount,
    MIN_TRAVELERS,
    MAX_TRAVELERS,
    onCountChange,
}) => {
    return (
        <div className="mb-8 p-4 border border-gray-200 rounded-xl bg-gray-50">
            <div className="flex justify-between items-center">
                <label className="text-lg font-semibold text-gray-700">
                    Cantidad de pasajeros
                </label>
                <div className="flex items-center space-x-2 border border-blue-600 rounded-lg p-1">
                    <button
                        type="button"
                        onClick={() => onCountChange(travelerCount - 1)}
                        disabled={travelerCount <= MIN_TRAVELERS}
                        className="p-1 rounded-full text-blue-600 hover:bg-blue-50 disabled:text-gray-400 disabled:hover:bg-transparent transition"
                        title="Eliminar pasajero"
                    >
                        <MinusIcon className="h-5 w-5 stroke-2" />
                    </button>
                    <span className="text-xl font-bold text-gray-800 min-w-[20px] text-center">
                        {travelerCount}
                    </span>
                    <button
                        type="button"
                        onClick={() => onCountChange(travelerCount + 1)}
                        disabled={travelerCount >= MAX_TRAVELERS}
                        className="p-1 rounded-full text-blue-600 hover:bg-blue-50 disabled:text-gray-400 disabled:hover:bg-transparent transition"
                        title="Añadir pasajero"
                    >
                        <PlusIcon className="h-5 w-5 stroke-2" />
                    </button>
                </div>
            </div>
        </div>
    );
};