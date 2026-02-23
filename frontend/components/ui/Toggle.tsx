"use client";

import { useState } from "react";

type ToggleProps = {
  defaultOn?: boolean;
  onToggle?: (on: boolean) => void;
};

export function Toggle({ defaultOn = true, onToggle }: ToggleProps) {
  const [on, setOn] = useState(defaultOn);

  const handleClick = () => {
    const next = !on;
    setOn(next);
    onToggle?.(next);
  };

  return (
    <div
      role="switch"
      aria-checked={on}
      onClick={handleClick}
      className={`w-11 h-6 rounded-xl relative cursor-pointer transition-colors ${
        on ? "bg-primary" : "bg-border-subtle"
      }`}
    >
      <div
        className={`absolute w-[18px] h-[18px] bg-white rounded-full top-0.5 left-0.5 shadow transition-transform ${
          on ? "translate-x-5" : "translate-x-0"
        }`}
        style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }}
      />
    </div>
  );
}
