'use client';

interface PriceSliderProps {
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onChangeMin: (v: number) => void;
  onChangeMax: (v: number) => void;
}

export function PriceSlider({
  min,
  max,
  valueMin,
  valueMax,
  onChangeMin,
  onChangeMax,
}: PriceSliderProps) {
  const range = max - min || 1;

  /* Step dynamique selon l'amplitude */
  const step = max > 100000 ? 1000 : max > 10000 ? 100 : 10;

  const percentMin = ((valueMin - min) / range) * 100;
  const percentMax = ((valueMax - min) / range) * 100;

  return (
    <div className="py-2">
      <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-3">
        <span className="font-semibold text-[var(--afane-green)]">
          {valueMin.toLocaleString('fr-FR')} F
        </span>
        <span className="font-semibold text-[var(--afane-green)]">
          {valueMax.toLocaleString('fr-FR')} F
        </span>
      </div>

      <div className="relative h-6">
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-[var(--bg-tertiary)] rounded-full" />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1 bg-[var(--afane-green)] rounded-full"
          style={{
            left: `${percentMin}%`,
            width: `${percentMax - percentMin}%`,
          }}
        />

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMin}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (v <= valueMax) onChangeMin(v);
          }}
          className="absolute top-0 left-0 w-full h-6 appearance-none bg-transparent pointer-events-none slider-thumb"
        />

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMax}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (v >= valueMin) onChangeMax(v);
          }}
          className="absolute top-0 left-0 w-full h-6 appearance-none bg-transparent pointer-events-none slider-thumb"
        />
      </div>
    </div>
  );
}
