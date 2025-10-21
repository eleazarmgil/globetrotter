import React, { useMemo } from 'react';
import { StepProps } from '../../types/booking'; 
import { ChevronRightIcon, CalendarDaysIcon, SearchIcon, PlaneIcon } from 'lucide-react';

export const Step1 = ({ 
    bookingFormData, 
    updateFormData, 
    nextStep, 
    flightOptions, 
}: StepProps) => {
    const uniqueDestinations = useMemo(() => {
        const destinations = new Set<string>();
        flightOptions.forEach(opt => {
            destinations.add(opt.destination); 
        });
        return Array.from(destinations);
    }, [flightOptions]);

    const handleDestinationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newDestination = e.target.value;
        updateFormData('trip', { 
            ...bookingFormData.trip, 
            destination: newDestination,
            flightClass: 'Economy' 
        });
    };

    const handleFlightClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        updateFormData('trip', { 
            ...bookingFormData.trip, 
            flightClass: e.target.value 
        });
    };

    const handleDepartureDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateFormData('trip', { 
            ...bookingFormData.trip, 
            departureDate: e.target.value 
        });
    };

    const handleReturnDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateFormData('trip', { 
            ...bookingFormData.trip, 
            returnDate: e.target.value 
        });
    };

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-4">Información del viaje</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
                        Destino
                    </label>
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <select
                            id="destination"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            onChange={handleDestinationChange}
                            value={bookingFormData.trip.destination}
                            required
                        >
                            <option value="" disabled>Ej: Madrid</option>
                            {uniqueDestinations.map(destinationName => (
                                <option key={destinationName} value={destinationName}>
                                    {destinationName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div>
                    <label htmlFor="flightClass" className="block text-sm font-medium text-gray-700 mb-2">
                        Clase
                    </label>
                    <div className="relative">
                        <PlaneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <select
                            id="flightClass"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            onChange={handleFlightClassChange}
                            value={bookingFormData.trip.flightClass}
                            required
                        >
                            <option value="" disabled>Económica</option> 
                            <option value="Economy">Economy</option>
                            <option value="Business">Business</option>
                            <option value="First Class">Primera Clase</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700 mb-2">
                        Check-in
                    </label>
                    <div className="relative">
                        <CalendarDaysIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                        <input
                            type="date"
                            id="departureDate"
                            className="block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            onChange={handleDepartureDateChange}
                            value={bookingFormData.trip.departureDate}
                            placeholder="MM / DD / YYYY"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 mb-2">
                        Check-out
                    </label>
                    <div className="relative">
                        <CalendarDaysIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                        <input
                            type="date"
                            id="returnDate"
                            className="block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            onChange={handleReturnDateChange}
                            value={bookingFormData.trip.returnDate}
                            placeholder="MM / DD / YYYY" 
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-6">
                <button
                    onClick={nextStep}
                    className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ease-in-out duration-150 disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                    Siguiente <ChevronRightIcon className="ml-3 -mr-1 h-5 w-5" aria-hidden="true" />
                </button>
            </div>
        </div>
    );
};
