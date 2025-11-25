// CAAMSwitch.tsx
"use client";

interface CAAMSwitchProps {
  checked: boolean;
  onChange: (value: boolean) => void;
}

export function CAAMSwitch({ checked, onChange }: CAAMSwitchProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition
        ${checked ? "bg-[#FF8414]" : "bg-[#d9cbbc]"}
      `}
    >
      <span
        className={`
          inline-block h-5 w-5 transform rounded-full bg-white transition
          ${checked ? "translate-x-5" : "translate-x-1"}
        `}
      />
    </button>
  );
}
