"use client";

type IconProps = {
  name: string;
  className?: string;
  style?: React.CSSProperties;
  fill?: 0 | 1;
};

export function Icon({ name, className = "", style = {}, fill = 0 }: IconProps) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontVariationSettings: `'FILL' ${fill}`,
        ...style,
      }}
    >
      {name}
    </span>
  );
}
