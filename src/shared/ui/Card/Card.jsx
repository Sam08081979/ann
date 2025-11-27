/**
 * Переиспользуемый компонент карточки
 */

import React from 'react';
import clsx from 'clsx';

export const Card = ({ children, title, className, padding = 'md' }) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={clsx(
        'bg-white rounded-lg shadow-lg',
        paddingClasses[padding],
        className
      )}
    >
      {title && (
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>
      )}
      {children}
    </div>
  );
};

