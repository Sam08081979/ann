/**
 * Утилиты валидации
 */

import { VALIDATION_LIMITS } from '../config/constants.js';

/**
 * Валидирует параметры кредита
 */
export function validateCreditParams(params) {
  const errors = [];

  // Проверка суммы кредита
  if (params.summCredit !== undefined) {
    if (params.summCredit < VALIDATION_LIMITS.summCredit.min) {
      errors.push({
        field: 'summCredit',
        message: `Сумма кредита должна быть не менее ${VALIDATION_LIMITS.summCredit.min} руб.`,
      });
    }
    if (params.summCredit > VALIDATION_LIMITS.summCredit.max) {
      errors.push({
        field: 'summCredit',
        message: `Сумма кредита должна быть не более ${VALIDATION_LIMITS.summCredit.max} руб.`,
      });
    }
  }

  // Проверка процентной ставки
  if (params.procentYear !== undefined) {
    if (params.procentYear < VALIDATION_LIMITS.procentYear.min) {
      errors.push({
        field: 'procentYear',
        message: `Процентная ставка должна быть не менее ${VALIDATION_LIMITS.procentYear.min}%`,
      });
    }
    if (params.procentYear > VALIDATION_LIMITS.procentYear.max) {
      errors.push({
        field: 'procentYear',
        message: `Процентная ставка должна быть не более ${VALIDATION_LIMITS.procentYear.max}%`,
      });
    }
  }

  // Проверка срока кредита
  if (params.periodCredit !== undefined) {
    if (params.periodCredit < VALIDATION_LIMITS.periodCredit.min) {
      errors.push({
        field: 'periodCredit',
        message: `Срок кредита должен быть не менее ${VALIDATION_LIMITS.periodCredit.min} лет`,
      });
    }
    if (params.periodCredit > VALIDATION_LIMITS.periodCredit.max) {
      errors.push({
        field: 'periodCredit',
        message: `Срок кредита должен быть не более ${VALIDATION_LIMITS.periodCredit.max} лет`,
      });
    }
  }

  // Проверка даты
  if (params.currentDate !== undefined) {
    const date = new Date(params.currentDate);
    if (isNaN(date.getTime())) {
      errors.push({
        field: 'currentDate',
        message: 'Некорректная дата',
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Проверяет, являются ли параметры полными
 */
export function isFullCreditParams(params) {
  return !!(
    params.summCredit &&
    params.procentYear &&
    params.periodCredit &&
    params.countPeriodOfYear &&
    params.currentDate &&
    params.skipWeekends &&
    params.calculationMode
  );
}

/**
 * Валидирует сумму досрочного погашения
 */
export function validateEarlyRepaymentAmount(amount, remainingDebt) {
  const errors = [];

  if (amount <= 0) {
    errors.push({
      field: 'amount',
      message: 'Сумма должна быть положительной',
    });
  }

  if (amount > remainingDebt) {
    errors.push({
      field: 'amount',
      message: 'Сумма не может превышать остаток долга',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

