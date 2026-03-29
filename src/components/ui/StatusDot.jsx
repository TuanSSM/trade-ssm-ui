import * as mixins from "../../styles/mixins";

export default function StatusDot({ color, animate = false }) {
  return (
    <span
      style={{
        ...mixins.pulse,
        background: color,
        ...(animate ? { animation: "pulse 1.5s infinite" } : {}),
      }}
    />
  );
}
