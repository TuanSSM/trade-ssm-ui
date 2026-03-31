import { memo, useState } from "react";
import { color, font } from "../../styles/tokens";
import { useInterval } from "../../hooks/useInterval";

const s = {
  footer: {
    padding: "10px 16px",
    borderTop: `1px solid ${color.borderSubtle}`,
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 6,
    fontSize: font.size.xxs,
    color: color.textDark,
  },
};

function Footer({ agentCount, positionCount, exchangeCount, tick, envEMA, envMult }) {
  const [time, setTime] = useState(() => new Date().toLocaleTimeString());

  useInterval(() => setTime(new Date().toLocaleTimeString()), 1000);

  return (
    <footer style={s.footer} role="contentinfo">
      <span>RIFEBTCFull v3.0 \u00B7 Strategy Manager</span>
      <span>
        {agentCount} Agents \u00B7 {positionCount} Positions \u00B7 {exchangeCount} Exchanges
      </span>
      <span>
        Tick #{tick} \u00B7 EMA({envEMA}) \u00B1 ATR\u00D7{envMult} \u00B7{" "}
        <time dateTime={new Date().toISOString()}>{time}</time>
      </span>
    </footer>
  );
}

export default memo(Footer);
