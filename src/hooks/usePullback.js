import { useMemo } from "react";

export function usePullback(envelopes, price) {
  return useMemo(() => {
    if (!envelopes || !envelopes.upper.length) return null;

    const mu = envelopes.upper[envelopes.upper.length - 1];
    const ml = envelopes.lower[envelopes.lower.length - 1];
    const mid = envelopes.mid[envelopes.mid.length - 1];
    const distU = ((price - mu) / mu) * 100;
    const distL = ((price - ml) / ml) * 100;
    const distM = ((price - mid) / mid) * 100;
    const atZoneU = Math.abs(distU) < 0.15;
    const atZoneL = Math.abs(distL) < 0.15;
    const longSignal = distL < 0.3 && distL > -0.5;
    const shortSignal = distU > -0.3 && distU < 0.5;

    return { mu, ml, mid, distU, distL, distM, atZoneU, atZoneL, longSignal, shortSignal };
  }, [envelopes, price]);
}
