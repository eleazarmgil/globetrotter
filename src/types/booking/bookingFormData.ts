import {AdditionalService} from './additionalService';
import { Traveler } from './traveler';
import { TripInfo } from './tripInfo';

export interface BookingFormData {
    trip: TripInfo;
    travelers: Traveler[];
    services: AdditionalService;
}