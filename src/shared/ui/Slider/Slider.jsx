import React, { useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { formatCurrency } from '../../lib/index.js';

export const Slider = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  formatValue,
  showInput = true,
  error,
  helperText,
  tooltip,
  className,
}) => {
  const inputId = useMemo(
    () => `slider-${Math.random().toString(36).substr(2, 9)}`,
    []
  );

  const handleSliderChange = useCallback(
    (e) => {
      onChange(parseFloat(e.target.value));
    },
    [onChange]
  );

  const handleInputChange = useCallback(
    (e) => {
      const newValue = parseFloat(e.target.value);
      if (!isNaN(newValue)) {
        onChange(Math.min(max, Math.max(min, newValue)));
      }
    },
    [onChange, min, max]
  );

  const percentage = ((value - min) / (max - min)) * 100;

  const displayValue = formatValue ? formatValue(value) : value;

  return (
    <div className={clsx('w-full', className)}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
          {tooltip && (
            <div className="tooltip-trigger relative">
              <button
                type="button"
                className="w-4 h-4 rounded-full bg-gray-200 text-gray-500 text-xs flex items-center justify-center hover:bg-gray-300 transition-colors"
                aria-label="Подробнее"
              >
                ?
              </button>
              <div className="tooltip -top-2 left-6 transform -translate-y-full">
                {tooltip}
                <div className="absolute top-full left-0 w-2 h-2 bg-gray-900 transform rotate-45 -translate-y-1 translate-x-2"></div>
              </div>
            </div>
          )}
        </div>
        <span className="text-sm font-semibold text-primary-600">
          {displayValue}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <div
            className="absolute top-1/2 left-0 h-2 bg-primary-500 rounded-full transform -translate-y-1/2 pointer-events-none transition-all duration-150"
            style={{ width: `${percentage}%` }}
          />
          <input
            type="range"
            id={inputId}
            value={value}
            onChange={handleSliderChange}
            min={min}
            max={max}
            step={step}
            className="relative z-10"
          />
        </div>

        {showInput && (
          <input
            type="number"
            value={value}
            onChange={handleInputChange}
            min={min}
            max={max}
            step={step}
            className={clsx(
              'w-24 px-2 py-1 text-sm border rounded-md text-right transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-primary-500',
              error ? 'border-red-500' : 'border-gray-300'
            )}
          />
        )}
      </div>

      <div className="flex justify-between mt-1 text-xs text-gray-400">
        <span>{formatValue ? formatValue(min) : min}</span>
        <span>{formatValue ? formatValue(max) : max}</span>
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};
