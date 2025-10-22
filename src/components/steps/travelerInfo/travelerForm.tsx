import React from 'react';
import { Traveler } from '@/types/booking'; 
import { CalendarDaysIcon } from 'lucide-react'; 

const DOCUMENT_OPTIONS = ['Cédula de Identidad', 'Pasaporte', 'Tarjeta de Residencia', 'Licencia de Conducir'];

interface TravelerFormProps {
    traveler: Traveler;
    index: number;
    handleTravelerChange: (id: string, key: keyof Traveler, value: string) => void;
}

/**
 * @component
 * @description A memoized form component for entering the details of a single traveler.
 * It handles fields like full name, date of birth, document type, and document number.
 * @param {TravelerFormProps} props - The component's props.
 * @param {Traveler} props.traveler - The traveler object whose data is being edited.
 * @param {number} props.index - The 0-based index of the traveler in the list.
 * @param {function(string, keyof Traveler, string): void} props.handleTravelerChange - Callback to update a specific field of the traveler.
 * @returns {JSX.Element} The Traveler Form component.
 */
const TravelerForm: React.FC<TravelerFormProps> = React.memo(({ 
    traveler, 
    index, 
    handleTravelerChange, 
}) => {
    
    TravelerForm.displayName = 'TravelerForm';
    const onFieldChange = (key: keyof Traveler, value: string) => {
        handleTravelerChange(traveler.id, key, value); 
    };

    const today = new Date().toISOString().split('T')[0];
    const isFieldInvalid = (value: string) => value.trim() === '';

    return (
        <div className="p-6 border border-gray-200 rounded-xl bg-blue-50/50"> 
            <h4 className="font-bold text-lg text-blue-600 mb-4">
                Pasajero {index + 1}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                
                <div>
                    <label htmlFor={`fullName-${traveler.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre
                    </label>
                    <input
                        type="text"
                        id={`fullName-${traveler.id}`}
                        required
                        value={traveler.fullName}
                        onChange={(e) => onFieldChange('fullName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm text-gray-800 ${
                            isFieldInvalid(traveler.fullName) ? 'border-red-400' : 'border-gray-300'
                        }`}
                        placeholder="" 
                    />
                </div>
                
                <div>
                    <label htmlFor={`dateOfBirth-${traveler.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de nacimiento
                    </label>
                    <div className="relative">
                        <input
                            type="date"
                            id={`dateOfBirth-${traveler.id}`}
                            required
                            max={today}
                            value={traveler.dateOfBirth}
                            onChange={(e) => onFieldChange('dateOfBirth', e.target.value)}
                            className={`w-full pr-3 pl-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm text-gray-800 ${
                                isFieldInvalid(traveler.dateOfBirth) ? 'border-red-400' : 'border-gray-300'
                            }`}
                            placeholder="MM / DD / YYYY"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor={`documentType-${traveler.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de documento
                    </label>
                    <select
                        id={`documentType-${traveler.id}`}
                        required
                        value={traveler.documentType}
                        onChange={(e) => onFieldChange('documentType', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 text-gray-800 focus:border-blue-500 sm:text-sm shadow-sm ${
                            isFieldInvalid(traveler.documentType) ? 'border-red-400' : 'border-gray-300'
                        }`}
                    >
                        <option value="" disabled className="text-gray-800">Seleccionar</option>
                        {DOCUMENT_OPTIONS.map(opt => (
                            <option className="text-gray-800" key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor={`documentNumber-${traveler.id}`} className="block text-sm font-medium text-gray-700 mb-1 ">
                        Número de documento
                    </label>
                    <input
                        type="text"
                        id={`documentNumber-${traveler.id}`}
                        required
                        value={traveler.documentNumber}
                        onChange={(e) => onFieldChange('documentNumber', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm text-gray-800 ${
                            isFieldInvalid(traveler.documentNumber) ? 'border-red-400' : 'border-gray-300'
                        }`}
                        placeholder="Número de documento"
                    />
                </div>
            </div>
        </div>
    );
});

export default TravelerForm;