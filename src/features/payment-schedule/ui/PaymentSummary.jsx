/**
 * Компонент итоговой информации по кредиту
 */

import React from 'react';
import { formatCurrency, formatPercent } from '../../../shared/lib/index.js';
import { scheduleService } from '../services/index.js';
import { Card } from '../../../shared/ui/index.js';

const SummaryCard = ({ label, value, subValue, bgColor, delay = 0 }) => (
  <div 
    className={`p-4 ${bgColor} rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md animate-scale-in`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <p className="text-sm text-gray-600 mb-1">{label}</p>
    <p className="text-lg sm:text-xl font-bold text-gray-900 break-words">
      {value}
    </p>
    {subValue && (
      <p className="text-xs text-gray-500 mt-1">{subValue}</p>
    )}
  </div>
);

export const PaymentSummary = ({ schedule }) => {
  if (!schedule.length) {
    return null;
  }

  const summary = scheduleService.calculateSummary(schedule);

  return (
    <Card title="Итоговая информация" className="animate-fade-in">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <SummaryCard
          label="Сумма кредита"
          value={formatCurrency(summary.totalPrincipal)}
          bgColor="bg-blue-50"
          delay={0}
        />

        <SummaryCard
          label="Всего платежей"
          value={formatCurrency(summary.totalPayments)}
          bgColor="bg-green-50"
          delay={50}
        />

        <SummaryCard
          label="Переплата"
          value={formatCurrency(summary.overpayment)}
          subValue={`${formatPercent(summary.overpaymentPercent)} от суммы`}
          bgColor="bg-yellow-50"
          delay={100}
        />

        <SummaryCard
          label="Проценты"
          value={formatCurrency(summary.totalInterest)}
          bgColor="bg-purple-50"
          delay={150}
        />

        <SummaryCard
          label="Кол-во платежей"
          value={schedule.length}
          bgColor="bg-indigo-50"
          delay={200}
        />

        <SummaryCard
          label="Средний платеж"
          value={formatCurrency(summary.totalPayments / schedule.length)}
          bgColor="bg-pink-50"
          delay={250}
        />
      </div>
    </Card>
  );
};
