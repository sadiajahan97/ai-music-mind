"use client";

import { AppNav } from "./AppNav";

export function PhoneShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center min-h-screen bg-bg-deep">
      <div className="w-full max-w-[393px] min-h-screen bg-bg-dark relative overflow-hidden flex flex-col">
        {children}
        <AppNav />
      </div>
    </div>
  );
}
