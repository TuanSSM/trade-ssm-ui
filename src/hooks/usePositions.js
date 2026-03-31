import { useState, useMemo, useCallback } from "react";
import { generatePositions } from "../utils";

export function usePositions(agents, price) {
  const [basePositions, setBasePositions] = useState(() => generatePositions(agents));

  // Live P&L recalculated on every price tick
  const positions = useMemo(
    () =>
      basePositions.map((p) => {
        const current = price || p.current;
        const pnl = (p.side === "LONG" ? 1 : -1) * (current - p.entry) * p.size;
        const pnlPct = +((pnl / (p.entry * p.size)) * 100).toFixed(2);
        return { ...p, current: +current.toFixed(2), pnl: +pnl.toFixed(2), pnlPct };
      }),
    [basePositions, price]
  );

  const closePosition = useCallback((positionId) => {
    setBasePositions((prev) => prev.filter((p) => p.id !== positionId));
  }, []);

  const closeAllByAgent = useCallback((agentId) => {
    setBasePositions((prev) => prev.filter((p) => p.agentId !== agentId));
  }, []);

  const metrics = useMemo(() => {
    const totalLong = positions
      .filter((p) => p.side === "LONG")
      .reduce((a, p) => a + p.size * p.current, 0);
    const totalShort = positions
      .filter((p) => p.side === "SHORT")
      .reduce((a, p) => a + p.size * p.current, 0);
    const net = totalLong - totalShort;
    const gross = totalLong + totalShort;
    const hedgeRatio = gross > 0 ? 1 - Math.abs(net) / gross : 0;
    const totalPnL = positions.reduce((a, p) => a + p.pnl, 0);

    return { totalLong, totalShort, net, gross, hedgeRatio, totalPnL };
  }, [positions]);

  return { positions, closePosition, closeAllByAgent, ...metrics };
}
