import React, { useMemo } from 'react';
import { DollarSignIcon } from 'lucide-react';
import { StepProps } from '@/types/booking';
import { calculateTotalCost, CostSummary } from '@/utils/calculateTotalCost';
import { validateStep } from '@/utils/validation'; 
import { TripDetailsCard } from './tripDetailsCard';
import { TravelerInfoCard } from './travelerInfoCard';
import { AdditionalServicesCard } from './additionalServicesCard';
import { CostSummaryCard } from './costSummaryCard';
import { StepContainer } from '../../common/stepContainer';
import { StepNavigation } from '../../common/stepNavigation';

export const Step4: React.FC<StepProps> = ({
    bookingFormData,
    flightOptions,
    handleSubmit,
    prevStep
}) => {

    const costSummary: CostSummary = useMemo(() => {
        if (typeof calculateTotalCost !== 'function') {
            return { baseFlight: 0, pets: 0, luggage: 0, total: 0 } as CostSummary;
        }
        return calculateTotalCost(bookingFormData, flightOptions);
    }, [bookingFormData, flightOptions]);

    const { trip, travelers, services } = bookingFormData;
    const travelerCount = travelers.length;
    const isReadyToPay = validateStep(3, bookingFormData) && validateStep(2, bookingFormData) && validateStep(1, bookingFormData);

    const footer = (
        <StepNavigation
            prevStep={prevStep}
            handleSubmit={handleSubmit}
            canProceed={isReadyToPay}
            isLastStep={true}
        />
    );

    return (
        <StepContainer 
            title="Resumen"
            icon={<DollarSignIcon />}
            footer={footer}
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <TripDetailsCard trip={trip} travelerCount={travelerCount} />
                    <TravelerInfoCard travelers={travelers} />
                    <AdditionalServicesCard services={services} />
                </div>
                <CostSummaryCard costSummary={costSummary} travelerCount={travelerCount} />
            </div>
        </StepContainer>
    );
};