import { useState, useCallback, useMemo, useEffect } from 'react';
import { BookingState, BookingFormData, Traveler, DestinationOption } from '../types/booking';
import { validateStep } from '../utils/validation';
import { fetchFlightOptions } from '../services/flightService';
import { calculateTotalCost } from '../utils/calculateTotalCost';
import { CostSummary } from '../utils/calculateTotalCost';

const INITIAL_FORM_DATA: BookingFormData = {
    trip: {
        destination: '',
        departureDate: '',
        returnDate: '',
        flightClass: '',
    } as any,
    travelers: [{
        id: crypto.randomUUID(),
        fullName: '',
        dateOfBirth: '',
        documentType: '',
        documentNumber: '',
    }] as Traveler[],
    services: {
        travelsWithPets: false,
        petCount: 0,
        needsExtraLuggage: false,
        extraLuggageCount: 0,
        addInsurance: true,
        selectSeats: false,
        requiresSpecialAssistance: false,
        assistanceNotes: null,
    } as any,
};

const INITIAL_STATE: BookingState = {
    currentStep: 1,
    bookingFormData: INITIAL_FORM_DATA,
    flightOptions: [],
};

interface BookingFlowResult {
    state: BookingState;
    updateFormData: <K extends keyof BookingFormData>(key: K, value: BookingFormData[K]) => void;
    nextStep: () => void;
    prevStep: () => void;
    handleFinalize: () => void;
    canProceed: boolean;
    totalCost: number;
    isLoading: boolean;
    error: string | null;
    isConfirmed: boolean;
    calculateTotalCost: (formData: BookingFormData, options: DestinationOption[]) => CostSummary;
    resetConfirmation: () => void;
}

/**
 * @hook
 * @description Custom hook to manage the state and logic for the multi-step booking flow.
 * It handles form data, step navigation, data fetching, and validation.
 * @returns {BookingFlowResult} An object containing the current state and all necessary handlers.
 */
export const useBookingFlow = (): BookingFlowResult => {
    const [state, setState] = useState<BookingState>(INITIAL_STATE);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const loadFlightData = async () => {
            setIsLoading(true);
            try {
                const options: DestinationOption[] = await fetchFlightOptions();
                setState(prevState => ({
                    ...prevState,
                    flightOptions: options,
                    bookingFormData: {
                        ...prevState.bookingFormData,
                        trip: {
                            ...prevState.bookingFormData.trip,
                            destination: options.length > 0 ? options[0].destination : '',
                        }
                    }
                }));
                setError(null);
            } catch (err) {
                console.error("Error al cargar opciones de vuelo:", err);
                setError("Error al cargar las opciones de vuelo. Por favor, inténtalo de nuevo.");
            } finally {
                setIsLoading(false);
            }
        };
        loadFlightData();
    }, []);

    /**
     * @function updateFormData
     * @description Generic handler to update a specific section (key) of the booking form data.
     * @template K - The key of the BookingFormData to update.
     * @param {K} key - The top-level key of the form data to modify ('trip', 'travelers', or 'services').
     * @param {BookingFormData[K]} value - The new value for that key.
     * @returns {void}
     */
    const updateFormData = useCallback(<K extends keyof BookingFormData>(key: K, value: BookingFormData[K]) => {
        setState(prevState => ({
            ...prevState,
            bookingFormData: {
                ...prevState.bookingFormData,
                [key]: value,
            },
        }));
    }, []);

    /**
     * @function nextStep
     * @description Moves the flow to the next step, up to a maximum of 4.
     * @returns {void}
     */
    const nextStep = useCallback(() => {
        setState(prevState => ({
            ...prevState,
            currentStep: Math.min(prevState.currentStep + 1, 4),
        }));
    }, []);

    /**
     * @function prevStep
     * @description Moves the flow to the previous step, down to a minimum of 1.
     * @returns {void}
     */
    const prevStep = useCallback(() => {
        setState(prevState => ({
            ...prevState,
            currentStep: Math.max(prevState.currentStep - 1, 1),
        }));
    }, []);

    /**
     * @function handleFinalize
     * @description Logs the final booking data and sets the confirmation modal state to true.
     * @returns {void}
     */
    const handleFinalize = useCallback(() => {
        console.log("Reserva Finalizada:", state.bookingFormData);
        setIsConfirmed(true);
    }, [state.bookingFormData]);

    /**
     * @const canProceed
     * @description Memoized boolean flag indicating if the user can proceed to the next step,
     * based on the current step's validation rules.
     * @type {boolean}
     */
    const canProceed = useMemo(() => {
        if (state.currentStep === 1 && state.flightOptions.length === 0) 
            return false;
        return validateStep(state.currentStep, state.bookingFormData);
    }, [state.currentStep, state.bookingFormData, state.flightOptions]);

    /**
     * @const totalCost
     * @description Memoized calculation of the total cost of the booking.
     * @type {number}
     */
    const totalCost = useMemo(() => {
        return calculateTotalCost(state.bookingFormData, state.flightOptions).total;
    }, [state.bookingFormData, state.flightOptions]);

    /**
     * @function resetConfirmation
     * @description Closes the confirmation modal.
     * @returns {void}
     */
    const resetConfirmation = useCallback(() => {
        setIsConfirmed(false);
    }, []);

    return {
        state,
        updateFormData,
        nextStep,
        prevStep,
        handleFinalize,
        canProceed,
        totalCost,
        isLoading,
        error,
        isConfirmed,
        calculateTotalCost,
        resetConfirmation
    };
};