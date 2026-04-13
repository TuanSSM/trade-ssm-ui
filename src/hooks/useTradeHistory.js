import { useState, useMemo, useCallback } from "react";
import { genTradeHistory } from "../utils/rlGenerators";
import { useInterval } from "./useInterval";
import { BASE } from "../constants/pricing";
import { EXCHANGES } from "../constants/exchanges";
import { rng } from "../utils/math";

const ENTRY_REASONS = [
  "EMA pullback to lower band with bullish CVD confirmation",
  "Momentum burst above upper envelope with volume spike",
  "Mean reversion setup at MA Lower with RSI oversold",
  "Trend follow entry on EMA bounce with strong delta",
];
const EXIT_REASONS = ["TP", "SL", "TRAILING_SL", "SIGNAL_REVERSE", "TIMEOUT"];

export function useTradeHistory(candles) {
  const [trades, setTrades] = useState(() => genTradeHistory(30, candles));

  const evolve = useCallback(() => {
    setTrades((prev) => {
      const next = [...prev];
      const id = `T-${String(next.length + 1).padStart(3, "0")}`;
      const side = Math.random() > 0.48 ? "LONG" : "SHORT";
      const price = candles?.length ? candles[candles.length - 1].c : BASE;
      const isWin = Math.random() > 0.42;
      const moveDir = side === "LONG" ? 1 : -1;
      const movePct = isWin ? moveDir * rng(0.002, 0.015) : -moveDir * rng(0.001, 0.008);
      const exitPrice = price * (1 + movePct);
      const size = +rng(0.05, 2.5).toFixed(4);
      const pnl = (side === "LONG" ? 1 : -1) * (exitPrice - price) * size;

      next.push({
        id,
        agentId: `RIFE-${["Scalp", "Swing5", "Swing15", "Intra", "Pos4H", "Daily"][Math.floor(Math.random() * 6)]}-${["C", "N", "A"][Math.floor(Math.random() * 3)]}`,
        exchange: EXCHANGES[Math.floor(Math.random() * EXCHANGES.length)],
        side,
        entryPrice: +price.toFixed(2),
        exitPrice: +exitPrice.toFixed(2),
        entryTime: Date.now() - Math.floor(rng(30000, 120000)),
        exitTime: Date.now(),
        entryCandle: Math.max(0, (candles?.length || 60) - Math.floor(rng(5, 15))),
        exitCandle: (candles?.length || 60) - 1,
        size,
        pnl: +pnl.toFixed(2),
        pnlPct: +((pnl / (price * size)) * 100).toFixed(2),
        reason: ENTRY_REASONS[Math.floor(Math.random() * ENTRY_REASONS.length)],
        exitReason: EXIT_REASONS[Math.floor(Math.random() * EXIT_REASONS.length)],
        confidence: +rng(0.4, 0.95).toFixed(2),
        qValueAtEntry: +rng(0.2, 0.9).toFixed(2),
        alternativeQValues: {
          LONG: +rng(-0.3, 1.0).toFixed(2),
          SHORT: +rng(-0.3, 1.0).toFixed(2),
          HOLD: +rng(-0.1, 0.7).toFixed(2),
        },
        stateFeatures: {
          priceVsEMA: +rng(-1.5, 1.5).toFixed(2),
          atrNormalized: +rng(0.5, 2.5).toFixed(2),
          cvdSlope: +rng(-1.0, 1.0).toFixed(2),
          volumeRatio: +rng(0.3, 3.0).toFixed(2),
          rsi: +rng(20, 80).toFixed(0),
          distToUpperBand: +rng(0, 3).toFixed(2),
          distToLowerBand: +rng(-1, 2).toFixed(2),
        },
        reward: +(pnl > 0 ? rng(1, 8) : rng(-6, -0.5)).toFixed(2),
      });

      if (next.length > 100) next.shift();
      return next;
    });
  }, [candles]);

  useInterval(evolve, 8000);

  const completedTrades = useMemo(() => trades.filter((t) => t.exitTime), [trades]);

  const tradeMarkers = useMemo(
    () =>
      completedTrades.flatMap((t) => [
        {
          time: t.entryTime,
          price: t.entryPrice,
          type: "entry",
          side: t.side,
          id: t.id,
        },
        {
          time: t.exitTime,
          price: t.exitPrice,
          type: "exit",
          side: t.side,
          pnl: t.pnl,
          id: t.id,
        },
      ]),
    [completedTrades]
  );

  const tradeStats = useMemo(() => {
    if (!completedTrades.length) return { totalTrades: 0, winRate: 0, avgPnl: 0, bestTrade: 0, worstTrade: 0, profitFactor: 0 };
    const wins = completedTrades.filter((t) => t.pnl > 0);
    const losses = completedTrades.filter((t) => t.pnl <= 0);
    const totalProfit = wins.reduce((s, t) => s + t.pnl, 0);
    const totalLoss = Math.abs(losses.reduce((s, t) => s + t.pnl, 0));
    return {
      totalTrades: completedTrades.length,
      winRate: +(wins.length / completedTrades.length).toFixed(3),
      avgPnl: +(completedTrades.reduce((s, t) => s + t.pnl, 0) / completedTrades.length).toFixed(2),
      bestTrade: +Math.max(...completedTrades.map((t) => t.pnl)).toFixed(2),
      worstTrade: +Math.min(...completedTrades.map((t) => t.pnl)).toFixed(2),
      profitFactor: totalLoss > 0 ? +(totalProfit / totalLoss).toFixed(2) : Infinity,
    };
  }, [completedTrades]);

  const tradesByAgent = useMemo(() => {
    const map = new Map();
    completedTrades.forEach((t) => {
      if (!map.has(t.agentId)) map.set(t.agentId, []);
      map.get(t.agentId).push(t);
    });
    return map;
  }, [completedTrades]);

  return { trades, completedTrades, tradeMarkers, tradeStats, tradesByAgent };
}
