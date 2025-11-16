export function showSoftToast(message: string) {
    const toast = document.createElement("div");

    toast.textContent = message;

    toast.className = `
    fixed bottom-6 left-1/2 -translate-x-1/2 
    bg-[#fff5f3] text-[#8b4513] 
    border border-[#e8c9b8]
    px-4 py-2 rounded-xl shadow-lg 
    text-sm font-medium
    opacity-0 transition-all duration-300
    z-[99999]
  `;

    document.body.appendChild(toast);

    // animate in
    requestAnimationFrame(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translate(-50%, 0)";
    });

    // remove after 3 sec
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translate(-50%, 10px)";

        setTimeout(() => toast.remove(), 300);
    }, 2500);
}
