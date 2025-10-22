import React, { FC } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

interface StepNavigationProps {
  prevStep?: () => void;
  nextStep?: () => void;
  handleSubmit?: () => void;
  canProceed: boolean;
  isLastStep: boolean;
}

export const StepNavigation: FC<StepNavigationProps> = ({ 
  prevStep, 
  nextStep, 
  handleSubmit, 
  canProceed, 
  isLastStep,
}) => {
  return (
    <div className="flex justify-between">
      {prevStep && (
        <button
          onClick={prevStep}
          className="inline-flex items-center px-6 py-2 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-100 transition shadow-sm"
        >
          <ChevronLeftIcon className="w-5 h-5 mr-2" />
          Anterior
        </button>
      )}
      
      {!prevStep && <div></div>} 

      <button
        onClick={isLastStep ? handleSubmit : nextStep}
        disabled={!canProceed}
        className={`inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-lg shadow-md text-white transition ease-in-out duration-150 ${
          canProceed 
            ? (isLastStep ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700')
            : 'bg-gray-400 disabled:cursor-not-allowed'
        }`}
      >
        {isLastStep ? 'Confirmar Reserva' : 'Siguiente'}
        <ChevronRightIcon className="w-5 h-5 ml-2" />
      </button>
    </div>
  );
};