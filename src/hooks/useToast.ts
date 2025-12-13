"use client";

type ToastVariant = "default" | "warning" | "error" | "success";

const VARIANTS: Record<
    ToastVariant,
    { bg: string; text: string; border: string }
> = {
    default: {
        bg: "#ffffff",
        text: "#333333",
        border: "#e5e7eb",
    },
    warning: {
        bg: "#fff7ed",
        text: "#9a3412",
        border: "#fed7aa",
    },
    error: {
        bg: "#fff5f5",
        text: "#7f1d1d",
        border: "#fecaca",
    },
    success: {
        bg: "#f0fdf4",
        text: "#166534",
        border: "#bbf7d0",
    },
};

export function useToast() {
    function show(
        mensaje: string,
        variant: ToastVariant = "default"
    ) {
        const { bg, text, border } = VARIANTS[variant];

        const toast = document.createElement("div");
        toast.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bg};
        color: ${text};
        border: 1px solid ${border};
        border-radius: 10px;
        padding: 16px 22px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        font-family: sans-serif;
        font-size: 14px;
        max-width: 320px;
        z-index: 9999;
      ">
        ${mensaje}
      </div>
    `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 5000);
    }

    return { show };
}
