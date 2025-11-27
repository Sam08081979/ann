/**
 * Таблица графика платежей с группировкой по годам
 */

import React, { useMemo, useState } from 'react';
import { formatCurrency, formatDateDisplay } from '../../../shared/lib/index.js';
import { Card } from '../../../shared/ui/index.js';

export const PaymentScheduleTable = ({ schedule, calculationMode, earlyRepayments = [] }) => {
  const [expandedYears, setExpandedYears] = useState({});

  const earlyRepaymentDates = useMemo(() => {
    return new Set(earlyRepayments.map(r => {
      const date = new Date(r.date);
      return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
    }));
  }, [earlyRepayments]);

  const formatDateForComparison = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
  };

  const groupedByYear = useMemo(() => {
    if (!schedule.length) return {};

    return schedule.reduce((acc, item, index) => {
      const date = new Date(item.payDtWk);
      const year = date.getFullYear();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push({ ...item, originalIndex: index });
      return acc;
    }, {});
  }, [schedule]);

  const years = useMemo(() => Object.keys(groupedByYear).sort(), [groupedByYear]);

  const toggleYear = (year) => {
    setExpandedYears(prev => ({
      ...prev,
      [year]: !prev[year]
    }));
  };

  const isYearExpanded = (year) => {
    return expandedYears[year] !== false;
  };

  if (!schedule.length) {
    return (
      <Card title="График платежей" className="animate-fade-in">
        <p className="text-gray-500 text-center py-8">
          График платежей пуст. Заполните параметры и нажмите "Рассчитать".
        </p>
      </Card>
    );
  }

  return (
    <Card title="График платежей" padding="none" className="animate-slide-up">
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="sticky-header">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                №
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дата
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                Дней
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Платеж
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Осн. долг
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Проценты
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Остаток
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {years.map((year) => (
              <React.Fragment key={year}>
                <tr 
                  className="bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => toggleYear(year)}
                >
                  <td colSpan={7} className="px-4 py-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">
                        {year} год
                        <span className="ml-2 text-gray-500 font-normal">
                          ({groupedByYear[year].length} платежей)
                        </span>
                      </span>
                      <span className="text-gray-400 transition-transform duration-200" 
                            style={{ transform: isYearExpanded(year) ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        ▼
                      </span>
                    </div>
                  </td>
                </tr>

                {isYearExpanded(year) && (
                  <>
                    {groupedByYear[year].map((item) => {
                      const interest =
                        calculationMode === 'exact' ? item.intExact : item.intSimple;
                      const isEarlyRepayment = earlyRepaymentDates.has(
                        formatDateForComparison(item.payDtWk)
                      );

                      return (
                        <tr
                          key={item.originalIndex}
                          className={`
                            transition-colors duration-150
                            ${isEarlyRepayment 
                              ? 'bg-green-50 hover:bg-green-100' 
                              : 'hover:bg-gray-50'
                            }
                          `}
                        >
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {item.originalIndex + 1}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            <span className="flex items-center gap-1">
                              {formatDateDisplay(item.payDtWk)}
                              {isEarlyRepayment && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                  ДП
                                </span>
                              )}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                            {item.cPayDtWk}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                            {formatCurrency(item.payAm)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 text-right hidden md:table-cell">
                            {formatCurrency(item.principal)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 text-right hidden md:table-cell">
                            {formatCurrency(interest)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                            {formatCurrency(item.remDebt)}
                          </td>
                        </tr>
                      );
                    })}
                  </>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-green-100 border-l-2 border-green-500 rounded-sm"></span>
            <span>Досрочное погашение</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-gray-100 rounded-sm"></span>
            <span>Итоги года</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
