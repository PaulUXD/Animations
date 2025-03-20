'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ToggleProps {
  options: { label: string; value: string }[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function Toggle({ options, defaultValue, onChange, className }: ToggleProps) {
  const [selected, setSelected] = useState(defaultValue || options[0].value);

  const handleChange = (value: string) => {
    setSelected(value);
    onChange?.(value);
  };

  return (
    <div className={cn("flex bg-black/50 backdrop-blur-sm rounded-full p-1", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => handleChange(option.value)}
          className={cn(
            "px-3 py-1 text-xs font-medium rounded-full transition-all",
            selected === option.value
              ? "bg-white/10 text-white"
              : "text-white/50 hover:text-white/80"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
} 