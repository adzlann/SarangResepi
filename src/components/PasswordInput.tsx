'use client';

import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
}

export default function PasswordInput({
  id,
  value,
  onChange,
  placeholder = 'Password',
  autoComplete = 'new-password',
  required = true,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        Password
      </label>
      <input
        id={id}
        name={id}
        type={showPassword ? 'text' : 'password'}
        autoComplete={autoComplete}
        required={required}
        className="appearance-none rounded-lg relative block w-full px-3 py-2 pr-10 border bg-dark-surface2 border-dark-border placeholder-text-disabled text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent sm:text-sm"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-disabled hover:text-text-primary focus:outline-none z-10"
        onClick={() => setShowPassword(!showPassword)}
        tabIndex={-1}
      >
        {showPassword ? (
          <FaEyeSlash className="h-5 w-5" aria-hidden="true" />
        ) : (
          <FaEye className="h-5 w-5" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
