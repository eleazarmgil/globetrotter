import React, { useCallback, useMemo } from 'react';
import { StepProps, Traveler } from '@/types/booking'; 
import { PlusIcon, MinusIcon } from 'lucide-react'; 
import { v4 as uuidv4 } from 'uuid'; 

import TravelerForm from './travelerForm'; 

const MAX_TRAVELERS = 10;
const MIN_TRAVELERS = 1;
const COST_PER_PET = 100;
const COST_PER_EXTRA_LUGGAGE = 50;

export const Step2: React.FC<StepProps> = ({ 
    bookingFormData,
    updateFormData,
    nextStep, 
    prevStep, 
}) => {
    const { travelers, services } = bookingFormData;
    const travelerCount = travelers.length;

    const createNewTraveler = useCallback((): Traveler => ({
        id: uuidv4(),
        fullName: '',
        dateOfBirth: '',
        documentType: '',
        documentNumber: '',
    }), []);

    const setTravelerCount = useCallback((newCount: number) => {
        if (newCount > travelerCount && newCount <= MAX_TRAVELERS) {
            const travelersToAdd = newCount - travelerCount;
            const newTravelers = Array.from({ length: travelersToAdd }, createNewTraveler);
            updateFormData('travelers', [...travelers, ...newTravelers]);
        } else if (newCount < travelerCount && newCount >= MIN_TRAVELERS) {
            const updatedTravelers = travelers.slice(0, newCount);
            const newServices = { ...services };
            if (newServices.petCount && newServices.petCount > newCount) {
                newServices.petCount = newCount;
            }
            if (newServices.extraLuggageCount && newServices.extraLuggageCount > newCount) {
                newServices.extraLuggageCount = newCount;
            }
            
            updateFormData('travelers', updatedTravelers);
            updateFormData('services', newServices);

        }
    }, [travelerCount, travelers, services, updateFormData, createNewTraveler]);

    const handleTravelerChange = useCallback((
        id: string, 
        key: keyof Traveler, 
        value: string
    ) => {
        const updatedTravelers = travelers.map(t => 
            t.id === id ? { ...t, [key]: value } : t
        );
        updateFormData('travelers', updatedTravelers);
    }, [travelers, updateFormData]);

    const handleServiceToggle = useCallback((key: 'travelsWithPets' | 'needsExtraLuggage', value: boolean) => {
        const newState = { ...services, [key]: value };
        
        if (key === 'travelsWithPets') {
            newState.petCount = value ? (newState.petCount || 1) : undefined;
        }
        if (key === 'needsExtraLuggage') {
            newState.extraLuggageCount = value ? (newState.extraLuggageCount || 1) : undefined;
        }

        updateFormData('services', newState);
    }, [services, updateFormData]);

    const handleServiceCountChange = useCallback((key: 'petCount' | 'extraLuggageCount', value: string) => {
        let count = parseInt(value, 10);

        if (isNaN(count) || count < 1) {
            count = 1;
        }
        const finalCount = Math.min(count, travelerCount);
        
        updateFormData('services', { ...services, [key]: finalCount });
    }, [services, travelerCount, updateFormData]);

    const isStepValid = useMemo(() => {
        if (travelerCount < MIN_TRAVELERS) return false;

        const allTravelersValid = travelers.every(t => (
            t.fullName.trim() !== '' &&
            t.dateOfBirth.trim() !== '' &&
            t.documentType.trim() !== '' &&
            t.documentNumber.trim() !== ''
        ));
        if (!allTravelersValid) return false;
        
        if (services.travelsWithPets && (!services.petCount || services.petCount < 1)) return false;
        if (services.needsExtraLuggage && (!services.extraLuggageCount || services.extraLuggageCount < 1)) return false;

        return true;
    }, [travelers, services, travelerCount]);

    return (
        <section className="space-y-8 p-6 md:p-8 bg-white rounded-xl shadow-lg">
            
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Información personal
            </h1>

            <div className="mb-8 p-4 border border-gray-200 rounded-xl">
                <div className="flex justify-between items-center">
                    <label className="text-lg font-semibold text-gray-700">
                        Cantidad de pasajeros
                    </label>
                    <div className="flex items-center space-x-2 border border-blue-600 rounded-lg p-1">
                        <button
                            type="button"
                            onClick={() => setTravelerCount(travelerCount - 1)}
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
                            onClick={() => setTravelerCount(travelerCount + 1)}
                            disabled={travelerCount >= MAX_TRAVELERS}
                            className="p-1 rounded-full text-blue-600 hover:bg-blue-50 disabled:text-gray-400 disabled:hover:bg-transparent transition"
                            title="Añadir pasajero"
                        >
                            <PlusIcon className="h-5 w-5 stroke-2" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                {travelers.map((traveler, index) => (
                    <TravelerForm 
                        key={traveler.id} 
                        traveler={traveler}
                        index={index}
                        handleTravelerChange={handleTravelerChange}
                    />
                ))}
            </div>

            <div className="pt-6 border-t border-gray-100 mt-6 space-y-6">

                <div className="space-y-4 p-4 border border-gray-200 rounded-xl">
                    <div className="flex justify-between items-center">
                        <label htmlFor="travelsWithPets" className="text-lg font-medium text-gray-700">
                            ¿Viajas con mascotas? 
                            <span className="text-sm text-gray-500 ml-2">(Costo {COST_PER_PET}$ c/u)</span>
                        </label>
                        <input
                            type="checkbox"
                            id="travelsWithPets"
                            checked={services.travelsWithPets}
                            onChange={(e) => handleServiceToggle('travelsWithPets', e.target.checked)}
                            className="h-6 w-11 rounded-full appearance-none bg-gray-300 checked:bg-blue-600 transition duration-200 cursor-pointer relative after:absolute after:top-0.5 after:left-0.5 after:bg-white after:w-5 after:h-5 after:rounded-full after:shadow-md checked:after:translate-x-full"
                        />
                    </div>
                    {(services.travelsWithPets) && (
                        <div className="max-w-full">
                            <label htmlFor="petCount" className="sr-only">Cantidad</label>
                            <input
                                type="number"
                                id="petCount"
                                value={services.petCount || ''}
                                onChange={(e) => handleServiceCountChange('petCount', e.target.value)}
                                min="1"
                                max={travelerCount}
                                placeholder="Cantidad"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                            />
                        </div>
                    )}
                </div>

                <div className="space-y-4 p-4 border border-gray-200 rounded-xl">
                    <div className="flex justify-between items-center">
                        <label htmlFor="needsExtraLuggage" className="text-lg font-medium text-gray-700">
                            ¿Necesitas maletas adicionales?
                            <span className="text-sm text-gray-500 ml-2">(Costo {COST_PER_EXTRA_LUGGAGE}$ c/u)</span>
                        </label>
                        <input
                            type="checkbox"
                            id="needsExtraLuggage"
                            checked={services.needsExtraLuggage}
                            onChange={(e) => handleServiceToggle('needsExtraLuggage', e.target.checked)}
                            className="h-6 w-11 rounded-full appearance-none bg-gray-300 checked:bg-blue-600 transition duration-200 cursor-pointer relative after:absolute after:top-0.5 after:left-0.5 after:bg-white after:w-5 after:h-5 after:rounded-full after:shadow-md checked:after:translate-x-full"
                        />
                    </div>
                    {(services.needsExtraLuggage) && (
                        <div className="max-w-full">
                            <label htmlFor="extraLuggageCount" className="sr-only">Cantidad</label>
                            <input
                                type="number"
                                id="extraLuggageCount"
                                value={services.extraLuggageCount || ''}
                                onChange={(e) => handleServiceCountChange('extraLuggageCount', e.target.value)}
                                min="1"
                                max={travelerCount}
                                placeholder="Cantidad"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-gray-200 mt-8">
                <button
                    onClick={prevStep}
                    className="inline-flex items-center px-6 py-2 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-100 transition ease-in-out duration-150 shadow-sm"
                >
                    Anterior
                </button>

                <button
                    onClick={nextStep}
                    disabled={!isStepValid} 
                    className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-lg shadow-md text-white bg-blue-600 hover:bg-blue-700 transition ease-in-out duration-150 disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                    Siguiente
                </button>
            </div>
        </section>
    );
};
