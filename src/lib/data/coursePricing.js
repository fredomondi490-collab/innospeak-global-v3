import { parseFee } from './programmeData';

/**
 * coursePricing — unified pricing lookup for both catalog formats.
 *
 * Existing courses: fees string like "KES 12,500" or "Free".
 * V3 courses: feesUSD number + isFree boolean + optional certificatePriceUSD.
 *
 * Returns { amount, currency, isFree, displayFee, certificatePriceUSD }.
 */
export function getCoursePrice(course) {
  if (!course) return { amount: 0, currency: 'KES', isFree: true, displayFee: 'Free', certificatePriceUSD: 0 };

  const certPrice = course.certificatePriceUSD || 0;

  // V3 structure: numeric feesUSD + isFree flag
  if (typeof course.feesUSD === 'number') {
    if (course.isFree || course.feesUSD === 0) {
      return { amount: 0, currency: 'USD', isFree: true, displayFee: 'Free', certificatePriceUSD: certPrice };
    }
    return {
      amount: course.feesUSD,
      currency: 'USD',
      isFree: false,
      displayFee: `USD ${course.feesUSD}`,
      certificatePriceUSD: certPrice,
    };
  }

  // Existing structure: fees as a string like "KES 12,500" or "Free"
  const feesStr = String(course.fees || '');
  if (feesStr.toLowerCase() === 'free' || feesStr === '') {
    return { amount: 0, currency: 'KES', isFree: true, displayFee: 'Free', certificatePriceUSD: certPrice };
  }

  const amount = parseFee(course.fees);
  const currency = feesStr.includes('USD') || feesStr.includes('$') ? 'USD' : 'KES';

  if (amount === 0) {
    return { amount: 0, currency, isFree: true, displayFee: 'Free', certificatePriceUSD: certPrice };
  }

  return { amount, currency, isFree: false, displayFee: feesStr, certificatePriceUSD: certPrice };
}
