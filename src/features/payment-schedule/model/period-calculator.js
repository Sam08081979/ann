/**
 * Расчет дат платежей
 */

import { getWorkingDate, formatDateLocal, getDaysBetween, parseDate } from '../../../shared/lib/date.js';

/**
 * Вычисляет даты платежей и количество дней между ними
 */
export function calculatePaymentDates(params) {
  const { currentDate, periodCredit, countPeriodOfYear, skipWeekends } = params;

  const startDate = parseDate(currentDate);
  const countOfPeriod = periodCredit * countPeriodOfYear;
  const originalDay = startDate.getDate();
  const monthsPerPeriod = 12 / countPeriodOfYear;

  let previousRawDate = new Date(startDate);
  let previousWorkingDate = skipWeekends === 'Y' 
    ? getWorkingDate(new Date(startDate)) 
    : new Date(startDate);
  const results = [];

  for (let period = 0; period < countOfPeriod; period++) {
    const newDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + (period + 1) * monthsPerPeriod,
      1
    );

    const lastDayOfMonth = new Date(
      newDate.getFullYear(),
      newDate.getMonth() + 1,
      0
    ).getDate();

    // Если исходный день больше последнего дня месяца, устанавливаем последний день месяца
    if (originalDay > lastDayOfMonth) {
      newDate.setDate(lastDayOfMonth);
    } else {
      newDate.setDate(originalDay);
    }

    const rawDate = new Date(newDate);
    const workingDate = skipWeekends === 'Y' 
      ? getWorkingDate(newDate) 
      : new Date(newDate);

    const rawDays = getDaysBetween(previousRawDate, rawDate);
    const workingDays = getDaysBetween(previousWorkingDate, workingDate);

    results.push({
      paymentDateRaw: formatDateLocal(rawDate),
      paymentDateWorking: formatDateLocal(workingDate),
      countDaysRaw: rawDays,
      countDaysWorking: workingDays,
    });

    previousRawDate = new Date(rawDate);
    previousWorkingDate = new Date(workingDate);
  }

  return results;
}

