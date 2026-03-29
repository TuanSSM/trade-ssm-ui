import { useState, useEffect, useMemo, useCallback } from "react";
import { TIMEFRAMES } from "../constants";
import { genSeries, genCandle, calcEnvelopes, calcATR, calcCVD } from "../utils";
import { useInterval } from "./useInterval";

export function useMarketData(tf, envEMA, envMult) {
  const [series, setSeries] = useState({});
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const m = {};
    TIMEFRAMES.forEach((t) => {
      m[t] = genSeries(80, t);
    });
    setSeries(m);
  }, []);

  const updateTick = useCallback(() => {
    setTick((t) => t + 1);
    setSeries((prev) => {
      const next = {};
      TIMEFRAMES.forEach((t) => {
        if (prev[t]) {
          const a = [...prev[t]];
          a.push(genCandle(a[a.length - 1].c, t));
          if (a.length > 80) a.shift();
          next[t] = a;
        } else {
          next[t] = prev[t];
        }
      });
      return next;
    });
  }, []);

  useInterval(updateTick, 1800);

  const candles = series[tf] || [];
  const closes = useMemo(() => candles.map((c) => c.c), [candles]);

  const price = closes.length ? closes[closes.length - 1] : 0;
  const priceChange = useMemo(() => {
    if (closes.length < 2) return 0;
    return ((closes[closes.length - 1] - closes[closes.length - 2]) / closes[closes.length - 2]) * 100;
  }, [closes]);

  const envelopes = useMemo(
    () =>
      closes.length > Math.max(envEMA, 14)
        ? calcEnvelopes(closes, candles, envEMA, 14, envMult)
        : null,
    [closes, candles, envEMA, envMult]
  );

  const atr = useMemo(
    () => (candles.length > 14 ? calcATR(candles, 14) : []),
    [candles]
  );

  const cvd = useMemo(() => calcCVD(candles), [candles]);

  return { series, candles, closes, price, priceChange, envelopes, atr, cvd, tick };
}
