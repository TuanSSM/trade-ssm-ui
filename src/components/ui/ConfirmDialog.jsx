import { color, font } from "../../styles/tokens";

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmLabel = "Confirm", danger = false }) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9998,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: "#0c0c16",
          border: `1px solid ${color.border}`,
          borderRadius: 9,
          padding: 20,
          minWidth: 300,
          maxWidth: 400,
          fontFamily: font.mono,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: font.size.lg, fontWeight: 700, color: color.textBright, marginBottom: 8 }}>
          {title}
        </div>
        <div style={{ fontSize: font.size.xs, color: color.textDim, marginBottom: 16, lineHeight: 1.6 }}>
          {message}
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button
            onClick={onCancel}
            style={{
              padding: "6px 14px",
              borderRadius: 5,
              border: `1px solid ${color.border}`,
              background: "transparent",
              color: color.textDim,
              fontSize: font.size.xs,
              cursor: "pointer",
              fontFamily: font.mono,
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "6px 14px",
              borderRadius: 5,
              border: "none",
              background: danger ? color.bear : color.bull,
              color: "#fff",
              fontSize: font.size.xs,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: font.mono,
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
