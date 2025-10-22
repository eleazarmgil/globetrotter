/**
 * @function formatCurrency
 * @description Formats a number into a currency string in USD.
 * @param amount - The numerical amount to be formatted.
 * @returns The formatted currency string (e.g., "$1,234.56").
 */
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(amount);
};
