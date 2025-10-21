import React, { useCallback, useMemo } from 'react';
import { BookingFormData } from '@/types/booking'; 
import { AdditionalService } from '@/types/booking/additionalService'; 
import { DestinationOption } from '@/types/booking/destinationOption';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'; 

interface StepProps {
    bookingFormData: BookingFormData;
    flightOptions: DestinationOption[]; 
    updateFormData: <K extends keyof BookingFormData>(key: K, value: BookingFormData[K]) => void;
    nextStep: () => void;
    prevStep: () => void;
}

const MAX_NOTES_CHARS = 200;

export const Step3: React.FC<StepProps> = ({ 
    bookingFormData, 
    updateFormData,
    nextStep,
    prevStep,
}) => {
    
    const { services } = bookingFormData;

    const handleServiceChange = useCallback(<K extends keyof AdditionalService>(
        key: K, 
        value: AdditionalService[K]
    ) => {
        updateFormData('services', { ...services, [key]: value });
    }, [services, updateFormData]);

    const handleToggleChange = useCallback((key: 'addInsurance' | 'selectSeats' | 'requiresSpecialAssistance', checked: boolean) => {
        
        handleServiceChange(key, checked as any); 
        if (key === 'requiresSpecialAssistance' && !checked) {
            handleServiceChange('assistanceNotes', undefined);
        }
    }, [handleServiceChange]);

    const handleNotesChange = useCallback((value: string) => {
        const safeValue = value.slice(0, MAX_NOTES_CHARS);
        handleServiceChange('assistanceNotes', safeValue);
    }, [handleServiceChange]);
    
    const isStepValid = useMemo(() => {
        if (services.requiresSpecialAssistance) {
            return services.assistanceNotes && services.assistanceNotes.length > 0;
        }
        return true;
    }, [services]);

    const ServiceToggle: React.FC<{ label: string, checked: boolean, onChange: (checked: boolean) => void, id: string }> = 
        ({ label, checked, onChange, id }) => (
            <div className="flex justify-between items-center py-4 border-b border-gray-100 last:border-b-0">
                <label htmlFor={id} className="text-lg font-normal text-gray-700 cursor-pointer">
                    {label}
                </label>
                <input
                    type="checkbox"
                    id={id}
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="h-6 w-11 rounded-full appearance-none bg-gray-300 checked:bg-blue-600 transition duration-200 cursor-pointer relative after:absolute after:top-0.5 after:left-0.5 after:bg-white after:w-5 after:h-5 after:rounded-full after:shadow-md checked:after:translate-x-full"
                />
            </div>
        );


    return (
        <section className="space-y-8 p-6 md:p-8 bg-white rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Otros servicios
            </h1>

            <div className="border border-gray-200 rounded-xl p-4 space-y-2">
                <ServiceToggle
                    id="addInsurance"
                    label="¿Desea agregar seguro de viaje?"
                    checked={services.addInsurance || false}
                    onChange={(checked) => handleToggleChange('addInsurance', checked)}
                />
                <ServiceToggle
                    id="selectSeats"
                    label="¿Desea seleccionar asientos preferenciales?"
                    checked={services.selectSeats || false}
                    onChange={(checked) => handleToggleChange('selectSeats', checked)}
                />
                <div className="py-4 border-b border-gray-100 last:border-b-0">
                    <ServiceToggle
                        id="requiresSpecialAssistance"
                        label="¿Requiere asistencia especial?"
                        checked={services.requiresSpecialAssistance || false}
                        onChange={(checked) => handleToggleChange('requiresSpecialAssistance', checked)}
                    />
                    
                    {services.requiresSpecialAssistance && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <label htmlFor="assistanceNotes" className="block text-sm font-medium text-gray-700 mb-2">
                                Nota
                            </label>
                            <textarea
                                id="assistanceNotes"
                                value={services.assistanceNotes || ''}
                                onChange={(e) => handleNotesChange(e.target.value)}
                                rows={4}
                                maxLength={MAX_NOTES_CHARS}
                                required
                                placeholder="Especifique su necesidad de asistencia..."
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Caracteres restantes: {MAX_NOTES_CHARS - (services.assistanceNotes?.length || 0)}
                            </p>
                            {isStepValid === false && services.requiresSpecialAssistance && (!services.assistanceNotes || services.assistanceNotes.length === 0) && (
                                <p className="text-red-500 text-sm mt-1">Este campo es obligatorio si se requiere asistencia.</p>
                            )}
                        </div>
                    )}
                </div>

            </div>

            <div className="flex justify-between pt-6 border-t border-gray-200 mt-8">
                <button
                    onClick={prevStep}
                    className="inline-flex items-center px-6 py-2 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-100 transition ease-in-out duration-150 shadow-sm"
                >
                    <ChevronLeftIcon className="w-5 h-5 mr-2" />
                    Anterior
                </button>

                <button
                    onClick={nextStep}
                    disabled={!isStepValid} 
                    className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-lg shadow-md text-white bg-blue-600 hover:bg-blue-700 transition ease-in-out duration-150 disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                    Siguiente
                    <ChevronRightIcon className="w-5 h-5 ml-2" />
                </button>
            </div>
        </section>
    );
};