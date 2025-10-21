import { BookingFormData } from '../types/booking';

export const validateStep = (step: number, formData: BookingFormData): boolean => {
    const { trip, travelers, services } = formData;

    switch (step) {
        case 1: 
            return !!trip.destination && !!trip.departureDate && !!trip.returnDate && trip.departureDate <= trip.returnDate;
        case 2:
            return travelers.length > 0 && 
                   travelers.every(t => t.fullName?.trim() && t.documentNumber?.trim());
        case 3:
            if (services.travelsWithPets && (!services.petCount || services.petCount < 1)) return false;
            if (services.needsExtraLuggage && (!services.extraLuggageCount || services.extraLuggageCount < 1)) return false;
            return true;
        case 4:
            return true;
        default:
            return false;
    }
};