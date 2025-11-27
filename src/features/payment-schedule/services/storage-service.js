/**
 * Сервис для работы с localStorage
 */

import { STORAGE_KEY, ERROR_MESSAGES } from '../../../shared/config/constants.js';

/**
 * Сервис для хранения графика платежей
 */
class StorageService {
  constructor(storageKey = STORAGE_KEY) {
    this.key = storageKey;
  }

  /**
   * Сохраняет график платежей
   */
  save(schedule) {
    if (!Array.isArray(schedule)) {
      throw new Error('Schedule must be an array');
    }

    try {
      const serialized = JSON.stringify(schedule);
      
      // Проверка квоты localStorage
      if (serialized.length > 5 * 1024 * 1024) {
        throw new Error('Schedule data exceeds localStorage quota');
      }

      localStorage.setItem(this.key, serialized);
      return true;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'QuotaExceededError') {
          console.error('LocalStorage quota exceeded');
        }
        throw new Error(`${ERROR_MESSAGES.STORAGE_ERROR}: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Читает график платежей
   */
  load() {
    try {
      const serialized = localStorage.getItem(this.key);
      
      if (!serialized) {
        return null;
      }

      const data = JSON.parse(serialized);

      // Валидация загруженных данных
      if (!Array.isArray(data)) {
        console.error('Invalid data format in localStorage');
        return null;
      }

      return data;
    } catch (error) {
      console.error('Ошибка при чтении из localStorage:', error);
      return null;
    }
  }

  /**
   * Удаляет график платежей
   */
  remove() {
    try {
      localStorage.removeItem(this.key);
      return true;
    } catch (error) {
      console.error('Ошибка при удалении из localStorage:', error);
      return false;
    }
  }

  /**
   * Проверяет наличие сохраненных данных
   */
  exists() {
    return localStorage.getItem(this.key) !== null;
  }

  /**
   * Очищает все данные приложения из localStorage
   */
  clearAll() {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith('paymentSchedule') || key.startsWith('creditParams')) {
        localStorage.removeItem(key);
      }
    });
  }
}

export const storageService = new StorageService();

