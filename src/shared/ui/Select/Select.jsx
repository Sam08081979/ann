/**
 * Переиспользуемый компонент выпадающего списка
 */

import React from 'react';
import clsx from 'clsx';

export const Select = React.forwardRef(
  ({ label, error, helperText, options, className, id, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={clsx(
            'w-full px-3 py-2 border rounded-md transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-primary-500',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300',
            'disabled:bg-gray-100 disabled:cursor-not-allowed',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={`${selectId}-error`} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${selectId}-helper`} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

