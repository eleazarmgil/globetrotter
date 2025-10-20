import { DestinationOption } from './destinationOption';

export interface BookingState {
    currentStep: number;
    formData: FormData;
    flightOptions: DestinationOption[];
}