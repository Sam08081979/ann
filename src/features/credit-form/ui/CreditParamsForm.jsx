/**
 * Форма ввода параметров кредита
 */

import React from "react";
import { useCreditStore } from "../model/credit-store.js";
import { Button, Input, Select, Card } from "../../../shared/ui/index.js";
import {
  COUNT_PERIODS_OF_YEAR,
  PERIOD_LABELS,
} from "../../../shared/config/constants.js";

/**
 * Форма ввода параметров кредита
 */

export const CreditParamsForm = () => {
  const {
    summCredit,
    procentYear,
    periodCredit,
    countPeriodOfYear,
    currentDate,
    skipWeekends,
    calculationMode,
    isCalculating,
    error,
    updateParams,
    updateCalcMode,
    setCountPeriodOfYear,
    calculateSchedule,
  } = useCreditStore();

  /**
   * Обработчик отправки формы
   * @param {React.FormEvent<HTMLFormElement>} e - событие отправки формы
   */

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateSchedule();
  };

  /**
   * Форматируем дату для input[type="date"]
   * @returns {string} - форматированная дата
   */
  const formattedDate = new Date(currentDate).toISOString().split("T")[0];

  /**
   * Опции для select[label="Количество периодов в году"]
   * @returns {Array} - массив опций
   */

  const periodOptions = COUNT_PERIODS_OF_YEAR.map((value, index) => ({
    value: index,
    label: `${value} (${PERIOD_LABELS[value]})`,
  }));

  /**
   * Индекс текущего периода в году
   * @returns {number} - индекс текущего периода в году
   */

  const currentPeriodIndex = COUNT_PERIODS_OF_YEAR.indexOf(countPeriodOfYear);

  /**
   * Возвращаем форму ввода параметров кредита
   * @returns {JSX.Element} - форма ввода параметров кредита
   */

  return (
    <Card title="Параметры кредита">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="number"
          label="Сумма кредита (руб.)"
          value={summCredit}
          onChange={(e) =>
            updateParams({ summCredit: parseFloat(e.target.value) })
          }
          min="1000"
          step="1000"
          required
        />

        <Input
          type="number"
          label="Годовая процентная ставка (%)"
          value={procentYear}
          onChange={(e) =>
            updateParams({ procentYear: parseFloat(e.target.value) })
          }
          min="0.1"
          max="100"
          step="0.1"
          required
        />

        <Input
          type="number"
          label="Срок кредита (лет)"
          value={periodCredit}
          onChange={(e) =>
            updateParams({ periodCredit: parseFloat(e.target.value) })
          }
          min="0.1"
          step="0.1"
          required
        />

        <Select
          label="Количество периодов в году"
          value={currentPeriodIndex}
          onChange={(e) => {
            const index = parseInt(e.target.value, 10);
            setCountPeriodOfYear(COUNT_PERIODS_OF_YEAR[index]);
          }}
          options={periodOptions}
          helperText={`Выбрано: ${countPeriodOfYear} периодов в году`}
        />

        <Input
          type="date"
          label="Дата начала кредита"
          value={formattedDate}
          onChange={(e) =>
            updateParams({
              currentDate: new Date(e.target.value).toISOString(),
            })
          }
          required
        />

        <Select
          label="Пропускать выходные дни"
          value={skipWeekends}
          onChange={(e) => updateCalcMode({ skipWeekends: e.target.value })}
          options={[
            { value: "Y", label: "Да" },
            { value: "N", label: "Нет" },
          ]}
        />

        <Select
          label="Режим расчета процентов"
          value={calculationMode}
          onChange={(e) => updateCalcMode({ calculationMode: e.target.value })}
          options={[
            { value: "exact", label: "Точный (по факт. дням)" },
            { value: "simple", label: "Упрощенный" },
          ]}
        />

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <Button type="submit" fullWidth isLoading={isCalculating}>
          Рассчитать график платежей
        </Button>
      </form>
    </Card>
  );
};
