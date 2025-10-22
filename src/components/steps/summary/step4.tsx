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

/**
 * @component
 * @description The final step in the booking flow, displaying a complete summary of the trip,
 * traveler details, selected additional services, and the total cost.
 * It also includes the navigation to finalize the booking.
 * @param {StepProps} props - The component's props.
 * @param {object} props.bookingFormData - The current state of the booking form data.
 * @param {DestinationOption[]} props.flightOptions - Available flight options to calculate costs.
 * @param {function} props.handleSubmit - Function to call when the user finalizes the booking.
 * @param {function} props.prevStep - Function to navigate to the previous step.
 * @returns {JSX.Element} The Step 4 Summary component.
 */
export const Step4: React.FC<StepProps> = ({
    bookingFormData,
    flightOptions,
    handleFinalize,
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
            handleSubmit={handleFinalize}
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