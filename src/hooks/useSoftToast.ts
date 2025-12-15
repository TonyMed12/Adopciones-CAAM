export function useSoftToast() {
    function show(message: string) {
        const alerta = document.createElement("div");

        alerta.textContent = message;
        alerta.className = `
      fixed bottom-6 left-1/2 -translate-x-1/2
      bg-[#fffaf4] text-[#8b4513]
      border border-[#e8c9b8]
      font-semibold px-6 py-3
      rounded-xl shadow-lg
      z-[99999] animate-fadeIn
    `;

        document.body.appendChild(alerta);

        setTimeout(() => {
            alerta.classList.add("opacity-0", "transition-opacity", "duration-500");
            setTimeout(() => alerta.remove(), 600);
        }, 2500);
    }

    return { show };
}
