import { color, radius, space, font } from "./tokens";

export const card = {
  background: color.surface,
  border: `1px solid ${color.border}`,
  borderRadius: radius.xxl,
  overflow: "hidden",
};

export const cardHead = {
  padding: `${space.md}px ${space.lg}px`,
  borderBottom: `1px solid ${color.border}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

export const cardBody = {
  padding: space.lg,
};

export const cardTitle = {
  fontSize: font.size.sm,
  fontWeight: font.weight.bold,
  textTransform: "uppercase",
  letterSpacing: ".08em",
  color: color.textGhost,
};

export const flexRow = {
  display: "flex",
  alignItems: "center",
};

export const flexBetween = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

export const table = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: font.size.sm,
};

export const th = {
  textAlign: "left",
  padding: `${space.md - 2}px ${space.md}px`,
  borderBottom: `1px solid ${color.border}`,
  color: color.textGhost,
  fontWeight: font.weight.semibold,
  fontSize: font.size.xxs,
  textTransform: "uppercase",
  letterSpacing: ".06em",
};

export const td = {
  padding: `${space.md - 3}px ${space.md}px`,
  borderBottom: `1px solid ${color.borderSubtle}`,
};

export const badge = (badgeColor, filled = false) => ({
  display: "inline-block",
  padding: "2px 6px",
  borderRadius: radius.sm,
  fontSize: font.size.xxs,
  fontWeight: font.weight.semibold,
  background: filled ? `${badgeColor}30` : `${badgeColor}15`,
  color: badgeColor,
  border: `1px solid ${badgeColor}30`,
});

export const pulse = {
  width: 5,
  height: 5,
  borderRadius: "50%",
  display: "inline-block",
  marginRight: 5,
};

export const tfBtn = (active) => ({
  padding: "3px 8px",
  borderRadius: radius.md - 1,
  border: active ? `1px solid ${color.bull}35` : `1px solid ${color.border}`,
  background: active ? `${color.bull}15` : "transparent",
  color: active ? color.bull : color.textDim,
  fontSize: font.size.xxs,
  cursor: "pointer",
  fontFamily: font.mono,
});

export const modeBtn = (active, modeColor) => ({
  padding: "3px 10px",
  borderRadius: radius.md - 1,
  border: active ? `1px solid ${modeColor}40` : `1px solid ${color.border}`,
  background: active ? `${modeColor}15` : "transparent",
  color: active ? modeColor : color.textDim,
  fontSize: font.size.xxs,
  fontWeight: font.weight.medium,
  cursor: "pointer",
  fontFamily: font.mono,
});

export const input = {
  background: "#0a0a12",
  border: `1px solid #1a1a2e`,
  borderRadius: radius.md - 1,
  padding: "3px 6px",
  color: color.textBright,
  fontSize: font.size.sm,
  width: 48,
  fontFamily: font.mono,
};

export const agentRow = (selected) => ({
  padding: "8px 10px",
  borderRadius: radius.lg,
  border: selected ? `1px solid ${color.bull}40` : "1px solid transparent",
  background: selected ? `${color.bull}08` : "transparent",
  cursor: "pointer",
  marginBottom: 4,
  transition: "all .15s",
});

export const infoBox = {
  padding: space.md,
  background: color.surfaceAlt,
  borderRadius: radius.lg,
  border: `1px solid ${color.border}`,
};
