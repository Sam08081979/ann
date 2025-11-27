import React from 'react';
import clsx from 'clsx';

export const Tooltip = ({
  children,
  content,
  position = 'top',
  className,
}) => {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 -translate-y-1 rotate-45',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 translate-y-1 rotate-45',
    left: 'left-full top-1/2 -translate-y-1/2 -translate-x-1 rotate-45',
    right: 'right-full top-1/2 -translate-y-1/2 translate-x-1 rotate-45',
  };

  return (
    <div className={clsx('tooltip-trigger relative inline-flex', className)}>
      {children}
      <div className={clsx('tooltip', positionClasses[position])}>
        {content}
        <div
          className={clsx(
            'absolute w-2 h-2 bg-gray-900',
            arrowClasses[position]
          )}
        />
      </div>
    </div>
  );
};

export const InfoIcon = ({ className }) => (
  <svg
    className={clsx('w-4 h-4', className)}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export const TooltipIcon = ({ tooltip, className }) => (
  <Tooltip content={tooltip} position="top">
    <button
      type="button"
      className={clsx(
        'text-gray-400 hover:text-gray-600 transition-colors',
        className
      )}
      aria-label="Подробнее"
    >
      <InfoIcon />
    </button>
  </Tooltip>
);
