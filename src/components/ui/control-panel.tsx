'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ControlPanelProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function ControlPanel({ title, children, className }: ControlPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "absolute bottom-4 right-4 w-64 bg-black/70 backdrop-blur-sm rounded-lg overflow-hidden transition-all duration-200 z-30 border border-white/10",
      isCollapsed ? "h-10" : "max-h-96",
      className
    )}>
      <div 
        className="flex items-center justify-between px-4 py-2 cursor-pointer bg-white/5 hover:bg-white/10"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3 className="text-sm font-medium text-white">{title}</h3>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={cn("h-4 w-4 text-white/70 transition-transform", isCollapsed ? "rotate-180" : "")}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      <div className={cn(
        "p-4 transition-all duration-200",
        isCollapsed ? "opacity-0 h-0 p-0" : "opacity-100"
      )}>
        {children}
      </div>
    </div>
  );
}

// Slider component for controls
interface SliderProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
}

export function Slider({ label, min, max, step = 1, value, onChange }: SliderProps) {
  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <label className="text-xs text-white/70">{label}</label>
        <span className="text-xs text-white/70">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
}

// Color picker component
interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

export function ColorPicker({ label, value, onChange, options }: ColorPickerProps) {
  return (
    <div className="mb-3">
      <label className="text-xs text-white/70 block mb-1">{label}</label>
      <div className="flex gap-2 flex-wrap">
        {options.map((color) => (
          <button
            key={color}
            className={cn(
              "w-6 h-6 rounded-full border-2",
              value === color ? "border-white" : "border-transparent"
            )}
            style={{ backgroundColor: color }}
            onClick={() => onChange(color)}
            aria-label={`Select ${color} color`}
          />
        ))}
      </div>
    </div>
  );
}

// Custom color input component
interface CustomColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function CustomColorInput({ label, value, onChange }: CustomColorInputProps) {
  const [tempColor, setTempColor] = useState(value);
  
  // Apply color change when input loses focus
  const applyColor = () => {
    // Validate hex color format
    const isValidHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(tempColor);
    if (isValidHex) {
      console.log("Applying color:", tempColor);
      onChange(tempColor);
    } else {
      // Reset to previous valid color if invalid
      setTempColor(value);
    }
  };

  return (
    <div className="mb-3">
      <label className="text-xs text-white/70 block mb-1">{label}</label>
      <div className="flex gap-2">
        <input
          type="color"
          value={tempColor}
          onChange={(e) => {
            setTempColor(e.target.value);
            onChange(e.target.value); // Apply color change immediately for color picker
          }}
          className="w-8 h-8 rounded cursor-pointer bg-transparent"
        />
        <input
          type="text"
          value={tempColor}
          onChange={(e) => setTempColor(e.target.value)}
          onBlur={applyColor}
          onKeyDown={(e) => e.key === 'Enter' && applyColor()}
          placeholder="#RRGGBB"
          className="flex-1 bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-white"
        />
      </div>
      <div 
        className="mt-2 w-full h-6 rounded" 
        style={{ backgroundColor: tempColor }}
      />
    </div>
  );
} 