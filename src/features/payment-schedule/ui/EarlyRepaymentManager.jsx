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
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.date || !formData.amount) {
      setError('Заполните все поля');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (amount <= 0) {
      setError('Сумма должна быть положительной');
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

  if (!baseSchedule.length) {
    return null;
  }

  return (
    <Card title="Досрочное погашение" className="animate-fade-in">
      <div className="space-y-4">
        
        {earlyRepayments.length > 0 && (
          <div className="space-y-2">
            {earlyRepayments.map((repayment, index) => (
              <div 
                key={repayment.id} 
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-scale-in transition-all duration-200 hover:bg-gray-100"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">
                    {formatDateDisplay(repayment.date)}
                  </div>
                  <div className="text-sm text-gray-600 truncate">
                    {formatCurrency(repayment.amount)} 
                    <span className="hidden sm:inline"> • {
                      repayment.type === 'reduceTerm' 
                        ? 'Сокращение срока' 
                        : 'Сокращение платежа'
                    }</span>
                  </div>
                </div>
                <button
                  onClick={() => removeEarlyRepayment(repayment.id)}
                  className="ml-2 sm:ml-4 p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md text-sm font-medium transition-colors"
                  title="Удалить"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {showForm ? (
          <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-blue-50 rounded-lg animate-scale-in">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дата погашения
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="reduceTerm">Сокращение срока</option>
                <option value="reducePayment">Сокращение платежа</option>
              </select>
            </div>

            {error && (
              <p className="text-sm text-red-600 animate-fade-in">{error}</p>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Добавить
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setShowForm(false);
                  setError('');
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
              >
                Отмена
              </button>
            </div>
          </form>
        ) : (
          <button 
            onClick={() => setShowForm(true)} 
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Добавить досрочное погашение
          </button>
        )}

        {earlyRepayments.length > 0 && (
          <div className="text-xs text-gray-500 italic pt-2 border-t border-gray-200">
            График пересчитывается автоматически с учётом всех событий
          </div>
        )}
      </div>
    </Card>
  );
};
