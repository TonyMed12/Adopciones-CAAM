// FormSection.tsx
"use client";

import { SectionTitle } from "./SectionTitle";

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  spacing?: boolean;
}

export function FormSection({ title, children, spacing = true }: FormSectionProps) {
  return (
    <section className={`${spacing ? "mb-8" : ""}`}>
      <SectionTitle title={title} />
      <div className="mt-3 space-y-4">{children}</div>
    </section>
  );
}
