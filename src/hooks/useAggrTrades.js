import { useState, useCallback } from "react";
import { BASE, EXCHANGES } from "../constants";
import { rng, genAggrTrades } from "../utils";
import { useInterval } from "./useInterval";

export function useAggrTrades() {
  const [trades, setTrades] = useState(genAggrTrades);
  const [connected, setConnected] = useState(true);

  const addTrade = useCallback(() => {
    setTrades((prev) => {
      const n = [...prev];
      n.push({
        t: Date.now(),
        price: BASE + (Math.random() - 0.5) * 200,
        size: +rng(0.01, 8).toFixed(3),
        side: Math.random() > 0.48 ? "buy" : "sell",
        exchange: EXCHANGES[Math.floor(Math.random() * EXCHANGES.length)],
        liquidation: Math.random() > 0.92,
      });
      if (n.length > 50) n.shift();
      return n;
    });
  }, []);

  useInterval(addTrade, connected ? 1800 : null);

  return { trades, connected, setConnected };
}
