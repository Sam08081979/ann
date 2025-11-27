/**
 * Компонент для управления событиями досрочного погашения
 */

import React, { useState } from 'react';
import { formatCurrency, formatDateDisplay } from '../../../shared/lib/index.js';
import { Card, Button } from '../../../shared/ui/index.js';
import { useCreditStore } from '../../credit-form/model/credit-store.js';

export const EarlyRepaymentManager = () => {
  const { 
    earlyRepayments, 
    baseSchedule,
    addEarlyRepayment, 
    removeEarlyRepayment,
  } = useCreditStore();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    amount: '',
    type: 'reduceTerm'
  });

  /**
   * Обработчик отправки формы добавления досрочного погашения
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.date || !formData.amount) {
      alert('Заполните все поля');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (amount <= 0) {
      alert('Сумма должна быть положительной');
      return;
    }

    addEarlyRepayment({
      date: formData.date,
      amount,
      type: formData.type
    });

    setFormData({ date: '', amount: '', type: 'reduceTerm' });
    setShowForm(false);
  };

  // Не показываем компонент если нет базового графика
  if (!baseSchedule.length) {
    return null;
  }

  return (
    <Card title="Досрочное погашение">
      <div className="space-y-4">
        
        {/* Список событий */}
        {earlyRepayments.length > 0 && (
          <div className="space-y-2">
            {earlyRepayments.map((repayment) => (
              <div 
                key={repayment.id} 
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {formatDateDisplay(repayment.date)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatCurrency(repayment.amount)} • {
                      repayment.type === 'reduceTerm' 
                        ? 'Сокращение срока' 
                        : 'Сокращение платежа'
                    }
                  </div>
                </div>
                <button
                  onClick={() => removeEarlyRepayment(repayment.id)}
                  className="ml-4 text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Форма добавления */}
        {showForm ? (
          <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-blue-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дата погашения
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Сумма
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Режим погашения
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="reduceTerm">Сокращение срока</option>
                <option value="reducePayment">Сокращение платежа</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Добавить
              </button>
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Отмена
              </button>
            </div>
          </form>
        ) : (
          <button 
            onClick={() => setShowForm(true)} 
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            + Добавить досрочное погашение
          </button>
        )}

        {/* Информация о сравнении */}
        {earlyRepayments.length > 0 && (
          <div className="text-xs text-gray-500 italic pt-2 border-t border-gray-200">
            График пересчитывается автоматически с учётом всех событий
          </div>
        )}
      </div>
    </Card>
  );
};

