// HCI: Fitts' Law — min 44x44px; Affordance — looks clickable
import React from 'react';

const variants = {
  primary:   'bg-indigo-500 hover:bg-indigo-600 text-white shadow-sm',
  secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm',
  ghost:     'hover:bg-gray-100 text-gray-600',
  danger:    'bg-red-600 hover:bg-red-700 text-white shadow-sm',
  link:      'text-indigo-600 hover:underline p-0 h-auto min-h-0',
};

const sizes = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-11 px-5 text-sm gap-2',
  icon: 'h-9 w-9 p-0',
  'icon-sm': 'h-7 w-7 p-0',
};

export function Button({ variant = 'secondary', size = 'md', className = '', children, disabled, loading, ...props }) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-medium rounded-lg
        transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1
        disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[44px]
        ${sizes[size] ?? sizes.md}
        ${variants[variant] ?? variants.secondary}
        ${className}
      `}
    >
      {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  );
}
