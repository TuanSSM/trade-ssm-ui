import { AGGR_SCRIPTS } from "../../constants";
import { Card, CardHead, CardBody, CardTitle } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { color, font } from "../../styles/tokens";

function signalColor(signal) {
  if (signal === "LONG") return color.bull;
  if (signal === "SHORT") return color.bear;
  if (signal === "BOTH") return color.purple;
  return color.textMuted;
}

export default function CommunityScripts() {
  return (

    <Card>
      <CardHead>
        <CardTitle>aggr.trade Community Scripts</CardTitle>
        <span style={{ fontSize: font.size.xxs, color: color.textMuted }}>
          {AGGR_SCRIPTS.length} scripts loaded
        </span>
      </CardHead>
      <CardBody style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 8 }}>
        {AGGR_SCRIPTS.map((sc, i) => (
          <div
            key={i}
            style={{
              padding: 10,
              background: color.surfaceAlt,
              border: `1px solid ${color.border}`,
              borderRadius: 6,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontWeight: 700, fontSize: font.size.sm, color: "#c0c0c0" }}>{sc.name}</span>
              <Badge color={signalColor(sc.signal)}>{sc.signal}</Badge>
            </div>
            <div style={{ fontSize: font.size.xxs, color: color.textFaint, marginBottom: 4 }}>by {sc.author}</div>
            <div style={{ fontSize: font.size.xs, color: "#777", marginBottom: 6, lineHeight: 1.5 }}>{sc.desc}</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: font.size.xxs, color: color.textFaint }}>
              <span>\u2B07 {sc.installs.toLocaleString()}</span>
              <span>\u2605 {sc.rating}</span>
            </div>
            <div style={{ marginTop: 6, height: 2, background: color.border, borderRadius: 1 }}>
              <div
                style={{
                  height: 2,
                  borderRadius: 1,
                  background: signalColor(sc.signal),
                  width: `${(sc.rating / 5) * 100}%`,
                  opacity: 0.7,
                }}
              />
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
