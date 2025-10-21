import { DestinationOption } from './destinationOption';
import { BookingFormData } from './bookingFormData';

export interface BookingState {
    currentStep: number;
    bookingFormData: BookingFormData;
    flightOptions: DestinationOption[];
}