/**
 * Утилиты хеширования и генерации ID
 */

/**
 * Вычисляет простой хеш объекта (djb2)
 */
export function hashObject(obj) {
  const str = JSON.stringify(obj);
  let hash = 5381;

  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }

  return hash >>> 0;
}

/**
 * Генерирует GUID (UUID v4)
 */
export function generateGUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    })
    .toUpperCase();
}

/**
 * Генерирует короткий ID
 */
export function generateShortId() {
  return Math.random().toString(36).substring(2, 9);
}

