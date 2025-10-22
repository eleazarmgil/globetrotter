import React, { useCallback, useMemo } from 'react';
import { BookingFormData } from '@/types/booking'; 
import { AdditionalService } from '@/types/booking/additionalService'; 
import { DestinationOption } from '@/types/booking/destinationOption';
import { ListPlusIcon } from 'lucide-react'; 
import { SimpleToggle } from '../../common/simpleToggle'; 
import { StepContainer } from '../../common/stepContainer';
import { StepNavigation } from '../../common/stepNavigation';


interface StepProps {
    bookingFormData: BookingFormData;
    flightOptions: DestinationOption[]; 
    updateFormData: <K extends keyof BookingFormData>(key: K, value: BookingFormData[K]) => void;
    nextStep: () => void;
    prevStep: () => void;
}

const MAX_NOTES_CHARS = 200;

/**
 * @component Step3
 * @description Represents the third step in the booking flow, allowing the user to select
 * and configure optional additional services.
 * @param {StepProps} props - The component's props.
 * @param {BookingFormData} props.bookingFormData - The current state of the entire booking form data.
 * @param {DestinationOption[]} props.flightOptions - List of available flight options (not used directly in this step).
 * @param {(key: K, value: BookingFormData[K]) => void} props.updateFormData - Callback to update the main form state.
 * @param {() => void} props.nextStep - Callback to advance to the next step.
 * @param {() => void} props.prevStep - Callback to return to the previous step.
 */
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
        
        let newServices = { ...services, [key]: checked as any };
        if (key === 'requiresSpecialAssistance' && !checked) {
            newServices.assistanceNotes = undefined;
        }
        updateFormData('services', newServices);

    }, [services, updateFormData]);

    const handleNotesChange = useCallback((value: string) => {
        handleServiceChange('assistanceNotes', value);
    }, [handleServiceChange]);
    
    const isStepValid = useMemo(() => {
        if (services.requiresSpecialAssistance) {
            return services.assistanceNotes && services.assistanceNotes.trim().length > 0;
        }
        return true;
    }, [services]);

    const isSpecialAssistanceRequired = services.requiresSpecialAssistance || false;

    return (
        <StepContainer
            title="Servicios Adicionales"
            icon={<ListPlusIcon className="h-6 w-6 text-blue-600" />}
            footer={
                <StepNavigation
                    prevStep={prevStep}
                    nextStep={nextStep}
                    canProceed={isStepValid || false}
                    isLastStep={false}
                />
            }
        >
            <div className="border border-gray-200 rounded-xl p-4 divide-y divide-gray-100">
                
                <SimpleToggle
                    id="addInsurance"
                    label="Seguro de viaje"
                    description="Cubre cancelaciones, pérdidas y emergencias médicas."
                    checked={services.addInsurance || false}
                    onChange={(checked) => handleToggleChange('addInsurance', checked)}
                />
                
                <SimpleToggle
                    id="selectSeats"
                    label="Selección de asientos preferenciales"
                    description="Selecciona tu asiento favorito antes del check-in."
                    checked={services.selectSeats || false}
                    onChange={(checked) => handleToggleChange('selectSeats', checked)}
                />
                
                <SimpleToggle
                    id="requiresSpecialAssistance"
                    label="Asistencia especial"
                    description="Marcar si requiere silla de ruedas, asistencia con equipaje o médica."
                    checked={isSpecialAssistanceRequired}
                    onChange={(checked) => handleToggleChange('requiresSpecialAssistance', checked)}
                />
                
                {isSpecialAssistanceRequired && (
                    <div className="pt-4 px-4 bg-gray-50 rounded-b-xl -mx-4 -mb-4">
                        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-inner">
                            <label htmlFor="assistanceNotes" className="block text-sm font-medium text-gray-700 mb-2">
                                Detalles de la Asistencia *
                            </label>
                            <textarea
                                id="assistanceNotes"
                                value={services.assistanceNotes || ''}
                                onChange={(e) => handleNotesChange(e.target.value)}
                                rows={4}
                                maxLength={MAX_NOTES_CHARS}
                                required
                                placeholder="Especifique su necesidad de asistencia."
                                className={`mt-1 block w-full rounded-lg shadow-sm p-3 text-gray-800 \
                                    ${!isStepValid ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`
                                }
                            />
                            <p className="text-xs text-gray-500 mt-1 flex justify-between">
                                <span>Caracteres restantes: {MAX_NOTES_CHARS - (services.assistanceNotes?.length || 0)}</span>
                                {!isStepValid && isSpecialAssistanceRequired && (
                                    <span className="text-red-500 font-medium">Este campo es obligatorio.</span>
                                )}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </StepContainer>
    );
};