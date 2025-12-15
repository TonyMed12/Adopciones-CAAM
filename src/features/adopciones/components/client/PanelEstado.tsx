"use client";

import React from "react";

interface Props {
  icon: React.ReactNode;
  title: string;
  desc: string;
  tone?: "info" | "danger";
}

export default function PanelEstado({
  icon,
  title,
  desc,
  tone = "info",
}: Props) {
  const t =
    tone === "danger"
      ? { border: "#f2d6d6", bg: "#fff5f5", iconBg: "#b42318" }
      : { border: "#eadacb", bg: "#fff4e7", iconBg: "#BC5F36" };

  return (
    <section
      className="rounded-2xl p-5 shadow-sm"
      style={{ border: `1px solid ${t.border}`, background: t.bg }}
    >
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 grid h-9 w-9 place-items-center rounded-full text-white"
          style={{ background: t.iconBg }}
        >
          {icon}
        </span>
        <div className="flex-1">
          <h3 className="text-sm font-extrabold text-[#2b1b12]">{title}</h3>
          <p className="mt-1 text-sm text-[#7a5c49]">{desc}</p>
        </div>
      </div>
    </section>
  );
}
