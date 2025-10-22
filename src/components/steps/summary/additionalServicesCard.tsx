import React from 'react';
import { ShieldIcon, CheckCircleIcon } from 'lucide-react';
import { BookingFormData } from '@/types/booking';

interface AdditionalServicesCardProps {
    services: BookingFormData['services'];
}

/**
 * @component AdditionalServicesCard
 * @description Displays a read-only summary card of all currently selected additional services 
 * for the trip, including details like counts and notes.
 * @param {AdditionalServicesCardProps} props - The component's props.
 * @param {BookingFormData['services']} props.services - The object containing all additional service selections and values.
 */
export const AdditionalServicesCard: React.FC<AdditionalServicesCardProps> = ({ services }) => (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-blue-100">
        <h4 className="text-xl font-bold text-blue-700 mb-4 flex items-center border-b pb-2">
            <ShieldIcon className="w-5 h-5 mr-2" />
            Servicios Adicionales
        </h4>
        <ul className="space-y-1 text-sm text-gray-700">
            {services.addInsurance && (
                <li className="flex items-center"><CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" /> Seguro de Viaje</li>
            )}
            {services.selectSeats && (
                <li className="flex items-center"><CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" /> Selección de Asientos</li>
            )}
            {(services.travelsWithPets && services.petCount) ? (
                <li className="flex items-center"><CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" /> {services.petCount} Mascota(s)</li>
            ) : null}
            {(services.needsExtraLuggage && services.extraLuggageCount) ? (
                <li className="flex items-center"><CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" /> {services.extraLuggageCount} Maleta(s) Extra</li>
            ) : null}
            {services.requiresSpecialAssistance && (
                <li className="flex items-center"><CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" /> Asistencia Especial ({services.assistanceNotes || 'Sin notas'})</li>
            )}
            {(!services.addInsurance && !services.selectSeats && !services.travelsWithPets && !services.needsExtraLuggage && !services.requiresSpecialAssistance) && (
                <li className="text-gray-500 italic">No se han seleccionado servicios adicionales.</li>
            )}
        </ul>
    </div>
);