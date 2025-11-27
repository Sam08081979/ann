/**
 * Форма ввода параметров кредита
 */

import React, { useState, useCallback, useMemo } from "react";
import { useCreditStore } from "../model/credit-store.js";
import { Button, Input, Select, Card, Slider, TooltipIcon } from "../../../shared/ui/index.js";
import { formatCurrency } from "../../../shared/lib/index.js";
import {
  COUNT_PERIODS_OF_YEAR,
  PERIOD_LABELS,
  VALIDATION_LIMITS,
} from "../../../shared/config/constants.js";

const TOOLTIPS = {
  summCredit: "Общая сумма денег, которую вы берете в долг у банка. От этой суммы зависит размер ежемесячного платежа и общая переплата по кредиту.",
  procentYear: "Годовой процент, который банк берет за пользование кредитом. Чем выше ставка, тем больше переплата.",
  periodCredit: "Срок, за который вы обязуетесь вернуть кредит. Больший срок означает меньший платеж, но большую переплату.",
  countPeriodOfYear: "Как часто вы будете вносить платежи. При ежемесячных платежах переплата обычно меньше.",
  calculationMode: "Точный метод учитывает реальное количество дней в месяце. Упрощенный считает все месяцы одинаковыми (30 дней).",
  skipWeekends: "Если платеж выпадает на выходной, он переносится на следующий рабочий день.",
};

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

  const [validationErrors, setValidationErrors] = useState({});

  const validateField = useCallback((field, value) => {
    const limits = VALIDATION_LIMITS[field];
    if (!limits) return null;

    if (isNaN(value)) {
      return 'Введите число';
    }
    if (value < limits.min) {
      return `Минимум: ${field === 'summCredit' ? formatCurrency(limits.min) : limits.min}`;
    }
    if (value > limits.max) {
      return `Максимум: ${field === 'summCredit' ? formatCurrency(limits.max) : limits.max}`;
    }
    return null;
  }, []);

  const handleSummCreditChange = useCallback((value) => {
    const clampedValue = Math.min(VALIDATION_LIMITS.summCredit.max, Math.max(VALIDATION_LIMITS.summCredit.min, value));
    const error = validateField('summCredit', value);
    setValidationErrors(prev => ({ ...prev, summCredit: error }));
    updateParams({ summCredit: isNaN(value) ? clampedValue : value });
  }, [updateParams, validateField]);

  const handleProcentYearChange = useCallback((value) => {
    const clampedValue = Math.min(VALIDATION_LIMITS.procentYear.max, Math.max(VALIDATION_LIMITS.procentYear.min, value));
    const error = validateField('procentYear', value);
    setValidationErrors(prev => ({ ...prev, procentYear: error }));
    updateParams({ procentYear: isNaN(value) ? clampedValue : value });
  }, [updateParams, validateField]);

  const handlePeriodCreditChange = useCallback((value) => {
    const clampedValue = Math.min(VALIDATION_LIMITS.periodCredit.max, Math.max(VALIDATION_LIMITS.periodCredit.min, value));
    const error = validateField('periodCredit', value);
    setValidationErrors(prev => ({ ...prev, periodCredit: error }));
    updateParams({ periodCredit: isNaN(value) ? clampedValue : value });
  }, [updateParams, validateField]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const hasErrors = Object.values(validationErrors).some(err => err !== null);
    if (!hasErrors) {
      calculateSchedule();
    }
  };

  const formattedDate = new Date(currentDate).toISOString().split("T")[0];

  const periodOptions = COUNT_PERIODS_OF_YEAR.map((value, index) => ({
    value: index,
    label: `${value} (${PERIOD_LABELS[value]})`,
  }));

  const currentPeriodIndex = COUNT_PERIODS_OF_YEAR.indexOf(countPeriodOfYear);

  const formatSumm = useCallback((val) => {
    if (val >= 1000000) {
      return `${(val / 1000000).toFixed(1)} млн`;
    }
    if (val >= 1000) {
      return `${(val / 1000).toFixed(0)} тыс`;
    }
    return val.toString();
  }, []);

  const hasValidationErrors = useMemo(() => 
    Object.values(validationErrors).some(err => err !== null),
    [validationErrors]
  );

  return (
    <Card title="Параметры кредита" className="animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <Slider
            label="Сумма кредита"
            value={summCredit}
            onChange={handleSummCreditChange}
            min={VALIDATION_LIMITS.summCredit.min}
            max={10000000}
            step={10000}
            formatValue={formatSumm}
            tooltip={TOOLTIPS.summCredit}
            error={validationErrors.summCredit}
          />
        </div>

        <div className="space-y-1">
          <Slider
            label="Годовая ставка (%)"
            value={procentYear}
            onChange={handleProcentYearChange}
            min={VALIDATION_LIMITS.procentYear.min}
            max={VALIDATION_LIMITS.procentYear.max}
            step={0.1}
            formatValue={(val) => `${val.toFixed(1)}%`}
            tooltip={TOOLTIPS.procentYear}
            error={validationErrors.procentYear}
          />
        </div>

        <div className="space-y-1">
          <Slider
            label="Срок кредита (лет)"
            value={periodCredit}
            onChange={handlePeriodCreditChange}
            min={VALIDATION_LIMITS.periodCredit.min}
            max={30}
            step={0.5}
            formatValue={(val) => `${val} лет`}
            tooltip={TOOLTIPS.periodCredit}
            error={validationErrors.periodCredit}
          />
        </div>

        <div className="relative">
          <Select
            label={
              <span className="flex items-center gap-1">
                Периодичность платежей
                <TooltipIcon tooltip={TOOLTIPS.countPeriodOfYear} />
              </span>
            }
            value={currentPeriodIndex}
            onChange={(e) => {
              const index = parseInt(e.target.value, 10);
              setCountPeriodOfYear(COUNT_PERIODS_OF_YEAR[index]);
            }}
            options={periodOptions}
          />
        </div>

        <Input
          type="date"
          label={
            <span className="flex items-center gap-1">
              Дата начала кредита
            </span>
          }
          value={formattedDate}
          onChange={(e) =>
            updateParams({
              currentDate: new Date(e.target.value).toISOString(),
            })
          }
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label={
              <span className="flex items-center gap-1">
                Выходные
                <TooltipIcon tooltip={TOOLTIPS.skipWeekends} />
              </span>
            }
            value={skipWeekends}
            onChange={(e) => updateCalcMode({ skipWeekends: e.target.value })}
            options={[
              { value: "Y", label: "Пропускать" },
              { value: "N", label: "Не пропускать" },
            ]}
          />

          <Select
            label={
              <span className="flex items-center gap-1">
                Расчёт
                <TooltipIcon tooltip={TOOLTIPS.calculationMode} />
              </span>
            }
            value={calculationMode}
            onChange={(e) => updateCalcMode({ calculationMode: e.target.value })}
            options={[
              { value: "exact", label: "Точный" },
              { value: "simple", label: "Упрощённый" },
            ]}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md animate-scale-in">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <Button 
          type="submit" 
          fullWidth 
          isLoading={isCalculating}
          disabled={hasValidationErrors}
          className="transition-smooth"
        >
          Рассчитать график платежей
        </Button>
      </form>
    </Card>
  );
};
