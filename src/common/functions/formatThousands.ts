/**
 * Formats a number with commas as thousands separators (e.g. 1000 -> "1,000", 29748 -> "29,748").
 * Safely handles null, undefined, string numbers, and numbers with decimals.
 * 
 * @param {number | string | null | undefined} value - The number to format
 * @param {Intl.NumberFormatOptions} [options] - Optional Intl.NumberFormat options
 * @returns {string} Formatted number string with comma thousands separators
 */
export function formatThousands(
  value: number | string | null | undefined,
  options?: Intl.NumberFormatOptions
): string {
  if (value === null || value === undefined || value === '') return '0';
  const num = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(num)) return String(value);

  return new Intl.NumberFormat('en-US', options).format(num);
}

/**
 * Formats a currency amount with comma thousands separators and 2 decimal places (e.g. 1500 -> "1,500.00").
 * 
 * @param {number | string | null | undefined} value - The currency amount
 * @param {string} [currencySymbol] - Optional currency symbol prefix (e.g. "$", "£", "₦")
 * @returns {string} Formatted currency string
 */
export function formatCurrency(
  value: number | string | null | undefined,
  currencySymbol: string = ''
): string {
  const formatted = formatThousands(value, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return currencySymbol ? `${currencySymbol}${formatted}` : formatted;
}

export default formatThousands;
