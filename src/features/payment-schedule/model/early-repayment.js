/**
 * Логика досрочного погашения кредита
 */

import {
  calculateAnnuityPayment,
  calculateInterestRate,
} from "./calculations.js";
import { roundToTwo } from "../../../shared/lib/format.js";

/**
 * Применяет досрочное погашение с сокращением срока
 */
export function applyEarlyRepaymentReduceTerm(params) {
  const { schedule, repaymentDate, amount, creditParams } = params;

  // Находим период, с которого начинается досрочное погашение
  const idx = schedule.findIndex(
    (p) => new Date(p.payDtWk) >= new Date(repaymentDate)
  );

  // Если досрочное погашение не найдено, возвращаем исходный график
  if (idx === -1) {
    return schedule;
  }

  // Создаем новый график платежей до момента досрочного погашения
  const newSchedule = [...schedule.slice(0, idx)];

  // Остаток долга на момент досрочного погашения
  let remainingDebt =
    idx > 0 ? schedule[idx - 1].remDebt : creditParams.summCredit;

  // Вычитаем сумму досрочного погашения из остатка долга
  remainingDebt -= amount;

  // Если долг полностью погашен
  if (remainingDebt <= 0) {
    return newSchedule;
  }

  // Фиксируем сумму текущего платежа (аннуитет)
  // Используем платеж из текущего периода как целевой для сохранения размера выплат
  const targetPayment = schedule[idx].payAm;

  // Пересчет платежей с сохранением суммы платежа (сокращение срока)
  // Используем даты из исходного графика
  for (let i = idx; i < schedule.length; i++) {
    const { simple, exact } = calculateInterestRate(
      creditParams.procentYear,
      creditParams.countPeriodOfYear,
      schedule[i].cPayDtWk,
      schedule[i].payDtWk
    );

    const monthlyRate =
      creditParams.calculationMode === "exact" ? exact : simple;

    const interestExact = remainingDebt * exact;
    const interestSimple = remainingDebt * simple;
    const interest = remainingDebt * monthlyRate;

    // Вычисляем основной долг
    let principal = targetPayment - interest;
    let actualPayment = targetPayment;

    // Если остаток долга меньше планового погашения основного долга
    // (или это последний платеж в исходном графике, хотя при сокращении срока мы обычно заканчиваем раньше)
    if (remainingDebt - principal <= 0.01) {
      principal = remainingDebt;
      actualPayment = interest + principal;

      newSchedule.push({
        ...schedule[i],
        payAm: roundToTwo(actualPayment),
        principal: roundToTwo(principal),
        intExact: roundToTwo(interestExact),
        intSimple: roundToTwo(interestSimple),
        remDebt: 0,
      });

      // График закончен
      break;
    }

    newSchedule.push({
      ...schedule[i],
      payAm: roundToTwo(actualPayment),
      principal: roundToTwo(principal),
      intExact: roundToTwo(interestExact),
      intSimple: roundToTwo(interestSimple),
      remDebt: roundToTwo(remainingDebt - principal),
    });

    remainingDebt -= principal;
  }

  return newSchedule;
}

/**
 * Применяет досрочное погашение с сокращением платежа
 */
export function applyEarlyRepaymentReducePayment(params) {
  const { schedule, repaymentDate, amount, creditParams } = params;

  // Находим период, с которого начинается досрочное погашение
  const idx = schedule.findIndex(
    (p) => new Date(p.payDtWk) >= new Date(repaymentDate)
  );

  // Если досрочное погашение не найдено, возвращаем исходный график
  if (idx === -1) {
    return schedule;
  }

  // Создаем новый график платежей без досрочного погашения
  const newSchedule = [...schedule.slice(0, idx)];

  // Остаток долга на момент досрочного погашения
  let remainingDebt =
    idx > 0 ? schedule[idx - 1].remDebt : creditParams.summCredit;
  // Вычитаем сумму досрочного погашения из остатка долга
  remainingDebt -= amount;
  // Количество оставшихся периодов
  const periodsLeft = schedule.length - idx;

  // Пересчет аннуитета с новым остатком, но тем же сроком
  const newAnnuity = calculateAnnuityPayment({
    summCredit: remainingDebt,
    procentYear: creditParams.procentYear,
    countPeriodOfYear: creditParams.countPeriodOfYear,
    periodCredit: periodsLeft / creditParams.countPeriodOfYear,
  });

  for (let i = idx; i < schedule.length; i++) {
    const { simple, exact } = calculateInterestRate(
      creditParams.procentYear,
      creditParams.countPeriodOfYear,
      schedule[i].cPayDtWk,
      schedule[i].payDtWk
    );

    const monthlyRate =
      creditParams.calculationMode === "exact" ? exact : simple;

    const interestExact = remainingDebt * exact;
    const interestSimple = remainingDebt * simple;
    const interest = remainingDebt * monthlyRate;

    const principal =
      i === schedule.length - 1 ? remainingDebt : newAnnuity - interest;

    const actualPayment =
      i === schedule.length - 1 ? interest + principal : newAnnuity;

    newSchedule.push({
      ...schedule[i],
      payAm: roundToTwo(actualPayment),
      principal: roundToTwo(principal),
      intExact: roundToTwo(interestExact),
      intSimple: roundToTwo(interestSimple),
      remDebt: roundToTwo(remainingDebt - principal),
    });

    remainingDebt -= principal;
  }

  return newSchedule;
}
