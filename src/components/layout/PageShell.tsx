"use client";
import React from "react";

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="max-w-[1100px] mx-auto mt-6 px-4 text-[#2b1b12] pb-14">
      {children}
    </main>
  );
}

