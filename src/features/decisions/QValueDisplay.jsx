import { memo } from "react";
import { Card, CardHead, CardBody, CardTitle } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { color, font, space } from "../../styles/tokens";

const ACTION_COLORS = {
  LONG: color.qPositive,
  SHORT: color.qNegative,
  HOLD: color.qNeutral,
};

const s = {
  row: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  label: {
    fontSize: font.size.xxs,
    width: 44,
    color: color.textDim,
    fontWeight: font.weight.semibold,
  },
  barTrack: {
    flex: 1,
    height: 14,
    background: color.borderSubtle,
    borderRadius: 3,
    overflow: "hidden",
    position: "relative",
  },
  barFill: (val, maxVal, actionColor) => ({
    position: "absolute",
    left: val < 0 ? `${50 - (Math.abs(val) / maxVal) * 50}%` : "50%",
    width: `${(Math.abs(val) / Math.max(maxVal, 0.01)) * 50}%`,
    height: "100%",
    background: actionColor,
    borderRadius: 3,
    transition: "all 0.3s",
  }),
  center: {
    position: "absolute",
    left: "50%",
    top: 0,
    bottom: 0,
    width: 1,
    background: color.textGhost,
  },
  valText: {
    fontSize: font.size.xxs,
    width: 40,
    textAlign: "right",
    fontWeight: font.weight.semibold,
  },
  stats: {
    display: "flex",
    gap: 12,
    marginTop: space.md,
    paddingTop: space.md,
    borderTop: `1px solid ${color.borderSubtle}`,
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
  },
  statLabel: {
    fontSize: font.size.xxs,
    color: color.textGhost,
    textTransform: "uppercase",
  },
  statVal: {
    fontSize: font.size.sm,
    fontWeight: font.weight.bold,
    color: color.textBright,
  },
};

function QValueDisplay({ decision }) {
  if (!decision) {
    return (
      <Card>
        <CardHead><CardTitle>Q-Values</CardTitle></CardHead>
        <CardBody>
          <div style={{ color: color.textFaint, fontSize: font.size.xs, textAlign: "center", padding: 20 }}>
            No agent selected
          </div>
        </CardBody>
      </Card>
    );
  }

  const { qValues, selectedAction, valueEstimate, advantageEstimate, policyEntropy } = decision;
  const maxQ = Math.max(Math.abs(qValues.LONG), Math.abs(qValues.SHORT), Math.abs(qValues.HOLD), 0.01);

  return (
    <Card>
      <CardHead>
        <CardTitle>Q-Values</CardTitle>
        <Badge color={ACTION_COLORS[selectedAction]} filled>
          Best: {selectedAction}
        </Badge>
      </CardHead>
      <CardBody>
        {["LONG", "SHORT", "HOLD"].map((action) => (
          <div key={action} style={s.row}>
            <span style={{ ...s.label, color: ACTION_COLORS[action] }}>{action}</span>
            <div style={s.barTrack}>
              <div style={s.center} />
              <div style={s.barFill(qValues[action], maxQ, ACTION_COLORS[action])} />
            </div>
            <span style={{ ...s.valText, color: qValues[action] >= 0 ? color.bull : color.bear }}>
              {qValues[action].toFixed(3)}
            </span>
          </div>
        ))}

        <div style={s.stats}>
          <div style={s.statItem}>
            <span style={s.statLabel}>V(s)</span>
            <span style={s.statVal}>{valueEstimate.toFixed(3)}</span>
          </div>
          <div style={s.statItem}>
            <span style={s.statLabel}>A(s,a)</span>
            <span style={s.statVal}>{advantageEstimate.toFixed(3)}</span>
          </div>
          <div style={s.statItem}>
            <span style={s.statLabel}>Entropy</span>
            <span style={{ ...s.statVal, color: color.entropy }}>{policyEntropy.toFixed(3)}</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default memo(QValueDisplay);
