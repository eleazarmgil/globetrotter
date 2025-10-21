import { useState, useEffect, useCallback } from 'react';
import { 
    BookingState, 
    BookingFormData, 
    TripInfo, 
    Traveler, 
    AdditionalService, 
} from '@/types/booking'; 
import { fetchFlightOptions } from '@/services/flightService';
import { calculateTotalCost } from '@/utils/calculateTotalCost'; 

const initialTripInfo: TripInfo = {
    destination: '',
    departureDate: '',
    returnDate: '',
    flightClass: ''
}

const initialTraveler: Traveler = {
    id: '',
    fullName: '',
    dateOfBirth: '',
    documentType: '',
    documentNumber: ''
};

const initialServices: AdditionalService = {
    travelsWithPets: false,
    petCount: undefined,
    needsExtraLuggage: false,
    extraLuggageCount: undefined, 
    addInsurance: false,
    selectSeats: false,
    requiresSpecialAssistance: false,
    assistanceNotes: undefined, 
};

const initialFormData: BookingFormData = { 
    trip: initialTripInfo,
    travelers: [initialTraveler],
    services: initialServices,
};

const initialBookingState: BookingState = {
    currentStep: 1,
    bookingFormData: initialFormData,
    flightOptions: [],
};


export const useBookingForm = () => {
    const [state, setState] = useState<BookingState>(initialBookingState);
    const [totalCost, setTotalCost] = useState(0);

    useEffect(() => {
        const loadFlightOptions = async () => {
            const data = await fetchFlightOptions();
            setState(s => ({ ...s, flightOptions: data }));
        };
        loadFlightOptions();
    }, []);

    useEffect(() => {
        const costSummary = calculateTotalCost(state.bookingFormData, state.flightOptions);
        setTotalCost(costSummary.total);
    }, [state.bookingFormData, state.flightOptions]);

    const updateFormData = useCallback(<K extends keyof BookingFormData>(
        key: K, 
        value: BookingFormData[K]
    ) => {
        setState(s => ({
            ...s,
            bookingFormData: { 
                ...s.bookingFormData,
                [key]: value,
            },
        }));
    }, []);

    const nextStep = useCallback(() => {
        if (state.currentStep < 4) {
            setState(s => ({ ...s, currentStep: s.currentStep + 1 }));
        }
    }, [state.currentStep]);

    const prevStep = useCallback(() => {
        if (state.currentStep > 1) {
            setState(s => ({ ...s, currentStep: s.currentStep - 1 }));
        }
    }, [state.currentStep]);
    
    const handleSubmit = useCallback(() => {
        console.log('Final Data Submitted:', state.bookingFormData);
        alert('¡Reserva confirmada!');
    }, [state.bookingFormData]);


    return {
        ...state,
        totalCost,
        nextStep,
        prevStep,
        updateFormData,
        handleSubmit,
        calculateTotalCost 
    };
};