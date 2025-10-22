import { useState, useCallback, useMemo, useEffect } from 'react';
import { BookingState, BookingFormData, DestinationOption } from '../types/booking';
import { validateStep } from '../utils/validation';
import { fetchFlightOptions } from '../services/flightService';
import { calculateTotalCost } from '../utils/calculateTotalCost';

const INITIAL_FORM_DATA: BookingFormData = {
    trip: {
        destination: '',
        departureDate: '',
        returnDate: '',
        flightClass: 'Economy', 
    },
    travelers: [{
        id: crypto.randomUUID(), 
        fullName: '',
        dateOfBirth: '',
        documentType: '',
        documentNumber: '',
    }],
    services: {
        travelsWithPets: false,
        petCount: 0,
        needsExtraLuggage: false,
        extraLuggageCount: 0,
        addInsurance: true,
        selectSeats: false,
        requiresSpecialAssistance: false,
        assistanceNotes: undefined, 
    },
};

const INITIAL_STATE: BookingState = {
    currentStep: 1,
    bookingFormData: INITIAL_FORM_DATA,
    flightOptions: [],
};

export interface BookingFlowResult {
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
    bookingFormData: BookingFormData;
    flightOptions: DestinationOption[];
    currentStep:number;
    calculateTotalCost: typeof calculateTotalCost; 
    resetConfirmation: () => void;
}

/**
 * @hook useBookingFlow
 * @description Manages the state and logic for the entire multi-step booking process.
 * @returns {BookingFlowResult} The state and control functions for the booking flow.
 */
export const useBookingFlow = (): BookingFlowResult => {
    const [state, setState] = useState<BookingState>(INITIAL_STATE);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const options = await fetchFlightOptions();
                setState(prevState => ({
                    ...prevState,
                    flightOptions: options,
                }));
                if (options.length === 0) {
                    setError("No se encontraron opciones de vuelo disponibles.");
                }
            } catch (err) {
                console.error("Error fetching initial data:", err);
                const errorMessage = err instanceof Error ? err.message : "Error desconocido.";
                setError(`Hubo un error al cargar las opciones de vuelo. Detalle: ${errorMessage}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const updateFormData = useCallback(<K extends keyof BookingFormData>(
        key: K,
        value: BookingFormData[K]
    ) => {
        setState(prevState => ({
            ...prevState,
            bookingFormData: {
                ...prevState.bookingFormData,
                [key]: value,
            },
        }));
    }, []);

    const nextStep = useCallback(() => {
        setState(prevState => ({
            ...prevState,
            currentStep: Math.min(prevState.currentStep + 1, 4),
        }));
    }, []);

    const prevStep = useCallback(() => {
        setState(prevState => ({
            ...prevState,
            currentStep: Math.max(prevState.currentStep - 1, 1),
        }));
    }, []);

    const handleFinalize = useCallback(() => {
        if (validateStep(1, state.bookingFormData) && validateStep(2, state.bookingFormData) && validateStep(3, state.bookingFormData)) {
            console.log("Reserva Finalizada con éxito:", state.bookingFormData);
            setIsConfirmed(true);
        } else {
            console.error("No se pudo finalizar la reserva: Formulario incompleto o inválido.");
            setError("No se pudo finalizar la reserva: Formulario incompleto o inválido.");
        }
    }, [state.bookingFormData]);


    const canProceed = useMemo(() => {
        if (isLoading) return false;
        if (state.currentStep === 1 && error) return false;
        if (state.currentStep === 1) {
             return state.flightOptions.length > 0 && validateStep(state.currentStep, state.bookingFormData);
        }
            
        return validateStep(state.currentStep, state.bookingFormData);
    }, [state.currentStep, state.bookingFormData, state.flightOptions, isLoading, error]);

    const totalCost = useMemo(() => {
        return calculateTotalCost(state.bookingFormData, state.flightOptions).total;
    }, [state.bookingFormData, state.flightOptions]);

    /**
     * @function resetConfirmation
     * @description Cierra el modal de confirmación y reinicia el formulario
     * para una nueva reserva, manteniendo las opciones de vuelo cargadas.
     */
    const resetConfirmation = useCallback(() => {
        setIsConfirmed(false);
        setState(prevState => ({
            ...INITIAL_STATE, 
            flightOptions: prevState.flightOptions, 
        }));
        setIsLoading(false); 
        setError(null); 
    }, []);

    const { currentStep } = state;

    return {
        state,
        bookingFormData: state.bookingFormData,
        flightOptions: state.flightOptions,
        updateFormData,
        nextStep,
        prevStep,
        handleFinalize,
        canProceed,
        totalCost,
        isLoading,
        error,
        currentStep,
        isConfirmed,
        calculateTotalCost, 
        resetConfirmation,
    };
};