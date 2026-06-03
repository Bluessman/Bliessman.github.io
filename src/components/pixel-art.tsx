export function Pokeball({ className = "" }: { className?: string }) {
  return <div className={`pokeball ${className}`} aria-hidden="true" />;
}

export function PixelBlock({ color = "var(--color-grass)", size = 32, className = "" }: { color?: string; size?: number; className?: string }) {
  return (
    <div
      className={`pixel-border ${className}`}
      style={{ width: size, height: size, backgroundColor: color }}
      aria-hidden="true"
    />
  );
}

export function Cloud({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 32" className={className} aria-hidden="true">
      <g fill="white" stroke="var(--color-border)" strokeWidth="2" shapeRendering="crispEdges">
        <rect x="8" y="12" width="8" height="8" />
        <rect x="16" y="8" width="8" height="12" />
        <rect x="24" y="4" width="8" height="16" />
        <rect x="32" y="8" width="8" height="12" />
        <rect x="40" y="12" width="8" height="8" />
      </g>
    </svg>
  );
}

export function Creeper({ className = "" }: { className?: string }) {
  // Simple pixel creeper-ish face
  return (
    <svg viewBox="0 0 16 16" className={className} shapeRendering="crispEdges" aria-hidden="true">
      <rect width="16" height="16" fill="oklch(0.55 0.18 145)" />
      <rect x="3" y="4" width="3" height="3" fill="black" />
      <rect x="10" y="4" width="3" height="3" fill="black" />
      <rect x="6" y="8" width="4" height="2" fill="black" />
      <rect x="5" y="10" width="2" height="4" fill="black" />
      <rect x="9" y="10" width="2" height="4" fill="black" />
      <rect x="7" y="10" width="2" height="2" fill="black" />
    </svg>
  );
}

export function PixelPikachu({ className = "" }: { className?: string }) {
  // Tiny pikachu-ish pixel mascot
  return (
    <svg viewBox="0 0 16 16" className={className} shapeRendering="crispEdges" aria-hidden="true">
      <rect x="3" y="0" width="2" height="3" fill="oklch(0.85 0.18 95)" />
      <rect x="4" y="0" width="1" height="2" fill="black" />
      <rect x="11" y="0" width="2" height="3" fill="oklch(0.85 0.18 95)" />
      <rect x="11" y="0" width="1" height="2" fill="black" />
      <rect x="2" y="3" width="12" height="9" fill="oklch(0.85 0.18 95)" />
      <rect x="4" y="6" width="2" height="2" fill="black" />
      <rect x="10" y="6" width="2" height="2" fill="black" />
      <rect x="3" y="8" width="2" height="1" fill="oklch(0.7 0.2 30)" />
      <rect x="11" y="8" width="2" height="1" fill="oklch(0.7 0.2 30)" />
      <rect x="6" y="9" width="4" height="1" fill="black" />
      <rect x="3" y="12" width="3" height="3" fill="oklch(0.85 0.18 95)" />
      <rect x="10" y="12" width="3" height="3" fill="oklch(0.85 0.18 95)" />
    </svg>
  );
}
