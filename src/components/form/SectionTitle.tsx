// SectionTitle.tsx
"use client";

interface SectionTitleProps {
  title: string;
}

export function SectionTitle({ title }: SectionTitleProps) {
  return (
    <h3 className="text-lg font-extrabold text-[#8B4513] tracking-tight mb-2">
      {title}
    </h3>
  );
}
