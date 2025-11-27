/**
 * Zustand store для управления состоянием кредитных параметров
 */

// Используется create из библиотеки zustand для создания store
// Используется devtools из библиотеки zustand/middleware для отладки
// Используется persist из библиотеки zustand/middleware для сохранения состояния в localStorage
// Используется scheduleService из файла services/index.js для генерации графика платежей

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { scheduleService } from "../../payment-schedule/services/index.js";

const DEFAULT_DATE = new Date().toISOString();

const defaultState = {
  summCredit: 1_000_000,
  procentYear: 25,
  periodCredit: 1,
  countPeriodOfYear: 12,
  currentDate: DEFAULT_DATE,
  skipWeekends: "Y",
  calculationMode: "exact",
  earlyRepayments: [],
};

/**
 * Store для работы с кредитом
 */

/**
 * Использование функции create из библиотеки zustand:
 *
 * create - это функция для создания кастомного хранилища состояния (store) в React-приложениях.
 * Она принимает функцию с аргументами (set, get, api), где:
 *   - set — функция для изменения состояния,
 *   - get — функция для получения актуального состояния,
 *   - api — объект для расширенного управления store.
 *
 * Пример базовой структуры:
 *   const useStore = create((set, get) => ({
 *     ...начальное состояние,
 *     методИзменения: (payload) => set({ поле: payload }),
 *   }))
 *
 * В этом файле create используется совместно с middleware:
 *   - devtools — для интеграции с Redux DevTools,
 *   - persist — для сохранения состояния в localStorage.
 * Полная обертка выглядит так:
 *   export const useCreditStore = create(
 *     devtools(
 *       persist(
 *         (set, get) => ({ ... }),
 *         { name: "название-хранилища" }
 *       )
 *     )
 *   );
 *
 * Таким образом, create позволяет инициализировать store, определять его состояние и методы, а также легко интегрироваться с инструментами для удобной отладки и хранения.
 */
export const useCreditStore = create(
  devtools(
    persist(
      (set, get) => ({
        ...defaultState,
        schedule: [],
        baseSchedule: [],
        isCalculating: false,
        error: null,

        updateParams: (params) => {
          set({ ...params, error: null });
        },

        updateCalcMode: (mode) => {
          set({ ...mode, error: null });
        },

        setCountPeriodOfYear: (value) => {
          set({ countPeriodOfYear: value, error: null });
        },

        /**
         * Добавляет событие досрочного погашения
         * @param {Object} repayment - {date: string, amount: number, type: 'reduceTerm'|'reducePayment'}
         */
        addEarlyRepayment: (repayment) => {
          const state = get();
          const newRepayments = [
            ...state.earlyRepayments,
            {
              id: Date.now(),
              ...repayment,
            },
          ].sort((a, b) => new Date(a.date) - new Date(b.date));

          set({ earlyRepayments: newRepayments });
          get().recalculateWithRepayments();
        },

        /**
         * Удаляет событие досрочного погашения
         */
        removeEarlyRepayment: (id) => {
          const state = get();
          const newRepayments = state.earlyRepayments.filter(
            (r) => r.id !== id
          );
          set({ earlyRepayments: newRepayments });
          get().recalculateWithRepayments();
        },

        /**
         * Обновляет событие досрочного погашения
         */
        updateEarlyRepayment: (id, updates) => {
          const state = get();
          const newRepayments = state.earlyRepayments
            .map((r) => (r.id === id ? { ...r, ...updates } : r))
            .sort((a, b) => new Date(a.date) - new Date(b.date));

          set({ earlyRepayments: newRepayments });
          get().recalculateWithRepayments();
        },

        /**
         * Очищает все события досрочного погашения
         */
        clearEarlyRepayments: () => {
          set({ earlyRepayments: [] });
          get().recalculateWithRepayments();
        },

        /**
         * Пересчитывает график с учетом досрочных погашений
         */
        recalculateWithRepayments: () => {
          const state = get();

          if (!state.baseSchedule.length) {
            return;
          }

          try {
            const creditParams = {
              summCredit: state.summCredit,
              procentYear: state.procentYear,
              periodCredit: state.periodCredit,
              countPeriodOfYear: state.countPeriodOfYear,
              currentDate: state.currentDate,
              skipWeekends: state.skipWeekends,
              calculationMode: state.calculationMode,
            };

            const scheduleWithRepayments =
              scheduleService.generateWithEarlyRepayments({
                baseSchedule: state.baseSchedule,
                earlyRepayments: state.earlyRepayments,
                creditParams,
              });

            set({ schedule: scheduleWithRepayments, error: null });
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Ошибка пересчета";
            set({ error: errorMessage });
          }
        },

        // пересчет графика платежей с учетом досрочных погашений
        calculateSchedule: () => {
          // Получение актуального состояния хранилища (состояние credit-store)
          const state = get();

          // установка состояния "вычисляется" и очистка ошибки
          set({ isCalculating: true, error: null });

          try {
            const fullParams = {
              summCredit: state.summCredit,
              procentYear: state.procentYear,
              periodCredit: state.periodCredit,
              countPeriodOfYear: state.countPeriodOfYear,
              currentDate: state.currentDate,
              skipWeekends: state.skipWeekends,
              calculationMode: state.calculationMode,
            };

            const baseSchedule = scheduleService.generate(fullParams);

            // Если есть события ДП, применяем их
            let schedule = baseSchedule;
            if (state.earlyRepayments.length > 0) {
              schedule = scheduleService.generateWithEarlyRepayments({
                baseSchedule,
                earlyRepayments: state.earlyRepayments,
                creditParams: fullParams,
              });
            }

            set({
              baseSchedule,
              schedule,
              isCalculating: false,
            });
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Неизвестная ошибка";

            set({
              error: errorMessage,
              isCalculating: false,
              schedule: [],
              baseSchedule: [],
            });
          }
        },

        reset: () => {
          set({
            ...defaultState,
            schedule: [],
            baseSchedule: [],
            isCalculating: false,
            error: null,
          });
        },
      }),
      {
        name: "credit-params-storage",
        partialize: (state) => ({
          summCredit: state.summCredit,
          procentYear: state.procentYear,
          periodCredit: state.periodCredit,
          countPeriodOfYear: state.countPeriodOfYear,
          currentDate: state.currentDate,
          skipWeekends: state.skipWeekends,
          calculationMode: state.calculationMode,
          earlyRepayments: state.earlyRepayments,
        }),
      }
    ),
    // Это конфигурационный объект для middleware devtools от zustand.
    // Параметр name задает видимое имя стора в инструментах Redux DevTools.
    // Это позволяет легко идентифицировать стора в DevTools и упрощает отладку.
    { name: "CreditStore" }
  )
);
