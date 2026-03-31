import { createContext, useContext, useState, useCallback } from "react";
import { color, font } from "../../styles/tokens";

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const colors = {
    success: color.bull,
    error: color.bear,
    warning: color.orange,
    info: color.cyan,
  };

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div
        style={{
          position: "fixed",
          top: 12,
          right: 12,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: 6,
          pointerEvents: "none",
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              padding: "8px 14px",
              borderRadius: 6,
              background: `${colors[t.type] || color.cyan}20`,
              border: `1px solid ${colors[t.type] || color.cyan}40`,
              color: colors[t.type] || color.cyan,
              fontSize: font.size.xs,
              fontFamily: font.mono,
              fontWeight: 600,
              animation: "slideIn .3s ease",
              pointerEvents: "auto",
              maxWidth: 320,
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
