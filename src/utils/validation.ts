import { BookingFormData } from '../types/booking';

/**
 * Validates the data for a specific step of the booking form.
 *
 * This function checks for required fields and logical constraints (like date order)
 * based on the current step number.
 *
 * @param step - The current step number (1, 2, 3, or 4) to validate.
 * @param formData - The complete booking form data object.
 * @returns {boolean} True if the current step's data is valid, false otherwise.
 */
export const validateStep = (step: number, formData: BookingFormData): boolean => {
    const { trip, travelers, services } = formData;

    switch (step) {
        case 1: 
            if (!trip.destination || !trip.departureDate || !trip.returnDate || !trip.flightClass) {
                return false;
            }
            
            const departure = new Date(trip.departureDate);
            const returning = new Date(trip.returnDate);
            return !isNaN(departure.getTime()) && 
                   !isNaN(returning.getTime()) &&
                   departure.getTime() <= returning.getTime();
        case 2:
            return travelers.length > 0 && 
                   travelers.every(t => 
                       t.fullName?.trim() && 
                       t.dateOfBirth?.trim() &&
                       t.documentType?.trim() && 
                       t.documentNumber?.trim()
                   );
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