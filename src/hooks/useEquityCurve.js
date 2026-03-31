import { useState, useCallback } from "react";
import { useInterval } from "./useInterval";

const INITIAL_BALANCE = 100000;

export function useEquityCurve(totalPnL) {
  const [curve, setCurve] = useState(() => [
    { t: Date.now() - 60000, value: INITIAL_BALANCE },
  ]);

  const recordPoint = useCallback(() => {
    setCurve((prev) => {
      const next = [...prev, { t: Date.now(), value: INITIAL_BALANCE + totalPnL }];
      if (next.length > 120) next.shift();
      return next;
    });
  }, [totalPnL]);

  useInterval(recordPoint, 3000);

  const values = curve.map((p) => p.value);
  const peak = Math.max(...values);
  const current = values[values.length - 1] || INITIAL_BALANCE;
  const drawdown = peak > 0 ? ((peak - current) / peak) * 100 : 0;
  const returnPct = ((current - INITIAL_BALANCE) / INITIAL_BALANCE) * 100;

  return { curve, values, peak, current, drawdown, returnPct, initialBalance: INITIAL_BALANCE };
}
