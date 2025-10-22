import { useBookingFlow } from '../../hooks/useBookingFlow';

type UseBookingFormReturn = ReturnType<typeof useBookingFlow>;

export type StepProps = UseBookingFormReturn;