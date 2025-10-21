"use client";

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { CheckCircleIcon, ChevronLeftIcon, ChevronRightIcon, Loader2 } from 'lucide-react';
import { StepProps } from '../types/booking';
import {BookingState, BookingFormData, Traveler } from '../types/booking';
import { Step1 } from '../components/steps/step1';
import { Step2 } from '../components/steps/step2';
import { Step3 } from '../components/steps/step3';
import { Step4 } from '../components/steps/step4';
import { validateStep } from '../utils/validation';
import { fetchFlightOptions } from '../services/flightService'; 
import { calculateTotalCost } from '../utils/calculateTotalCost';

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

const App = () => {
    const [state, setState] = useState<BookingState>(INITIAL_STATE);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadFlightData = async () => {
            setIsLoading(true);
            try {
                const options = await fetchFlightOptions(); 
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

    const updateFormData = useCallback(<K extends keyof BookingFormData>(key: K, value: BookingFormData[K]) => {
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

    const handleFinalize = () => {
        console.log("Reserva Finalizada:", state.bookingFormData);
        setIsConfirmed(true);
    };
    
    const canProceed = useMemo(() => {
        if (state.currentStep === 1 && state.flightOptions.length === 0) return false;
        return validateStep(state.currentStep, state.bookingFormData);
    }, [state.currentStep, state.bookingFormData, state.flightOptions]);

const totalCost = useMemo(() => {
    return calculateTotalCost(state.bookingFormData, state.flightOptions).total;
}, [state.bookingFormData, state.flightOptions]);

    const renderStep = () => {
        const commonProps: StepProps = {
        bookingFormData: state.bookingFormData,
        flightOptions: state.flightOptions,
        updateFormData,
        calculateTotalCost,
        totalCost,
        nextStep,  
        prevStep, 
        currentStep: state.currentStep, 
        handleSubmit: handleFinalize, 
    };

        switch (state.currentStep) {
            case 1:
                return <Step1 {...commonProps} />;
            case 2:
                return <Step2 {...commonProps} />;
            case 3:
                return <Step3 {...commonProps} />;
            case 4:
                return <Step4 {...commonProps} />;
            default:
                return <div className="text-red-500">Paso no encontrado.</div>;
        }
    };
    
    const steps = [
        "Información del viaje", "Información personal", "Otros servicios", "Resumen"
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-lg">
                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                    <h2 className="text-xl font-bold text-gray-800">Cargando opciones de vuelo...</h2>
                    <p className="text-gray-600">Esto puede tomar un momento.</p>
                </div>
            </div>
        );
    }
    
    if (error) {
          return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="p-8 bg-red-100 border border-red-400 text-red-700 rounded-xl shadow-lg max-w-md text-center mx-auto">
                    <p className="font-bold mb-2">Error de Carga</p>
                    <p>{error}</p>
                </div>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans">
            <header className="text-center mb-10">
                <h1 className="text-3xl font-extrabold text-blue-900 border-b-4 border-indigo-400 inline-block pb-1">
                    Globetrotter
                </h1>
            </header>

            <div className="max-w-4xl mx-auto">
                 {isConfirmed && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-10 rounded-xl shadow-2xl text-center max-w-sm">
                            <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4"/>
                            <h2 className="text-2xl font-bold text-gray-800">¡Reserva Confirmada!</h2>
                        </div>
                    </div>
                )}
                
                <nav className="flex justify-between items-center mb-8 p-4 bg-white rounded-xl shadow-md">
                    {steps.map((label, index) => {
                        const stepNumber = index + 1;
                        const isActive = stepNumber === state.currentStep;
                        const isCompleted = stepNumber < state.currentStep;

                        return (
                            <div 
                                key={stepNumber}
                                className="flex-1 text-center cursor-pointer"
                                onClick={() => setState(s => ({...s, currentStep: stepNumber}))}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 font-bold transition-colors duration-300 
                                    ${isActive ? 'bg-indigo-600 text-white shadow-lg' : isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}
                                >
                                    {isCompleted ? <CheckCircleIcon className="w-4 h-4"/> : stepNumber}
                                </div>
                                <span className={`text-xs font-medium hidden sm:block ${isActive ? 'text-indigo-600' : 'text-gray-500'}`}>
                                    {label}
                                </span>
                            </div>
                        );
                    })}
                </nav>

                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl min-h-[300px]">
                    {renderStep()}
                </div>
            </div>
        </div>
    );
};

export default App;