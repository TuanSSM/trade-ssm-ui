import { memo, useMemo } from "react";
import { Card, CardHead, CardBody, CardTitle } from "../../components/ui/Card";
import { color, font } from "../../styles/tokens";

const ACTION_COLORS = {
  LONG: color.qPositive,
  SHORT: color.qNegative,
  HOLD: color.qNeutral,
};

const SIZE = 120;
const CENTER = SIZE / 2;
const RADIUS = 48;
const INNER_RADIUS = 28;

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx, cy, r, ir, startAngle, endAngle) {
  const s1 = polarToCartesian(cx, cy, r, endAngle);
  const s2 = polarToCartesian(cx, cy, r, startAngle);
  const s3 = polarToCartesian(cx, cy, ir, startAngle);
  const s4 = polarToCartesian(cx, cy, ir, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return [
    "M", s1.x, s1.y,
    "A", r, r, 0, largeArc, 0, s2.x, s2.y,
    "L", s3.x, s3.y,
    "A", ir, ir, 0, largeArc, 1, s4.x, s4.y,
    "Z",
  ].join(" ");
}

function ActionProbChart({ probabilities, selectedAction }) {
  const segments = useMemo(() => {
    if (!probabilities) return [];
    const actions = ["LONG", "SHORT", "HOLD"];
    let startAngle = 0;
    return actions.map((action) => {
      const pct = probabilities[action] || 0;
      const sweep = pct * 360;
      const seg = {
        action,
        path: arcPath(CENTER, CENTER, RADIUS, INNER_RADIUS, startAngle, startAngle + Math.max(sweep, 0.5)),
        color: ACTION_COLORS[action],
        pct,
        midAngle: startAngle + sweep / 2,
        isSelected: action === selectedAction,
      };
      startAngle += sweep;
      return seg;
    });
  }, [probabilities, selectedAction]);

  if (!probabilities) {
    return (
      <Card>
        <CardHead><CardTitle>Action Distribution</CardTitle></CardHead>
        <CardBody>
          <div style={{ color: color.textFaint, fontSize: font.size.xs, textAlign: "center", padding: 20 }}>
            No data
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHead><CardTitle>Action Distribution</CardTitle></CardHead>
      <CardBody style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label="Action probability chart">
          {segments.map((seg) => (
            <path
              key={seg.action}
              d={seg.path}
              fill={seg.color}
              opacity={seg.isSelected ? 1 : 0.6}
              stroke={seg.isSelected ? color.textBright : color.bg}
              strokeWidth={seg.isSelected ? 2 : 1}
            />
          ))}
          <text x={CENTER} y={CENTER - 4} textAnchor="middle" fill={color.textBright} fontSize={14} fontWeight={700} fontFamily={font.mono}>
            {selectedAction}
          </text>
          <text x={CENTER} y={CENTER + 10} textAnchor="middle" fill={color.textDim} fontSize={9} fontFamily={font.mono}>
            {((probabilities[selectedAction] || 0) * 100).toFixed(0)}%
          </text>
        </svg>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {["LONG", "SHORT", "HOLD"].map((action) => (
            <div key={action} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: ACTION_COLORS[action],
                opacity: action === selectedAction ? 1 : 0.6,
              }} />
              <span style={{
                fontSize: font.size.xxs,
                color: action === selectedAction ? color.textBright : color.textDim,
                fontWeight: action === selectedAction ? 700 : 400,
              }}>
                {action}: {((probabilities[action] || 0) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

export default memo(ActionProbChart);
