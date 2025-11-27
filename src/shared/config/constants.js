/**
 * Константы приложения
 */

/** Ключ для localStorage */
export const STORAGE_KEY = 'paymentSchedule';

/** Список количества периодов в году */
export const COUNT_PERIODS_OF_YEAR = [12, 4, 2, 1];

/** Лейблы для периодов */
export const PERIOD_LABELS = {
  12: 'Ежемесячно',
  4: 'Ежеквартально',
  2: 'Раз в полгода',
  1: 'Ежегодно',
};

/** Минимальные и максимальные значения */
export const VALIDATION_LIMITS = {
  summCredit: {
    min: 1000,
    max: 100_000_000,
  },
  procentYear: {
    min: 0.1,
    max: 100,
  },
  periodCredit: {
    min: 0.1,
    max: 50,
  },
};

/** Форматы дат */
export const DATE_FORMAT = {
  display: 'dd.MM.yyyy',
  iso: 'yyyy-MM-dd',
  storage: 'yyyy-MM-dd',
};

/** Сообщения об ошибках */
export const ERROR_MESSAGES = {
  INVALID_PARAMS: 'Invalid credit parameters',
  INVALID_DATE: 'Invalid date format',
  INVALID_AMOUNT: 'Amount must be positive',
  STORAGE_ERROR: 'LocalStorage operation failed',
  CALCULATION_ERROR: 'Calculation error occurred',
};

