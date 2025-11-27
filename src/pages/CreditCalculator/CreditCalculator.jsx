/**
 * Главная страница калькулятора
 */

import React from 'react';
import { useCreditStore } from '../../features/credit-form/model/credit-store.js';
import { CreditParamsForm } from '../../features/credit-form/ui/index.js';
import { PaymentScheduleTable, PaymentSummary, EarlyRepaymentManager } from '../../features/payment-schedule/ui/index.js';

export const CreditCalculator = () => {
  const { schedule, calculationMode, earlyRepayments } = useCreditStore();

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Кредитный калькулятор
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Расчет аннуитетных платежей с поддержкой точного и упрощенного методов
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <div className="lg:col-span-1">
            <div className="space-y-4 sm:space-y-6">
              <CreditParamsForm />
              <EarlyRepaymentManager />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="space-y-4 sm:space-y-6">
              <PaymentSummary schedule={schedule} />
              <PaymentScheduleTable
                schedule={schedule}
                calculationMode={calculationMode}
                earlyRepayments={earlyRepayments}
              />
            </div>
          </div>
        </div>

        <footer className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>Кредитный калькулятор v1.0</p>
        </footer>
      </div>
    </div>
  );
};
