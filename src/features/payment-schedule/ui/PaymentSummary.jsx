/**
 * Компонент итоговой информации по кредиту
 */

import React from 'react';
import { formatCurrency, formatPercent } from '../../../shared/lib/index.js';
import { scheduleService } from '../services/index.js';
import { Card } from '../../../shared/ui/index.js';

export const PaymentSummary = ({ schedule }) => {
  if (!schedule.length) {
    return null;
  }

  const summary = scheduleService.calculateSummary(schedule);

  return (
    <Card title="Итоговая информация">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Сумма кредита</p>
          <p className="text-xl font-bold text-gray-900">
            {formatCurrency(summary.totalPrincipal)}
          </p>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Всего платежей</p>
          <p className="text-xl font-bold text-gray-900">
            {formatCurrency(summary.totalPayments)}
          </p>
        </div>

        <div className="p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Переплата</p>
          <p className="text-xl font-bold text-gray-900">
            {formatCurrency(summary.overpayment)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {formatPercent(summary.overpaymentPercent)} от суммы кредита
          </p>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Проценты</p>
          <p className="text-xl font-bold text-gray-900">
            {formatCurrency(summary.totalInterest)}
          </p>
        </div>

        <div className="p-4 bg-indigo-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Количество платежей</p>
          <p className="text-xl font-bold text-gray-900">{schedule.length}</p>
        </div>

        <div className="p-4 bg-pink-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Средний платеж</p>
          <p className="text-xl font-bold text-gray-900">
            {formatCurrency(summary.totalPayments / schedule.length)}
          </p>
        </div>
      </div>
    </Card>
  );
};

