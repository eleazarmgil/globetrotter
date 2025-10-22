import React from 'react';
import { UsersIcon } from 'lucide-react';
import { Traveler } from '@/types/booking';
import { calculateAge } from '../../../utils/calculateAge';

interface TravelerInfoCardProps {
    travelers: Traveler[];
}

/**
 * @component
 * @description A card component that lists the basic information for each traveler
 * included in the booking, showing their name and calculated age (if date of birth is provided).
 * @param {TravelerInfoCardProps} props - The component's props.
 * @param {Traveler[]} props.travelers - An array of traveler objects.
 * @returns {JSX.Element} The Traveler Information Card component.
 */
export const TravelerInfoCard: React.FC<TravelerInfoCardProps> = ({ travelers }) => (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-blue-100">
        <h4 className="text-xl font-bold text-blue-700 mb-4 flex items-center border-b pb-2">
            <UsersIcon className="w-5 h-5 mr-2" />
            Información de Pasajeros
        </h4>
        <ul className="space-y-3">
            {travelers.map((t, index) => (
                <li key={t.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center border border-gray-200">
                    <span className="font-medium text-gray-700">
                        {index + 1}. {t.fullName || `Pasajero ${index + 1}`}
                    </span>
                    <span className="text-sm text-blue-600 font-semibold">
                        {t.dateOfBirth ? calculateAge(t.dateOfBirth) : 'Edad N/A'}
                    </span>
                </li>
            ))}
            {travelers.length === 0 && (
                <li className="text-gray-500 italic p-3">No se han agregado pasajeros.</li>
            )}
        </ul>
    </div>
);