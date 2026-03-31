import { color, font } from "../../styles/tokens";

export default function EmptyState({ icon = "\u25C8", title, message }) {
  return (
    <div style={{ textAlign: "center", padding: "40px 20px" }}>
      <div style={{ fontSize: 28, color: color.textDark, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: font.size.sm, fontWeight: 600, color: color.textDim, marginBottom: 4 }}>{title}</div>
      {message && <div style={{ fontSize: font.size.xs, color: color.textFaint }}>{message}</div>}
    </div>
  );
}
