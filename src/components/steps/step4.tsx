import React, { useMemo } from 'react';
import { CheckCircleIcon, DollarSignIcon, PackageIcon, UsersIcon, ShieldIcon, TicketIcon, ChevronLeftIcon } from 'lucide-react';
import { BookingFormData, DestinationOption } from '@/types/booking'; 
import { calculateTotalCost, CostSummary } from '@/utils/calculateTotalCost'; 

interface StepProps {
    bookingFormData: BookingFormData;
    flightOptions: DestinationOption[];
    updateFormData: <K extends keyof BookingFormData>(key: K, value: BookingFormData[K]) => void;
    handleSubmit: () => void;
    prevStep: () => void;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(amount);
};

const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age >= 0 ? `${age} años` : 'N/A';
};

const DetailItem: React.FC<{ label: string, value: string, icon: React.ReactNode, isSubtotal?: boolean }> = ({ label, value, icon, isSubtotal = false }) => (
    <div className={`flex justify-between items-center py-3 ${isSubtotal ? 'border-t border-dashed border-gray-300 font-semibold' : 'text-gray-700'}`}>
        <span className="flex items-center text-sm">
            {icon}
            <span className="ml-2">{label}</span>
        </span>
        <span className={isSubtotal ? 'text-lg text-blue-800' : 'text-sm'}>{value}</span>
    </div>
);

export const Step4: React.FC<StepProps> = ({ 
    bookingFormData, 
    flightOptions, 
    handleSubmit,
    prevStep 
}) => {
    
    const costSummary: CostSummary = useMemo(() => {
        if (typeof calculateTotalCost !== 'function') {
             return { baseFlight: 500, pets: 100, luggage: 50, insurance: 0, total: 650 } as CostSummary;
        }
        return calculateTotalCost(bookingFormData, flightOptions);
    }, [bookingFormData, flightOptions]);

    const { trip, travelers, services } = bookingFormData;

    const isReadyToPay = travelers.length > 0 && trip.destination && trip.departureDate;
    
    const travelerCount = travelers.length;

    return (
        <section className="space-y-8 p-6 md:p-8 bg-white rounded-xl shadow-lg">
            
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Resumen de la Reserva
            </h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                <div className="lg:col-span-2 space-y-8">
                    
                    <div className="p-6 bg-white rounded-xl shadow-lg border border-blue-100">
                        <h4 className="text-xl font-bold text-blue-700 mb-4 flex items-center border-b pb-2">
                            <TicketIcon className="w-5 h-5 mr-2"/>
                            Detalles del Viaje
                        </h4>
                        <div className="space-y-3 p-4 border-l-4 border-indigo-400 bg-indigo-50 rounded-r-lg">
                            <p className="text-lg font-bold text-indigo-800">
                                Destino: {trip.destination || 'Pendiente'} - Clase: {trip.flightClass || 'Pendiente'}
                            </p>
                            <p className="text-sm text-gray-600">
                                Ida: {trip.departureDate || 'N/A'} | Regreso: {trip.returnDate || 'N/A'}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center">
                                <UsersIcon className="w-4 h-4 mr-1"/>
                                Total Viajeros: {travelerCount}
                            </p>
                        </div>
                    </div>

                    <div className="p-6 bg-white rounded-xl shadow-lg border border-blue-100">
                        <h4 className="text-xl font-bold text-blue-700 mb-4 flex items-center border-b pb-2">
                            <UsersIcon className="w-5 h-5 mr-2"/>
                            Información de Pasajeros
                        </h4>
                        <ul className="space-y-3">
                            {travelers.map((t, index) => (
                                <li key={t.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center border border-gray-200">
                                    <span className="font-medium text-gray-700">
                                        {index + 1}. {t.fullName || `Pasajero ${index + 1}`}
                                    </span>
                                    <span className="text-sm text-blue-600 font-semibold">
                                        {t.dateOfBirth ? calculateAge(t.dateOfBirth) : 'Edad N/A'}
                                    </span>
                                </li>
                            ))}
                            {travelerCount === 0 && (
                                <li className="text-gray-500 italic p-3">No se han agregado pasajeros.</li>
                            )}
                        </ul>
                    </div>

                    <div className="p-6 bg-white rounded-xl shadow-lg border border-blue-100">
                        <h4 className="text-xl font-bold text-blue-700 mb-4 flex items-center border-b pb-2">
                            <ShieldIcon className="w-5 h-5 mr-2"/>
                            Servicios Adicionales
                        </h4>
                        <ul className="space-y-1 text-sm text-gray-700">
                            {services.addInsurance && (
                                <li className="flex items-center"><CheckCircleIcon className="w-4 h-4 mr-2 text-green-500"/> Seguro de Viaje</li>
                            )}
                            {services.selectSeats && (
                                <li className="flex items-center"><CheckCircleIcon className="w-4 h-4 mr-2 text-green-500"/> Selección de Asientos</li>
                            )}
                            {(services.travelsWithPets && services.petCount) ? (
                                <li className="flex items-center"><CheckCircleIcon className="w-4 h-4 mr-2 text-green-500"/> {services.petCount} Mascota(s)</li>
                            ) : null}
                            {(services.needsExtraLuggage && services.extraLuggageCount) ? (
                                <li className="flex items-center"><CheckCircleIcon className="w-4 h-4 mr-2 text-green-500"/> {services.extraLuggageCount} Maleta(s) Extra</li>
                            ) : null}
                            {services.requiresSpecialAssistance && (
                                <li className="flex items-center"><CheckCircleIcon className="w-4 h-4 mr-2 text-green-500"/> Asistencia Especial ({services.assistanceNotes || 'Sin notas'})</li>
                            )}
                            {(!services.addInsurance && !services.selectSeats && !services.travelsWithPets && !services.needsExtraLuggage && !services.requiresSpecialAssistance) && (
                                <li className="text-gray-500 italic">No se han seleccionado servicios adicionales.</li>
                            )}
                        </ul>
                    </div>
                </div>

                <div className="lg:col-span-1 p-6 bg-blue-50 rounded-xl shadow-2xl border-4 border-blue-200 h-fit space-y-4">
                    <h4 className="text-xl font-bold text-blue-700 mb-4 flex items-center border-b pb-3">
                        <DollarSignIcon className="w-5 h-5 mr-2"/>
                        Costo
                    </h4>
                    
                    <div className="space-y-1">
                        <DetailItem 
                            label={`Vuelos (${travelerCount})`} 
                            value={formatCurrency(costSummary.baseFlight)} 
                            icon={<UsersIcon className="w-4 h-4 text-indigo-500"/>}
                        />

                        {costSummary.pets > 0 && (
                            <DetailItem 
                                label="Costo por Mascotas" 
                                value={formatCurrency(costSummary.pets)} 
                                icon={<PackageIcon className="w-4 h-4 text-pink-500"/>}
                            />
                        )}
                        
                        {costSummary.luggage > 0 && (
                            <DetailItem 
                                label="Costo por Equipaje Extra" 
                                value={formatCurrency(costSummary.luggage)} 
                                icon={<PackageIcon className="w-4 h-4 text-orange-500"/>}
                            />
                        )}
                    </div>
                    
                    <div className="pt-6 border-t-2 border-blue-300">
                        <div className="flex justify-between items-center flex-col items-start space-y-2">
                            <span className="text-xl font-bold text-blue-900">Total a Pagar:</span>
                            <span className="text-3xl font-extrabold text-blue-900">{formatCurrency(costSummary.total)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-gray-200 mt-8">
                <button
                    onClick={prevStep}
                    className="inline-flex items-center px-6 py-2 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-100 transition ease-in-out duration-150 shadow-sm"
                >
                    <ChevronLeftIcon className="w-5 h-5 mr-2" />
                    Volver
                </button>

                <button
                    onClick={handleSubmit}
                    disabled={!isReadyToPay}
                    className={`w-auto py-3 px-8 rounded-xl text-white font-bold text-lg transition duration-300 transform hover:scale-[1.02] active:scale-100 shadow-lg ${isReadyToPay ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
                >
                    Confirmar Reserva
                </button>
            </div>
        </section>
    );
};
