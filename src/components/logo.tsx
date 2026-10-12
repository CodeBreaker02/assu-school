/**
 * The cowrie shell — humanity's first widely used currency — drawn as a
 * geometric mark: an ivory oval with the toothed aperture down its middle.
 */
export function CauriMark({ className = "size-7" }: { className?: string }) {
  const teeth = [-11, -6.5, -2, 2.5, 7, 11.5];
  return (
    <svg viewBox="0 0 32 40" className={className} aria-hidden>
      <defs>
        <linearGradient id="cauri-shell" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fbf3e2" />
          <stop offset="55%" stopColor="#f6d58e" />
          <stop offset="100%" stopColor="#e9b44c" />
        </linearGradient>
      </defs>
      <ellipse cx="16" cy="20" rx="14" ry="18.5" fill="url(#cauri-shell)" />
      <path
        d="M16 4.5 C 13.2 11, 13.2 29, 16 35.5 C 18.8 29, 18.8 11, 16 4.5 Z"
        fill="#0a0907"
      />
      {teeth.map((y) => (
        <g key={y} stroke="#0a0907" strokeWidth="1.6" strokeLinecap="round">
          <line x1="11.4" y1={20 + y} x2="14" y2={20 + y} />
          <line x1="18" y1={20 + y} x2="20.6" y2={20 + y} />
        </g>
      ))}
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <CauriMark />
      <span className="font-display text-[1.45rem] leading-none tracking-tight whitespace-nowrap">
        assu<span className="text-muted"> school</span>
      </span>
    </span>
  );
}
