import React, { useCallback } from 'react';
import { StepProps, Traveler } from '@/types/booking';
import { UsersIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { StepContainer } from '../../common/stepContainer';
import { StepNavigation } from '../../common/stepNavigation';
import { TravelerCounter } from '../../common/travelerCounter';
import { ServiceToggleWithCount } from '../../common/serviceToggleWithCount';

import TravelerForm from './travelerForm';

const MAX_TRAVELERS = 10;
const MIN_TRAVELERS = 1;
const MAX_SERVICE_COUNT = 100;
const COST_PER_PET = 100;
const COST_PER_EXTRA_LUGGAGE = 50;

export const Step2: React.FC<StepProps> = ({
    bookingFormData,
    updateFormData,
    nextStep,
    prevStep,
    canProceed,
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
            if (newCount === 0) {
                newServices.travelsWithPets = false;
                newServices.petCount = undefined;
                newServices.needsExtraLuggage = false;
                newServices.extraLuggageCount = undefined;
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
        const updatedTravelers = travelers.map((t: Traveler) =>
            t.id === id ? { ...t, [key]: value } : t
        );
        updateFormData('travelers', updatedTravelers);
    }, [travelers, updateFormData]);


    const handleServiceToggle = useCallback((key: 'travelsWithPets' | 'needsExtraLuggage', value: boolean) => {
        const newState = { ...services, [key]: value };

        if (key === 'travelsWithPets') {
            newState.petCount = value ? (newState.petCount && newState.petCount >= 1 ? newState.petCount : 1) : undefined;
        }
        if (key === 'needsExtraLuggage') {
            newState.extraLuggageCount = value ? (newState.extraLuggageCount && newState.extraLuggageCount >= 1 ? newState.extraLuggageCount : 1) : undefined;
        }

        updateFormData('services', newState);
    }, [services, updateFormData]);

    const handleServiceCountChange = useCallback((key: 'petCount' | 'extraLuggageCount', value: string) => {
        const countInt = parseInt(value, 10);

        let finalCount: number | undefined;

        if (isNaN(countInt)) {
            finalCount = undefined;
        } else {
            const minCount = Math.max(1, countInt);
            finalCount = Math.min(minCount, MAX_SERVICE_COUNT);
        }

        updateFormData('services', { ...services, [key]: finalCount });
    }, [services, updateFormData]);

    return (
        <StepContainer
            title="Información Personal"
            icon={<UsersIcon className="h-6 w-6" />}
            footer={
                <StepNavigation
                    prevStep={prevStep}
                    nextStep={nextStep}
                    canProceed={canProceed}
                    isLastStep={false}
                />
            }
        >
            <TravelerCounter
                travelerCount={travelerCount}
                MIN_TRAVELERS={MIN_TRAVELERS}
                MAX_TRAVELERS={MAX_TRAVELERS}
                onCountChange={setTravelerCount}
            />

            <div className="space-y-8">
                {travelers.map((traveler: Traveler, index: number) => (
                    <TravelerForm
                        key={traveler.id}
                        traveler={traveler}
                        index={index}
                        handleTravelerChange={handleTravelerChange}
                    />
                ))}
            </div>

            <div className="pt-6 border-t border-gray-100 mt-6 space-y-6">

                <ServiceToggleWithCount
                    id="travelsWithPets"
                    label="¿Viajas con mascotas?"
                    costPerUnit={COST_PER_PET}
                    isChecked={services.travelsWithPets}
                    onToggleChange={(checked) => handleServiceToggle('travelsWithPets', checked)}
                    countLabel="Cantidad de mascotas"
                    countValue={services.petCount}
                    onCountChange={(value) => handleServiceCountChange('petCount', value)}
                    maxCount={MAX_SERVICE_COUNT}
                />

                <ServiceToggleWithCount
                    id="needsExtraLuggage"
                    label="¿Necesitas maletas adicionales?"
                    costPerUnit={COST_PER_EXTRA_LUGGAGE}
                    isChecked={services.needsExtraLuggage}
                    onToggleChange={(checked) => handleServiceToggle('needsExtraLuggage', checked)}
                    countLabel="Cantidad de maletas"
                    countValue={services.extraLuggageCount}
                    onCountChange={(value) => handleServiceCountChange('extraLuggageCount', value)}
                    maxCount={MAX_SERVICE_COUNT}
                />
            </div>
        </StepContainer>
    );
};