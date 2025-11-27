/**
 * Расчеты для кредитного калькулятора
 */

import { getDaysInYear, parseDate } from '../../../shared/lib/date.js';
import { roundToTwo } from '../../../shared/lib/format.js';

/**
 * Вычисляет аннуитетный платеж
 */
export function calculateAnnuityPayment(params) {
  const { summCredit, procentYear, countPeriodOfYear, periodCredit } = params;

  const totalPeriods = periodCredit * countPeriodOfYear;
  const periodRate = procentYear / countPeriodOfYear / 100;

  const payment =
    (summCredit * (periodRate * Math.pow(1 + periodRate, totalPeriods))) /
    (Math.pow(1 + periodRate, totalPeriods) - 1);

  return roundToTwo(payment);
}

/**
 * Вычисляет упрощенную месячную ставку
 */
function calculateMonthlyRateSimple(procentYear, countPeriodOfYear) {
  return procentYear / countPeriodOfYear / 100;
}

/**
 * Вычисляет точную процентную ставку с учетом количества дней
 */
function calculateMonthlyRateExact(prcYear, countDays, paymentDate) {
  const date = parseDate(paymentDate);

  if (isNaN(date.getTime())) {
    throw new Error(`Неверный формат даты: ${paymentDate}`);
  }

  const year = date.getFullYear();
  const daysInYear = getDaysInYear(year);

  return (prcYear * countDays) / (daysInYear * 100);
}

/**
 * Вычисляет процентную ставку (простую и точную)
 */
export function calculateInterestRate(procentYear, countPeriodOfYear, countDays, paymentDate) {
  const simple = calculateMonthlyRateSimple(procentYear, countPeriodOfYear);
  const exact = calculateMonthlyRateExact(procentYear, countDays, paymentDate);

  return { simple, exact };
}

