/** Minor units (kobo) -> display. The exponent comes from the currency itself (NGN/USD: 2, JPY: 0). */
export function formatMinor(
  minor: number,
  currency: string,
  locale = 'en'
): string {
  try {
    const fmt = new Intl.NumberFormat(locale, { style: 'currency', currency });
    const digits = fmt.resolvedOptions().maximumFractionDigits ?? 2;
    const text = fmt.format(minor / 10 ** digits);
    return currency === 'NGN'
      ? text.replace('NGN', '₦').replace(/\u00a0/g, '')
      : text;
  } catch {
    return `${(minor / 100).toFixed(2)} ${currency}`;
  }
}

export function priceRange(
  min: number | null,
  max: number | null,
  currency: string,
  locale?: string
): string {
  if (min === null) return '';
  if (max === null || max === min) return formatMinor(min, currency, locale);
  return `${formatMinor(min, currency, locale)} – ${formatMinor(max, currency, locale)}`;
}
