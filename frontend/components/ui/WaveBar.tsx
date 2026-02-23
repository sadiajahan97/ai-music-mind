"use client";

type WaveBarProps = {
  height?: number;
  delay?: number;
  className?: string;
};

export function WaveBar({ height = 40, delay = 0, className = "" }: WaveBarProps) {
  return (
    <div
      className={`wave-bar anim-wave ${className}`}
      style={{
        height: `${height}px`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}
