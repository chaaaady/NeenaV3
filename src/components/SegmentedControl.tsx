"use client";

import { cn } from "@/lib/cn";

export function SegmentedControl({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  const activeIndex = options.indexOf(value);
  const thumbWidth = 100 / options.length;

  return (
    <div className="segmented-track">
      <div
        className="segmented-thumb"
        style={{
          left: `calc(${activeIndex * thumbWidth}% + ${activeIndex * 2}px)`,
          width: `calc(${thumbWidth}% - 2px)`,
        }}
      />
      {options.map((option) => (
        <button
          key={option}
          className={cn("segmented-option", option === value && "active")}
          role="button"
          aria-pressed={option === value}
          onClick={() => {
            if (navigator.vibrate && option !== value) {
              navigator.vibrate(3);
            }
            onChange(option);
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(0.97)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

