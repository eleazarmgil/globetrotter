import React from 'react';
import { TicketIcon, UsersIcon } from 'lucide-react';
import { BookingFormData } from '@/types/booking';

interface TripDetailsCardProps {
    trip: BookingFormData['trip'];
    travelerCount: number;
}

/**
 * @component
 * @description A card component that displays the main details of the trip: destination, flight class,
 * departure/return dates, and the total number of travelers.
 * @param {TripDetailsCardProps} props - The component's props.
 * @param {object} props.trip - The trip details object from the booking form data.
 * @param {number} props.travelerCount - The number of travelers on the trip.
 * @returns {JSX.Element} The Trip Details Card component.
 */
export const TripDetailsCard: React.FC<TripDetailsCardProps> = ({ trip, travelerCount }) => (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-blue-100">
        <h4 className="text-xl font-bold text-blue-700 mb-4 flex items-center border-b pb-2">
            <TicketIcon className="w-5 h-5 mr-2" />
            Detalles del Viaje
        </h4>
        <div className="space-y-3 p-4 border-l-4 border-indigo-400 bg-indigo-50 rounded-r-lg">
            <p className="text-lg font-bold text-indigo-800">
                Destino: {trip.destination || 'Pendiente'} - Clase: {trip.flightClass || 'Pendiente'}
            </p>
            <p className="text-sm text-gray-600">
                Ida: {trip.departureDate || 'N/A'} | Regreso: {trip.returnDate || 'N/A'}
            </p>
            <p className="text-sm text-gray-600 flex items-center">
                <UsersIcon className="w-4 h-4 mr-1" />
                Total Viajeros: {travelerCount}
            </p>
        </div>
    </div>
);