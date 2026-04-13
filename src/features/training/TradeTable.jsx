import { useState, useMemo, memo } from "react";
import { Card, CardHead, CardBody, CardTitle } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { color, font } from "../../styles/tokens";
import * as mixins from "../../styles/mixins";

const COLUMNS = [
  { key: "id", label: "ID", w: 60 },
  { key: "agentId", label: "Agent", w: 100 },
  { key: "side", label: "Side", w: 55 },
  { key: "entryPrice", label: "Entry", w: 80 },
  { key: "exitPrice", label: "Exit", w: 80 },
  { key: "pnl", label: "PnL", w: 70 },
  { key: "pnlPct", label: "PnL%", w: 55 },
  { key: "exitReason", label: "Exit", w: 55 },
  { key: "reward", label: "Reward", w: 55 },
];

function TradeTable({ trades, selectedId, onSelect }) {
  const [sortKey, setSortKey] = useState("id");
  const [sortDir, setSortDir] = useState(-1);

  const sorted = useMemo(() => {
    return [...trades].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (typeof av === "number") return (av - bv) * sortDir;
      return String(av).localeCompare(String(bv)) * sortDir;
    });
  }, [trades, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => d * -1);
    else { setSortKey(key); setSortDir(-1); }
  };

  return (
    <Card>
      <CardHead>
        <CardTitle>Trade History</CardTitle>
        <span style={{ fontSize: font.size.xxs, color: color.textFaint }}>
          {trades.length} trades
        </span>
      </CardHead>
      <CardBody style={{ padding: 0, overflowX: "auto" }}>
        <table style={mixins.table} role="grid" aria-label="Trade history">
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  style={{ ...mixins.th, width: col.w, cursor: "pointer", userSelect: "none" }}
                  onClick={() => handleSort(col.key)}
                  aria-sort={sortKey === col.key ? (sortDir === 1 ? "ascending" : "descending") : "none"}
                >
                  {col.label} {sortKey === col.key ? (sortDir === 1 ? "\u25B2" : "\u25BC") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.slice(0, 50).map((t) => (
              <tr
                key={t.id}
                onClick={() => onSelect(t)}
                style={{
                  cursor: "pointer",
                  background: selectedId === t.id ? `${color.bull}10` : "transparent",
                  transition: "background .15s",
                }}
                className="anim-row"
              >
                <td style={mixins.td}>
                  <span style={{ fontSize: font.size.xxs, color: color.textDim }}>{t.id}</span>
                </td>
                <td style={mixins.td}>
                  <span style={{ fontSize: font.size.xxs, color: color.text }}>{t.agentId}</span>
                </td>
                <td style={mixins.td}>
                  <Badge color={t.side === "LONG" ? color.bull : color.bear} filled>
                    {t.side}
                  </Badge>
                </td>
                <td style={mixins.td}>
                  <span style={{ fontSize: font.size.xs, color: color.textBright }}>
                    ${t.entryPrice.toLocaleString()}
                  </span>
                </td>
                <td style={mixins.td}>
                  <span style={{ fontSize: font.size.xs, color: color.textBright }}>
                    ${t.exitPrice.toLocaleString()}
                  </span>
                </td>
                <td style={mixins.td}>
                  <span style={{ fontSize: font.size.xs, color: t.pnl >= 0 ? color.bull : color.bear, fontWeight: 600 }}>
                    {t.pnl >= 0 ? "+" : ""}{t.pnl.toFixed(2)}
                  </span>
                </td>
                <td style={mixins.td}>
                  <span style={{ fontSize: font.size.xs, color: t.pnlPct >= 0 ? color.bull : color.bear }}>
                    {t.pnlPct >= 0 ? "+" : ""}{t.pnlPct.toFixed(1)}%
                  </span>
                </td>
                <td style={mixins.td}>
                  <Badge color={t.exitReason === "TP" ? color.bull : t.exitReason === "SL" ? color.bear : color.orange}>
                    {t.exitReason}
                  </Badge>
                </td>
                <td style={mixins.td}>
                  <span style={{ fontSize: font.size.xs, color: t.reward >= 0 ? color.reward : color.loss }}>
                    {t.reward >= 0 ? "+" : ""}{t.reward}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
}

export default memo(TradeTable);
