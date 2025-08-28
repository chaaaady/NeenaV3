"use client";

export function Slider({
  min,
  max,
  step = 1,
  value,
  onChange,
  hideLandmarks = false,
}: {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  hideLandmarks?: boolean;
}) {
  // Calculer le pourcentage pour l'affichage visuel
  const getDisplayPercent = (val: number) => {
    if (val <= min) return 0;
    if (val >= max) return 100;
    return ((val - min) / (max - min)) * 100;
  };

  const displayPercent = getDisplayPercent(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    if (navigator.vibrate && Math.abs(newValue - value) >= 5) {
      navigator.vibrate(8);
    }
    onChange(newValue);
  };

  const landmarks = hideLandmarks ? [] : [
    { value: 5, label: "5€" },
    { value: 100, label: "100€" }
  ];

  return (
    <div className="w-full px-2">
      <div className="relative h-[14px] mb-1 px-1">
        {landmarks.map((landmark) => {
          const landmarkPercent = ((landmark.value - min) / (max - min)) * 100;
          const isFirst = landmark.value === min;
          const isLast = landmark.value === max;
          const transform = isFirst ? 'translateX(0%)' : isLast ? 'translateX(-100%)' : 'translateX(-50%)';
          const alignClass = isFirst ? 'text-left' : isLast ? 'text-right' : 'text-center';
          return (
            <div
              key={landmark.value}
              className={`absolute text-[12px] font-[600] text-[var(--text-muted)] tracking-tight ${alignClass}`}
              style={{ left: `${landmarkPercent}%`, top: 0, transform }}
            >
              {landmark.label}
            </div>
          );
        })}
      </div>

      <div className="relative h-[6px] bg-[var(--surface-2)] rounded-full mb-6 mx-1">
        <div 
          className="absolute top-0 left-0 h-full bg-[var(--brand)] rounded-full transition-all duration-150 ease-out"
          style={{ width: `${displayPercent}%` }}
        />
        {landmarks.map((landmark) => {
          const landmarkPercent = ((landmark.value - min) / (max - min)) * 100;
          return (
            <div
              key={`tick-${landmark.value}`}
              className="absolute top-1/2 transform -translate-y-1/2 w-[2px] h-[6px] bg-[var(--border)] rounded-full"
              style={{ left: `${landmarkPercent}%`, marginLeft: '-1px' }}
            />
          );
        })}
        <div 
          className="absolute top-1/2 transform -translate-y-1/2 w-[18px] h-[18px] bg-[var(--brand)] rounded-full shadow-lg transition-all duration-150 ease-out"
          style={{ 
            left: `${displayPercent}%`, 
            marginLeft: '-9px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.16)',
            border: '2px solid white'
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={Math.min(Math.max(value, min), max)} // Clamper la valeur pour l'input
          aria-label="amount"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ 
            margin: 0,
            height: '36px', // Surface tactile toujours suffisante
            top: '-15px' // Centrer la surface tactile
          }}
        />
      </div>
    </div>
  );
}

