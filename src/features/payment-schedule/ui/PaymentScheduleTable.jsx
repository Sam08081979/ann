/**
 * Таблица графика платежей
 */

import React from 'react';
import { formatCurrency, formatDateDisplay } from '../../../shared/lib/index.js';
import { Card } from '../../../shared/ui/index.js';

export const PaymentScheduleTable = ({ schedule, calculationMode }) => {
  if (!schedule.length) {
    return (
      <Card title="График платежей">
        <p className="text-gray-500 text-center py-8">
          График платежей пуст. Заполните параметры и нажмите "Рассчитать".
        </p>
      </Card>
    );
  }

  return (
    <Card title="График платежей" padding="none">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                №
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дата
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дней
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Платеж
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Основной долг
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Проценты
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Остаток
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {schedule.map((item, index) => {
              const interest =
                calculationMode === 'exact' ? item.intExact : item.intSimple;

              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {formatDateDisplay(item.payDtWk)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {item.cPayDtWk}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                    {formatCurrency(item.payAm)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 text-right">
                    {formatCurrency(item.principal)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 text-right">
                    {formatCurrency(interest)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                    {formatCurrency(item.remDebt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

