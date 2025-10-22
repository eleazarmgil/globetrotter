/**
 * Calculates the age of a person in years based on their date of birth.
 *
 * @param dateOfBirth - The person's date of birth in a string format (e.g., 'YYYY-MM-DD').
 * @returns The calculated age as a string (e.g., '30 años') or 'N/A' if the date is invalid or empty.
 */
export const calculateAge = (dateOfBirth: string): string => {
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
