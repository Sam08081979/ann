/**
 * Утилиты для работы с датами
 */

import { format as formatDateFns, parseISO } from 'date-fns';
import { DATE_FORMAT } from '../config/constants.js';

/**
 * Проверяет, является ли год високосным
 */
export function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Возвращает количество дней в году
 */
export function getDaysInYear(year) {
  return isLeapYear(year) ? 366 : 365;
}

/**
 * Проверяет, является ли день выходным
 */
export function isWeekend(date) {
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6;
}

/**
 * Возвращает ближайший рабочий день (сдвигает вперед, если выходной)
 */
export function getWorkingDate(date) {
  const workingDate = new Date(date);
  while (isWeekend(workingDate)) {
    workingDate.setDate(workingDate.getDate() + 1);
  }
  return workingDate;
}

/**
 * Форматирует дату в формат YYYY-MM-DD
 */
export function formatDateLocal(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Форматирует дату для отображения
 */
export function formatDateDisplay(date) {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDateFns(dateObj, DATE_FORMAT.display);
}

/**
 * Парсит дату из строки или возвращает объект Date
 */
export function parseDate(date) {
  if (date instanceof Date) {
    return date;
  }
  return new Date(date);
}

/**
 * Вычисляет количество дней между датами
 */
export function getDaysBetween(from, to) {
  return Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

