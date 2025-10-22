"use client";
import React from "react";

type Variant = "primary" | "ghost";
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant };

export default function Button({ variant = "primary", className = "", ...rest }: Props) {
  const base =
    "inline-flex items-center gap-2 rounded-xl px-4 py-3 text-[16px] font-extrabold border transition shadow-[0_6px_14px_rgba(0,0,0,.12)]";
  const stylePrimary = "bg-[#8B4513] text-white border-black/10 hover:brightness-110";
  const styleGhost = "bg-white text-[#D97706] border-transparent shadow-[0_6px_14px_rgba(43,27,18,.12)] hover:brightness-105";
  const styles = variant === "ghost" ? styleGhost : stylePrimary;

  return <button className={`${base} ${styles} ${className}`} {...rest} />;
}
