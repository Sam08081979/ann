/**
 * Утилиты форматирования
 */

/**
 * Округляет число до 2 знаков после запятой
 */
export function roundToTwo(num) {
  return parseFloat(num.toFixed(2));
}

/**
 * Форматирует число как валюту (рубли)
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Форматирует процент
 */
export function formatPercent(value, decimals = 2) {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Форматирует число с разделителями тысяч
 */
export function formatNumber(num, decimals = 0) {
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

