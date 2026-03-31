import { useState, useMemo, useCallback } from "react";
import { generateAgents, rng } from "../utils";
import { useInterval } from "./useInterval";

export function useAgents(modeFilter) {
  const [agents, setAgents] = useState(generateAgents);

  // Evolve agent stats every 5 seconds to simulate live performance
  const evolveStats = useCallback(() => {
    setAgents((prev) =>
      prev.map((a) => {
        if (!a.active) return a;
        const tradeHappened = Math.random() > 0.7;
        if (!tradeHappened) return a;

        const tradePnl = (Math.random() - 0.45) * 200;
        const won = tradePnl > 0;
        const totalTrades = a.trades24h + 1;
        const wins = Math.round(a.winRate * a.trades24h) + (won ? 1 : 0);

        return {
          ...a,
          trades24h: totalTrades,
          winRate: +(wins / totalTrades).toFixed(2),
          pnl24h: +(a.pnl24h + tradePnl).toFixed(2),
          confidence: +Math.max(0.1, Math.min(0.99, a.confidence + (Math.random() - 0.5) * 0.05)).toFixed(2),
        };
      })
    );
  }, []);

  useInterval(evolveStats, 5000);

  const toggleAgent = useCallback((agentId) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === agentId ? { ...a, active: !a.active } : a))
    );
  }, []);

  const filteredAgents = useMemo(
    () => (modeFilter === "ALL" ? agents : agents.filter((a) => a.mode === modeFilter)),
    [agents, modeFilter]
  );

  return { agents, filteredAgents, toggleAgent };
}
