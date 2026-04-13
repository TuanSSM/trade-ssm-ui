import { useRef, useState, useEffect, useMemo, memo } from "react";
import { Card, CardHead, CardBody, CardTitle } from "../../components/ui/Card";
import { LightweightChart } from "../../components/charts";
import { color, font } from "../../styles/tokens";

function TradeOverlayChart({ candles, trades, envelopes, selectedTrade, onSelectTrade }) {
  const ref = useRef(null);
  const [w, setW] = useState(680);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new ResizeObserver((entries) => {
      for (const e of entries) setW(Math.floor(e.contentRect.width));
    });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const markers = useMemo(() => {
    if (!trades?.length || !candles?.length) return [];
    return trades.slice(-20).flatMap((t) => {
      const items = [];
      items.push({
        time: t.entryTime,
        type: "entry",
        side: t.side,
        price: t.entryPrice,
        id: t.id,
      });
      if (t.exitTime) {
        items.push({
          time: t.exitTime,
          type: "exit",
          side: t.side,
          pnl: t.pnl,
          price: t.exitPrice,
          id: t.id,
        });
      }
      return items;
    });
  }, [trades, candles]);

  const lines = useMemo(() => {
    if (!selectedTrade) return [];
    const l = [];
    l.push({ price: selectedTrade.entryPrice, color: color.cyan, lineWidth: 1, title: "ENTRY" });
    if (selectedTrade.exitPrice) {
      l.push({
        price: selectedTrade.exitPrice,
        color: selectedTrade.pnl >= 0 ? color.bull : color.bear,
        lineWidth: 1,
        title: selectedTrade.pnl >= 0 ? "TP" : "SL",
      });
    }
    return l;
  }, [selectedTrade]);

  const overlays = useMemo(() => {
    if (!envelopes) return [];
    return [
      { data: envelopes.upper, color: color.bear + "80", lineWidth: 1 },
      { data: envelopes.lower, color: color.bull + "80", lineWidth: 1 },
      { data: envelopes.mid, color: color.orange + "60", lineWidth: 1 },
    ];
  }, [envelopes]);

  const tradeCount = trades?.length || 0;
  const recentWins = trades?.slice(-10).filter((t) => t.pnl > 0).length || 0;

  return (
    <Card>
      <CardHead>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <CardTitle>Trade Execution Overlay</CardTitle>
          <span style={{ fontSize: font.size.xxs, color: color.textFaint }}>
            {tradeCount} trades \u00B7 Last 10: {recentWins}W/{10 - recentWins}L
          </span>
        </div>
        {selectedTrade && (
          <button
            onClick={() => onSelectTrade(null)}
            style={{
              background: "transparent",
              border: `1px solid ${color.border}`,
              color: color.textDim,
              fontSize: font.size.xxs,
              padding: "2px 8px",
              borderRadius: 4,
              cursor: "pointer",
              fontFamily: font.mono,
            }}
          >
            Clear Selection
          </button>
        )}
      </CardHead>
      <CardBody>
        <div ref={ref}>
          <LightweightChart
            candles={candles?.slice(-60) || []}
            markers={markers}
            lines={lines}
            overlays={overlays}
            width={w}
            height={300}
          />
        </div>
      </CardBody>
    </Card>
  );
}

export default memo(TradeOverlayChart);
