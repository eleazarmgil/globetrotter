import React, { FC } from 'react';
import { CheckCircleIcon, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export const ConfirmationModal: FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full relative transform transition-all duration-300 scale-100 opacity-100">
        
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
          aria-label="Cerrar confirmación"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4 animate-bounce-once" />
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
          <p className="text-gray-600 text-center">{message}</p>

          <button
            onClick={onClose}
            className="mt-6 w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-md"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};