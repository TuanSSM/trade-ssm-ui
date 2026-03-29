import { color, font } from "../../styles/tokens";
import * as mixins from "../../styles/mixins";
import { fmtP } from "../../utils";
import Badge from "../ui/Badge";
import StatusDot from "../ui/StatusDot";

const s = {
  header: {
    padding: "12px 16px",
    borderBottom: `1px solid ${color.borderFaint}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: { display: "flex", alignItems: "center", gap: 8 },
  logoBox: {
    width: 30,
    height: 30,
    background: "linear-gradient(135deg,#00e89d,#06b6d4)",
    borderRadius: 7,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: 14,
    color: "#08080d",
  },
};

export default function Header({ price, priceChange, agentCount }) {
  return (
    <div style={s.header}>
      <div style={s.logo}>
        <div style={s.logoBox}>R</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: font.size.lg, color: color.textBright }}>
            RIFE<span style={{ color: color.bull }}>BTC</span>
          </div>
          <div style={{ fontSize: font.size.xxs, color: color.textGhost }}>
            Strategy Manager \u00B7 {agentCount} Agents
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: font.size.xxl, fontWeight: 700, color: color.textBright }}>
            ${price.toFixed(2)}
          </div>
          <Badge color={priceChange >= 0 ? color.bull : color.bear}>{fmtP(priceChange)}%</Badge>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <StatusDot color={color.bull} animate />
          <span style={{ fontSize: font.size.xs, color: color.bull }}>LIVE</span>
        </div>
      </div>
    </div>
  );
}
