import { parseFee } from './programmeData';

/**
 * coursePricing — unified pricing lookup that works with both the
 * existing course catalog (fees as a string like "KES 12,500") and
 * the new catalogV3 structure (feesUSD number + isFree boolean).
 *
 * Returns { amount, currency, isFree, displayFee }.
 */
export function getCoursePrice(course) {
  if (!course) return { amount: 0, currency: 'KES', isFree: true, displayFee: 'Free' };

  // catalogV3 structure: numeric feesUSD + isFree flag
  if (typeof course.feesUSD === 'number') {
    if (course.isFree || course.feesUSD === 0) {
      return { amount: 0, currency: 'USD', isFree: true, displayFee: 'Free' };
    }
    return {
      amount: course.feesUSD,
      currency: 'USD',
      isFree: false,
      displayFee: `USD ${course.feesUSD}`,
    };
  }

  // Existing structure: fees as a string like "KES 12,500" or "Free"
  const feesStr = String(course.fees || '');
  if (feesStr.toLowerCase() === 'free' || feesStr === '') {
    return { amount: 0, currency: 'KES', isFree: true, displayFee: 'Free' };
  }

  const amount = parseFee(course.fees);
  const currency = feesStr.includes('USD') || feesStr.includes('$') ? 'USD' : 'KES';

  if (amount === 0) {
    return { amount: 0, currency, isFree: true, displayFee: 'Free' };
  }

  return { amount, currency, isFree: false, displayFee: feesStr };
}
