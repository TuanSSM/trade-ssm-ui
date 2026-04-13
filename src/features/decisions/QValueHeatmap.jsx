import { useState, memo } from "react";
import { Card, CardHead, CardBody, CardTitle } from "../../components/ui/Card";
import { color, font, space } from "../../styles/tokens";
import * as mixins from "../../styles/mixins";

const ACTION_COLORS = {
  LONG: color.qPositive,
  SHORT: color.qNegative,
  HOLD: color.qNeutral,
};

function cellColor(val) {
  if (val > 0) {
    const intensity = Math.min(val / 0.8, 1);
    const r = Math.floor(0 + intensity * 0);
    const g = Math.floor(40 + intensity * 192);
    const b = Math.floor(40 + intensity * 117);
    return `rgb(${r},${g},${b})`;
  } else {
    const intensity = Math.min(Math.abs(val) / 0.8, 1);
    const r = Math.floor(40 + intensity * 215);
    const g = Math.floor(20 + intensity * 53);
    const b = Math.floor(30 + intensity * 88);
    return `rgb(${r},${g},${b})`;
  }
}

function QValueHeatmap({ heatmap }) {
  const [selectedAction, setSelectedAction] = useState("LONG");

  if (!heatmap) {
    return (
      <Card>
        <CardHead><CardTitle>Q-Value Heatmap</CardTitle></CardHead>
        <CardBody>
          <div style={{ color: color.textFaint, fontSize: font.size.xs, textAlign: "center", padding: 20 }}>
            No data
          </div>
        </CardBody>
      </Card>
    );
  }

  const { priceAxis, timeAxis, grid, bestAction } = heatmap;
  const data = grid[selectedAction] || [];

  return (
    <Card>
      <CardHead>
        <CardTitle>Q-Value Heatmap</CardTitle>
        <div style={{ display: "flex", gap: 3 }}>
          {heatmap.actions.map((action) => (
            <button
              key={action}
              onClick={() => setSelectedAction(action)}
              style={{
                ...mixins.tfBtn(selectedAction === action),
                color: selectedAction === action ? ACTION_COLORS[action] : color.textDim,
                borderColor: selectedAction === action ? ACTION_COLORS[action] + "40" : color.border,
              }}
            >
              {action}
            </button>
          ))}
        </div>
      </CardHead>
      <CardBody>
        <div style={{ display: "flex", gap: 4 }}>
          {/* Y-axis labels (price) */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", paddingRight: 4 }}>
            {priceAxis.slice().reverse().map((p) => (
              <div key={p} style={{ fontSize: 7, color: color.textGhost, height: 16, display: "flex", alignItems: "center" }}>
                {(p / 1000).toFixed(1)}k
              </div>
            ))}
          </div>

          {/* Grid */}
          <div style={{ flex: 1, overflow: "auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${timeAxis.length}, 1fr)`, gap: 1 }}>
              {data.slice().reverse().flatMap((row, pi) =>
                row.map((val, ti) => (
                  <div
                    key={`${pi}-${ti}`}
                    style={{
                      height: 16,
                      background: cellColor(val),
                      borderRadius: 1,
                      position: "relative",
                      cursor: "default",
                    }}
                    title={`Price: $${priceAxis[priceAxis.length - 1 - pi]}, T: ${ti}, Q: ${val.toFixed(3)}, Best: ${bestAction[priceAxis.length - 1 - pi][ti]}`}
                  >
                    {bestAction[priceAxis.length - 1 - pi]?.[ti] === selectedAction && (
                      <div style={{
                        position: "absolute",
                        inset: 0,
                        border: `1px solid ${color.textBright}40`,
                        borderRadius: 1,
                      }} />
                    )}
                  </div>
                ))
              )}
            </div>

            {/* X-axis */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 4,
            }}>
              <span style={{ fontSize: 7, color: color.textGhost }}>t=0</span>
              <span style={{ fontSize: 7, color: color.textGhost }}>t={timeAxis.length - 1}</span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginTop: space.md,
          justifyContent: "center",
        }}>
          <div style={{
            width: 100,
            height: 8,
            borderRadius: 4,
            background: `linear-gradient(90deg, ${color.qNegative}, ${color.qNeutral}, ${color.qPositive})`,
          }} />
          <span style={{ fontSize: font.size.xxs, color: color.textGhost }}>
            -Q \u2192 +Q
          </span>
        </div>
      </CardBody>
    </Card>
  );
}

export default memo(QValueHeatmap);
