import { Card, CardBody } from "../../components/ui/Card";
import { fmt, fmtP } from "../../utils";
import { color, font } from "../../styles/tokens";

export default function MetricCards({ net, hedgeRatio, totalPnL, positionCount, agents }) {
  const activeCount = agents.filter((a) => a.active).length;
  const metrics = [
    {
      l: "Net Exposure",
      v: `$${fmt(Math.abs(net))}`,
      sub: net >= 0 ? "LONG BIAS" : "SHORT BIAS",
      c: net >= 0 ? color.bull : color.bear,
    },
    {
      l: "Hedge Ratio",
      v: `${(hedgeRatio * 100).toFixed(1)}%`,
      sub: hedgeRatio > 0.7 ? "WELL HEDGED" : "EXPOSED",
      c: hedgeRatio > 0.7 ? color.bull : color.orange,
    },
    {
      l: "Total PnL",
      v: `$${fmtP(totalPnL)}`,
      sub: `${positionCount} POS`,
      c: totalPnL >= 0 ? color.bull : color.bear,
    },
    {
      l: "Active Agents",
      v: `${activeCount}/${agents.length}`,
      sub: `${agents.filter((a) => a.mode === "AGGRESSIVE" && a.active).length} AGGR`,
      c: color.cyan,
    },
  ];

  return (
    <>
      {metrics.map((m, i) => (
        <Card key={i}>
          <CardBody style={{ textAlign: "center" }}>
            <div style={{ fontSize: font.size.xxs, color: color.textGhost, textTransform: "uppercase", letterSpacing: ".08em" }}>
              {m.l}
            </div>
            <div style={{ fontSize: font.size.xxxl, fontWeight: 700, color: m.c, margin: "6px 0 2px" }}>{m.v}</div>
            <div style={{ fontSize: font.size.xxs, color: m.c, opacity: 0.6 }}>{m.sub}</div>
          </CardBody>
        </Card>
      ))}
    </>
  );
}
