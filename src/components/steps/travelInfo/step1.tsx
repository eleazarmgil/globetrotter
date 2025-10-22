import React, { useMemo } from 'react';
import { StepProps } from '../../../types/booking'; 
import { SearchIcon, PlaneIcon} from 'lucide-react';
import { StepContainer } from '../../common/stepContainer';
import { StepNavigation } from '../../common/stepNavigation';
import { FormInputGroup } from '../../common/formInputGroup';
import { FormElement } from '../../common/formElement'; 
import { DestinationOption } from '../../../types/booking';
import { formatCurrency } from '../../../utils/formatCurrency'; 


interface FlightClassOption {
    class: string;
    display: string;
}

/**
 * @component
 * @description The first step in the booking flow, focused on selecting the trip's destination,
 * flight class, and departure/return dates.
 * @param {StepProps} props - The component's props.
 * @param {object} props.bookingFormData - The current state of the booking form data.
 * @param {function} props.updateFormData - Function to update the main booking form data state.
 * @param {function} props.nextStep - Function to navigate to the next step.
 * @param {DestinationOption[]} props.flightOptions - Available flight options for destination selection.
 * @param {function} props.prevStep - Function to navigate to the previous step (optional).
 * @param {boolean} props.canProceed - Flag indicating if the current step validation allows proceeding.
 * @returns {JSX.Element} The Step 1 Trip Information component.
 */
export const Step1 = ({ 
    bookingFormData, 
    updateFormData, 
    nextStep, 
    flightOptions,
    prevStep, 
    canProceed, 
}: StepProps) => {

    const minDateToday = new Date().toISOString().split('T')[0];

    const uniqueDestinations = useMemo(() => {
        const destinations = new Set<string>();
        flightOptions.forEach((opt: DestinationOption) => {
            destinations.add(opt.destination); 
        });
        return Array.from(destinations);
    }, [flightOptions]);

    const availableClasses = useMemo(() => {
        const selectedDestination = bookingFormData.trip.destination;
        if (!selectedDestination) return [];
        return flightOptions
            .filter((opt: DestinationOption) => opt.destination === selectedDestination)
            .map((opt: DestinationOption) => ({
                class: opt.class,
                display: `${opt.class} (${formatCurrency(opt.priceUSD)})`
            }));
    }, [flightOptions, bookingFormData.trip.destination]);

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

    const handleDateChange = (key: 'departureDate' | 'returnDate', e: React.ChangeEvent<HTMLInputElement>) => {
        updateFormData('trip', { 
            ...bookingFormData.trip, 
            [key]: e.target.value 
        });
    };

    return (
        <StepContainer 
            title="Información del Viaje"
            icon={<PlaneIcon />}
            footer={
                <StepNavigation 
                    nextStep={nextStep} 
                    canProceed={canProceed || false} 
                    isLastStep={false}
                />
            }
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <FormInputGroup label="Destino">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                    
                    <FormElement>
                        <select
                            id="destination"
                            className="pl-10"
                            onChange={handleDestinationChange}
                            value={bookingFormData.trip.destination}
                            required
                        >
                            <option value="" disabled className="text-gray-800">Seleccionar</option>
                            {uniqueDestinations.map(destinationName => (
                                <option key={destinationName} value={destinationName}>
                                    {destinationName}
                                </option>
                            ))}
                        </select>
                    </FormElement>
                </FormInputGroup>
                
                <FormInputGroup label="Clase">
                    <PlaneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                    <FormElement>
                        <select
                            id="flightClass"
                            className="pl-10"
                            onChange={handleFlightClassChange}
                            value={bookingFormData.trip.flightClass}
                            disabled={!bookingFormData.trip.destination} 
                            required
                        >
                            {availableClasses.map((classOption:FlightClassOption) => (
                                <option key={classOption.class} value={classOption.class}>
                                    {classOption.display}
                                </option>
                            ))}
                        </select>
                    </FormElement>
                </FormInputGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <FormInputGroup label="Check-in">
                    <FormElement>
                        <input
                            type="date"
                            id="departureDate"
                            onChange={(e) => handleDateChange('departureDate', e)}
                            value={bookingFormData.trip.departureDate}
                            placeholder="MM / DD / YYYY"
                            min={minDateToday}
                            required
                        />
                    </FormElement>
                </FormInputGroup>

                <FormInputGroup label="Check-out">
                    <FormElement>
                        <input
                            type="date"
                            id="returnDate"
                            onChange={(e) => handleDateChange('returnDate', e)}
                            value={bookingFormData.trip.returnDate}
                            placeholder="MM / DD / YYYY" 
                            required
                        />
                    </FormElement>
                </FormInputGroup>
            </div>
        </StepContainer>
    );
};