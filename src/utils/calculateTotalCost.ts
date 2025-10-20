import { FormData, DestinationOption } from '@/types/booking';

const COST_PER_PET = 100;
const COST_PER_EXTRA_LUGGAGE = 50;

export interface CostSummary {
    baseFlight: number;
    travelerSubtotal: number;
    pets: number;
    luggage: number;
    total: number;
}

/**
 * Calculates the total cost of the reservation based on the form data.
 * @param formData - The complete form data.
 * @param flightOptions - Loaded destination/price options.
 * @returns A detailed summary of the total cost.
 */
export const calculateTotalCost = (
    formData: FormData, 
    flightOptions: DestinationOption[]
): CostSummary => {
    const { trip, travelers, services } = formData;
    const travelerCount = travelers.length;
    const selectedFlight = flightOptions.find(opt => opt.name === trip.destination);
    
    let baseFlightPrice = 0;
    if (selectedFlight && trip.flightClass) {
        const pricePerTraveler = selectedFlight.prices[trip.flightClass];
        baseFlightPrice = pricePerTraveler * travelerCount;
    }

    const petCost = services.travelsWithPets 
        ? (services.petCount||0) * COST_PER_PET 
        : 0;

    const luggageCost = services.needsExtraLuggage
        ? (services.extraLuggageCount||0) * COST_PER_EXTRA_LUGGAGE
        : 0;

    const servicesTotal = petCost + luggageCost;
    const total = baseFlightPrice + servicesTotal;

    return {
        baseFlight: baseFlightPrice,
        travelerSubtotal: baseFlightPrice, 
        pets: petCost,
        luggage: luggageCost,
        total: total,
    };
};