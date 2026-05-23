export default function ConversionRing({ rate = 0, size = 120 }) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (rate / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#21262d" strokeWidth="10" />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke="#3fb950" strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="text-center -mt-2">
        <div className="text-xl font-bold font-mono text-[#3fb950]">{rate}%</div>
        <div className="text-xs text-[#8b949e]">Conversion</div>
      </div>
    </div>
  );
}
