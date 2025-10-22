"use client";

import React from 'react';
import { CheckCircleIcon, Loader2 } from 'lucide-react';
import { StepProps } from '../types/booking';
import { BookingState, BookingFormData, Traveler } from '../types/booking';
import { Step1 } from '../components/steps/travelInfo/step1';
import { Step2 } from '../components/steps/travelerInfo/step2';
import { Step3 } from '../components/steps/additionalServicesInfo/step3';
import { Step4 } from '../components/steps/summary/step4';
import { useBookingFlow } from '@/hooks/useBookingFlow';
import { ConfirmationModal } from '@/components/common/confirmationModal';

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
}


const App = () => {
    const {
        state,
        updateFormData,
        nextStep,
        prevStep,
        handleFinalize,
        isLoading,
        error,
        isConfirmed,
        totalCost,
        canProceed,
        calculateTotalCost,
        resetConfirmation,
    } = useBookingFlow();

    const commonProps: StepProps = {
        bookingFormData: state.bookingFormData,
        flightOptions: state.flightOptions,
        updateFormData,
        nextStep,
        prevStep,
        handleSubmit: handleFinalize,
        totalCost,
        calculateTotalCost,
        currentStep: state.currentStep,
        canProceed
    };

    const renderStep = () => {
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
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans" style={{
            backgroundImage: `linear-gradient(rgba(12, 127, 218, 0.4), rgba(12, 127, 218, 0.4)), url('/background.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
        }}>
            <header
                className="fixed top-0 left-0 right-0 z-20 bg-white shadow-lg py-4 text-left"
            >
                <h1 className="pl-10 text-3xl font-regular text-gray-600 inline-block pb-1">
                    Globetrotter
                </h1>
            </header>

            <div className="pt-[80px] w-full max-w-4xl mx-auto">

                <ConfirmationModal
                    isOpen={isConfirmed}
                    onClose={resetConfirmation}
                    title="¡Reserva Confirmada!"
                    message="Hemos enviado los detalles de su vuelo."
                />


                <nav className="flex justify-between items-center mb-8 p-4 bg-white rounded-xl shadow-md">
                    {steps.map((label, index) => {
                        const stepNumber = index + 1;
                        const isActive = stepNumber === state.currentStep;
                        const isCompleted = stepNumber < state.currentStep;

                        return (
                            <div
                                key={stepNumber}
                                className="flex-1 text-center cursor-pointer"
                                onClick={() => {
                                    if (stepNumber < state.currentStep) prevStep();
                                }}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 font-bold transition-colors duration-300 
                                    ${isActive ? 'bg-blue-600 text-white shadow-lg' : isCompleted ? 'bg-blue-400 text-white' : 'bg-gray-200 text-gray-500'}`}
                                >
                                    {isCompleted ? <CheckCircleIcon className="w-4 h-4" /> : stepNumber}
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