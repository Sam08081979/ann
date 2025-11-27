/**
 * Главная страница калькулятора
 */

import React from 'react';
import { useCreditStore } from '../../features/credit-form/model/credit-store.js';
import { CreditParamsForm } from '../../features/credit-form/ui/index.js';
import { PaymentScheduleTable, PaymentSummary, EarlyRepaymentManager } from '../../features/payment-schedule/ui/index.js';

export const CreditCalculator = () => {
  const { schedule, calculationMode } = useCreditStore();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Кредитный калькулятор
          </h1>
          <p className="mt-2 text-gray-600">
            Расчет аннуитетных платежей с поддержкой точного и упрощенного методов
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <CreditParamsForm />
              <EarlyRepaymentManager />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="space-y-6">
              <PaymentSummary schedule={schedule} />
              <PaymentScheduleTable
                schedule={schedule}
                calculationMode={calculationMode}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

