import React, { useState } from 'react';
import { Icons } from '../constants';

interface PasswordInputProps {
  value: string;
  onChange: (val: string) => void;
  onGenerate: () => void;
  disabled?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ value, onChange, onGenerate, disabled }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="w-full space-y-2">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Icons.LockClosed />
        </div>
        <input
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter a password to analyze..."
          disabled={disabled}
          className="w-full bg-slate-800 border border-slate-700 text-white pl-10 pr-24 py-4 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-slate-500 shadow-lg text-lg"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-1">
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="p-2 text-slate-400 hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-700/50"
            title={isVisible ? "Hide password" : "Show password"}
          >
            {isVisible ? <Icons.EyeSlash /> : <Icons.Eye />}
          </button>
          <button
             onClick={onGenerate}
             className="p-2 text-indigo-400 hover:text-indigo-300 transition-colors rounded-lg hover:bg-indigo-900/30"
             title="Generate secure password"
          >
            <Icons.Refresh />
          </button>
        </div>
      </div>
    </div>
  );
};