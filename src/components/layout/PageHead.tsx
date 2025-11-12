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
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 text-center sm:text-left">
      <div className="flex flex-col gap-1 w-full">
        <h1
          className="
            m-0 font-extrabold 
            text-3xl sm:text-4xl md:text-5xl 
            leading-tight tracking-tight 
            text-[#8B4513]
          "
        >
          {title}
        </h1>

        {subtitle && (
          <p className="m-0 text-base sm:text-lg text-[#7a5c49]">
            {subtitle}
          </p>
        )}
      </div>

      {/* Botón o componente lateral */}
      {right && <div className="mt-3 sm:mt-0">{right}</div>}
    </div>
  );
}
