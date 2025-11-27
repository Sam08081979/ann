/**
 * Сервис для работы с графиком платежей
 */

import { generatePaymentSchedule } from "../model/schedule-generator.js";
import {
  applyEarlyRepaymentReduceTerm,
  applyEarlyRepaymentReducePayment,
} from "../model/early-repayment.js";
import { validateCreditParams } from "../../../shared/lib/validation.js";
import { ERROR_MESSAGES } from "../../../shared/config/constants.js";

/**
 * Сервис для операций с графиком платежей
 */
class ScheduleService {
  /**
   * Генерирует график платежей с валидацией
   */
  generate(params) {
    const validation = validateCreditParams(params);

    if (!validation.isValid) {
      const errors = validation.errors.map((e) => e.message).join("; ");
      throw new Error(`${ERROR_MESSAGES.INVALID_PARAMS}: ${errors}`);
    }

    return generatePaymentSchedule(params);
  }

  /**
   * Применяет досрочное погашение (сокращение срока)
   */
  applyEarlyRepaymentReduceTerm(params) {
    return applyEarlyRepaymentReduceTerm(params);
  }

  /**
   * Применяет досрочное погашение (сокращение платежа)
   */
  applyEarlyRepaymentReducePayment(params) {
    return applyEarlyRepaymentReducePayment(params);
  }

  /**
   * Генерирует график с применением множественных досрочных погашений
   * @param {Object} params
   * @param {Array} params.baseSchedule - базовый график платежей
   * @param {Array} params.earlyRepayments - массив событий ДП [{date, amount, type}]
   * @param {Object} params.creditParams - параметры кредита
   * @returns {Array} график с учетом всех ДП
   */
  generateWithEarlyRepayments(params) {
    const { baseSchedule, earlyRepayments, creditParams } = params;

    if (!earlyRepayments.length) {
      return baseSchedule;
    }

    let currentSchedule = baseSchedule;

    // Применяем события последовательно в хронологическом порядке
    for (const repayment of earlyRepayments) {
      const applyFunc =
        repayment.type === "reduceTerm"
          ? applyEarlyRepaymentReduceTerm
          : applyEarlyRepaymentReducePayment;

      currentSchedule = applyFunc({
        schedule: currentSchedule,
        repaymentDate: repayment.date,
        amount: repayment.amount,
        creditParams,
      });
    }

    return currentSchedule;
  }

  /**
   * Вычисляет итоговую информацию по графику
   */
  calculateSummary(schedule) {
    if (!schedule.length) {
      return {
        totalPayments: 0,
        totalInterest: 0,
        totalPrincipal: 0,
        overpayment: 0,
        overpaymentPercent: 0,
      };
    }

    const totalPayments = schedule.reduce((sum, item) => sum + item.payAm, 0);
    const totalPrincipal = schedule.reduce(
      (sum, item) => sum + item.principal,
      0
    );
    const totalInterest = totalPayments - totalPrincipal;
    const overpayment = totalInterest;
    const overpaymentPercent = (overpayment / totalPrincipal) * 100;

    return {
      totalPayments,
      totalInterest,
      totalPrincipal,
      overpayment,
      overpaymentPercent,
    };
  }
}

export const scheduleService = new ScheduleService();
