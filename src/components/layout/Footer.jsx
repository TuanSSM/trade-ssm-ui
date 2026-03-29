import { color, font } from "../../styles/tokens";

const s = {
  footer: {
    padding: "10px 16px",
    borderTop: `1px solid ${color.borderSubtle}`,
    display: "flex",
    justifyContent: "space-between",
    fontSize: font.size.xxs,
    color: color.textDark,
  },
};

export default function Footer({ agentCount, positionCount, exchangeCount, tick, envEMA, envMult }) {
  return (
    <div style={s.footer}>
      <span>RIFEBTCFull v3.0 \u00B7 Strategy Manager</span>
      <span>
        {agentCount} Agents \u00B7 {positionCount} Positions \u00B7 {exchangeCount} Exchanges
      </span>
      <span>
        Tick #{tick} \u00B7 EMA({envEMA}) \u00B1 ATR\u00D7{envMult} \u00B7 {new Date().toLocaleTimeString()}
      </span>
    </div>
  );
}
