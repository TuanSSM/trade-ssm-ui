import { EXCHANGES } from "../../constants";
import { Card, CardHead, CardBody, CardTitle } from "../../components/ui/Card";
import { fmt, fmtP } from "../../utils";
import { color, font } from "../../styles/tokens";

export default function ExchangeExposure({ positions }) {
  return (
    <Card style={{ gridColumn: "1/5" }}>
      <CardHead>
        <CardTitle>Exchange Exposure</CardTitle>
      </CardHead>
      <CardBody style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {EXCHANGES.map((ex) => {
          const ep = positions.filter((p) => p.exchange === ex);
          const el = ep.filter((p) => p.side === "LONG").reduce((a, p) => a + p.size * p.current, 0);
          const es = ep.filter((p) => p.side === "SHORT").reduce((a, p) => a + p.size * p.current, 0);
          const tot = el + es || 1;
          const epnl = ep.reduce((a, p) => a + p.pnl, 0);
          return (
            <div
              key={ex}
              style={{
                flex: "1 1 120px",
                background: color.surfaceAlt,
                border: `1px solid ${color.border}`,
                borderRadius: 6,
                padding: 10,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: font.size.sm, color: "#aaa", marginBottom: 5 }}>{ex}</div>
              <div style={{ display: "flex", height: 3, borderRadius: 2, overflow: "hidden", marginBottom: 5 }}>
                <div style={{ width: `${(el / tot) * 100}%`, background: color.bull }} />
                <div style={{ width: `${(es / tot) * 100}%`, background: color.bear }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: font.size.xxs }}>
                <span style={{ color: color.bull }}>L:${fmt(el)}</span>
                <span style={{ color: color.bear }}>S:${fmt(es)}</span>
              </div>
              <div
                style={{
                  textAlign: "center",
                  marginTop: 3,
                  fontSize: font.size.md,
                  fontWeight: 700,
                  color: epnl >= 0 ? color.bull : color.bear,
                }}
              >
                {fmtP(epnl)}
              </div>
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
}
