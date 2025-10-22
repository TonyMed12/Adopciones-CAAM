"use client";
import React from "react";

export default function PageHead({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 mb-5">
      <div className="flex flex-col gap-1">
        <h1 className="m-0 font-extrabold text-[60px] leading-tight tracking-[0.2px] text-[#8B4513]">
          {title}
        </h1>
        {subtitle ? <p className="m-0 text-[#7a5c49]">{subtitle}</p> : null}
      </div>
      {right}
    </div>
  );
}
