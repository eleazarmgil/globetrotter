import React, { useMemo } from 'react';
import { StepProps } from '../../types/booking'; 
import { SearchIcon, PlaneIcon} from 'lucide-react';
import { StepContainer } from '../common/stepContainer';
import { StepNavigation } from '../common/stepNavigation';
import { FormInputGroup } from '../common/formInputGroup';
import { FormElement } from '../common/formElement'; 
import { DestinationOption } from '../../types/booking';

export const Step1 = ({ 
    bookingFormData, 
    updateFormData, 
    nextStep, 
    flightOptions,
    prevStep, 
    canProceed, 
}: StepProps) => {

    const uniqueDestinations = useMemo(() => {
        const destinations = new Set<string>();
        flightOptions.forEach((opt: DestinationOption) => {
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
                            required
                        >
                            <option value="Economy">Economy</option>
                            <option value="Business">Business</option>
                            <option value="First Class">Primera Clase</option>
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