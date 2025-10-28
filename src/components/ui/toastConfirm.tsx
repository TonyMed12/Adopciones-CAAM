import { toast } from "sonner";

export function toastConfirm(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    const t = toast.custom(
      (id) => (
        <div className="flex flex-col items-center gap-4 bg-white rounded-2xl border border-gray-200 p-5 shadow-lg w-[320px] text-center">
          <p className="text-gray-800 text-[15px] font-medium">{message}</p>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                toast.dismiss(id);
                resolve(true);
              }}
              className="px-4 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-all shadow-sm"
            >
              Sí
            </button>

            <button
              onClick={() => {
                toast.dismiss(id);
                resolve(false);
              }}
              className="px-4 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium transition-all shadow-sm"
            >
              No
            </button>
          </div>
        </div>
      ),
      {
        duration: 10000,
        position: "top-center",
      }
    );
  });
}
