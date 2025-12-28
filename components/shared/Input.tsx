import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export default function Input({
  label,
  error,
  hint,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-zinc-400 mb-2">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-2.5 rounded-lg
          bg-[#0f0f10] border border-zinc-800
          text-zinc-200 text-sm font-light
          placeholder:text-zinc-500
          focus:outline-none focus:border-zinc-700
          transition-colors
          ${error ? 'border-red-500 focus:border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs text-red-500">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1.5 text-xs text-zinc-500">{hint}</p>
      )}
    </div>
  );
}
