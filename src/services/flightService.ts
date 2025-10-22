import { DestinationOption } from '@/types/booking';

const FLIGHTS_API_URL = 'https://raw.githubusercontent.com/Lstanislao/cities-permalink/main/flights.json';

/**
 * @function fetchFlightOptions
 * @description Fetches the list of available destination and flight options from a public API endpoint.
 * Handles API errors and returns an empty array on failure.
 * @async
 * @returns {Promise<DestinationOption[]>} A promise that resolves to an array of flight options.
 */
export const fetchFlightOptions = async (): Promise<DestinationOption[]> => {
    try {
        const response = await fetch(FLIGHTS_API_URL); 
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const data: DestinationOption[] = await response.json();
        return data;

    } catch (error) {
        console.error("Error loading flight options:", error);
        return []; 
    }
};
