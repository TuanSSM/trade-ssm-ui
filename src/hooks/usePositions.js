import { useState, useMemo } from "react";
import { generatePositions } from "../utils";

export function usePositions(agents) {
  const [positions] = useState(() => generatePositions(agents));

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

  return { positions, ...metrics };
}
