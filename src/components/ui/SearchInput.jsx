import { color, font } from "../../styles/tokens";

export default function SearchInput({ value, onChange, placeholder = "Search..." }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
      style={{
        background: "#0a0a12",
        border: `1px solid #1a1a2e`,
        borderRadius: 4,
        padding: "4px 8px",
        color: color.textBright,
        fontSize: font.size.xs,
        fontFamily: font.mono,
        width: 140,
        outline: "none",
      }}
    />
  );
}
