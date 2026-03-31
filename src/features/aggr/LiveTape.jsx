import { Card, CardHead, CardBody, CardTitle } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import StatusDot from "../../components/ui/StatusDot";
import { color, font } from "../../styles/tokens";
import * as mixins from "../../styles/mixins";

export default function LiveTape({ trades, connected, setConnected }) {
  return (
    <Card>
      <CardHead>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <CardTitle>aggr.trade Live Tape</CardTitle>
          <StatusDot color={connected ? color.bull : color.bear} animate={connected} />
          <span style={{ fontSize: font.size.xxs, color: connected ? color.bull : color.bear }}>
            {connected ? "CONNECTED" : "PAUSED"}
          </span>
        </div>
        <button style={{ ...mixins.tfBtn(false), fontSize: font.size.xxs }} onClick={() => setConnected(!connected)}>
          {connected ? "\u275A\u275A Pause" : "\u25B6 Resume"}
        </button>
      </CardHead>
      <CardBody style={{ maxHeight: 340, overflowY: "auto" }}>
        <table style={mixins.table}>
          <thead>
            <tr>
              {["Time", "Price", "Size", "Side", "Exchange", ""].map((h) => (
                <th key={h} style={mixins.th}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...trades]
              .reverse()
              .slice(0, 25)
              .map((t, i) => (
                <tr
                  key={i}
                  className="anim-row"
                  style={{ background: t.liquidation ? "#ff497610" : "transparent" }}
                >
                  <td style={{ ...mixins.td, fontSize: font.size.xxs, color: color.textGhost }}>
                    {new Date(t.t).toLocaleTimeString()}
                  </td>
                  <td style={{ ...mixins.td, fontWeight: 600, color: "#ccc" }}>${t.price.toFixed(2)}</td>
                  <td
                    style={{
                      ...mixins.td,
                      fontWeight: t.size > 2 ? 700 : 400,
                      color: t.size > 2 ? color.orange : color.textDim,
                    }}
                  >
                    {t.size}
                  </td>
                  <td style={mixins.td}>
                    <Badge color={t.side === "buy" ? color.bull : color.bear}>{t.side.toUpperCase()}</Badge>
                  </td>
                  <td style={{ ...mixins.td, fontSize: font.size.xxs, color: color.textFaint }}>{t.exchange}</td>
                  <td style={mixins.td}>
                    {t.liquidation ? (
                      <Badge color={color.bear} filled>
                        LIQ
                      </Badge>
                    ) : null}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
}
