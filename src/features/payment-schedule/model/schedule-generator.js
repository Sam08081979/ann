/**
 * Генератор графика платежей
 */

import { calculateAnnuityPayment, calculateInterestRate } from './calculations.js';
import { calculatePaymentDates } from './period-calculator.js';
import { roundToTwo } from '../../../shared/lib/format.js';

/**
 * Генерирует детальный график платежей
 */
export function generatePaymentSchedule(params) {
  const {
    summCredit,
    procentYear,
    countPeriodOfYear,
    currentDate,
    periodCredit,
    calculationMode,
    skipWeekends,
  } = params;

  // Вычисление аннуитетного платежа
  const annuityPayment = calculateAnnuityPayment({
    summCredit,
    procentYear,
    countPeriodOfYear,
    periodCredit,
  });

  // Вычисление дат платежей
  const paymentDates = calculatePaymentDates({
    currentDate,
    periodCredit,
    countPeriodOfYear,
    skipWeekends,
  });

  // Генерация графика
  const paymentSchedule = [];
  let remainingDebt = summCredit;

  paymentDates.forEach((item, index) => {
    const { simple, exact } = calculateInterestRate(
      procentYear,
      countPeriodOfYear,
      item.countDaysWorking,
      item.paymentDateWorking
    );

    const monthlyRate = calculationMode === 'exact' ? exact : simple;

    const interestExact = remainingDebt * exact;
    const interestSimple = remainingDebt * simple;
    const interest = remainingDebt * monthlyRate;

    // Для последнего платежа основной долг = остаток
    const principal =
      index === paymentDates.length - 1
        ? remainingDebt
        : annuityPayment - interest;

    // Для последнего платежа сумма = проценты + остаток долга
    const actualPayment =
      index === paymentDates.length - 1 ? interest + principal : annuityPayment;

    paymentSchedule.push({
      paytDt: item.paymentDateRaw,
      payDtWk: item.paymentDateWorking,
      cPayDt: item.countDaysRaw,
      cPayDtWk: item.countDaysWorking,
      payAm: roundToTwo(actualPayment),
      principal: roundToTwo(principal),
      intExact: roundToTwo(interestExact),
      intSimple: roundToTwo(interestSimple),
      remDebt: roundToTwo(remainingDebt - principal),
    });

    remainingDebt -= principal;
  });

  return paymentSchedule;
}

