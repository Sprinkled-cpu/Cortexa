import { createContext, useContext, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  function showToast(message, type = "info", duration = 2600) {
    const id = crypto.randomUUID();

    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed bottom-5 right-5 z-[9999] space-y-3">
        {toasts.map((t) => (
          <ToastCard key={t.id} type={t.type} message={t.message} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

function ToastCard({ type, message }) {
  const styles = {
    success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-200",
    error: "border-red-500/20 bg-red-500/10 text-red-200",
    info: "border-gray-700 bg-gray-900/60 text-gray-200",
  };

  return (
    <div
      className={`min-w-[260px] max-w-[360px] rounded-2xl border px-4 py-3 shadow-xl backdrop-blur
      animate-[toastIn_200ms_ease-out] ${styles[type] || styles.info}`}
    >
      <p className="text-sm font-semibold">{message}</p>
    </div>
  );
}
