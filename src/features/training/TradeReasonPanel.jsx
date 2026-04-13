import { memo } from "react";
import { Card, CardHead, CardBody, CardTitle } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { color, font, space, radius } from "../../styles/tokens";

const s = {
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "4px 0",
    borderBottom: `1px solid ${color.borderSubtle}`,
  },
  label: {
    fontSize: font.size.xxs,
    color: color.textGhost,
    textTransform: "uppercase",
  },
  val: {
    fontSize: font.size.sm,
    color: color.textBright,
    fontWeight: font.weight.semibold,
  },
  qBar: (val, maxVal) => ({
    height: 8,
    width: `${Math.max(5, (Math.abs(val) / Math.max(maxVal, 0.01)) * 100)}%`,
    background: val >= 0 ? color.qPositive : color.qNegative,
    borderRadius: 4,
    transition: "width 0.3s",
  }),
  section: {
    marginTop: space.md,
    padding: space.md,
    background: color.surfaceAlt,
    borderRadius: radius.lg,
    border: `1px solid ${color.border}`,
  },
  reason: {
    fontSize: font.size.xs,
    color: color.text,
    lineHeight: 1.5,
    fontStyle: "italic",
  },
};

function TradeReasonPanel({ trade }) {
  if (!trade) {
    return (
      <Card>
        <CardHead><CardTitle>Trade Detail</CardTitle></CardHead>
        <CardBody>
          <div style={{ color: color.textFaint, fontSize: font.size.xs, textAlign: "center", padding: 20 }}>
            Select a trade from the table to view details
          </div>
        </CardBody>
      </Card>
    );
  }

  const qValues = trade.alternativeQValues || {};
  const maxQ = Math.max(Math.abs(qValues.LONG || 0), Math.abs(qValues.SHORT || 0), Math.abs(qValues.HOLD || 0), 0.01);

  return (
    <Card>
      <CardHead>
        <CardTitle>Trade Detail</CardTitle>
        <Badge color={trade.pnl >= 0 ? color.bull : color.bear} filled>
          {trade.pnl >= 0 ? "+" : ""}{trade.pnl.toFixed(2)} ({trade.pnlPct.toFixed(1)}%)
        </Badge>
      </CardHead>
      <CardBody>
        <div style={s.row}>
          <span style={s.label}>ID</span>
          <span style={s.val}>{trade.id}</span>
        </div>
        <div style={s.row}>
          <span style={s.label}>Agent</span>
          <span style={s.val}>{trade.agentId}</span>
        </div>
        <div style={s.row}>
          <span style={s.label}>Side</span>
          <Badge color={trade.side === "LONG" ? color.bull : color.bear} filled>{trade.side}</Badge>
        </div>
        <div style={s.row}>
          <span style={s.label}>Entry</span>
          <span style={s.val}>${trade.entryPrice.toLocaleString()}</span>
        </div>
        <div style={s.row}>
          <span style={s.label}>Exit</span>
          <span style={s.val}>${trade.exitPrice.toLocaleString()}</span>
        </div>
        <div style={s.row}>
          <span style={s.label}>Exit Reason</span>
          <Badge color={trade.exitReason === "TP" ? color.bull : trade.exitReason === "SL" ? color.bear : color.orange}>
            {trade.exitReason}
          </Badge>
        </div>
        <div style={s.row}>
          <span style={s.label}>Confidence</span>
          <span style={s.val}>{(trade.confidence * 100).toFixed(0)}%</span>
        </div>
        <div style={s.row}>
          <span style={s.label}>Reward</span>
          <span style={{ ...s.val, color: trade.reward >= 0 ? color.reward : color.loss }}>
            {trade.reward >= 0 ? "+" : ""}{trade.reward}
          </span>
        </div>

        <div style={s.section}>
          <div style={{ ...s.label, marginBottom: 6 }}>Entry Reason</div>
          <div style={s.reason}>{trade.reason}</div>
        </div>

        <div style={s.section}>
          <div style={{ ...s.label, marginBottom: 8 }}>Q-Values at Entry</div>
          {["LONG", "SHORT", "HOLD"].map((action) => (
            <div key={action} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: font.size.xxs, color: color.textDim, width: 40 }}>{action}</span>
              <div style={{ flex: 1, background: color.borderSubtle, borderRadius: 4, height: 8 }}>
                <div style={s.qBar(qValues[action] || 0, maxQ)} />
              </div>
              <span style={{ fontSize: font.size.xxs, color: color.textDim, width: 32, textAlign: "right" }}>
                {(qValues[action] || 0).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

export default memo(TradeReasonPanel);
