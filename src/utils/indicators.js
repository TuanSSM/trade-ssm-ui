export function calcEMA(data, period) {
  const k = 2 / (period + 1);
  const ema = [data[0]];
  for (let i = 1; i < data.length; i++) {
    ema.push(data[i] * k + ema[i - 1] * (1 - k));
  }
  return ema;
}

export function calcATR(candles, period = 14) {
  const trs = candles.map((c, i) =>
    i === 0
      ? c.h - c.l
      : Math.max(c.h - c.l, Math.abs(c.h - candles[i - 1].c), Math.abs(c.l - candles[i - 1].c))
  );
  const result = [];
  let sum = trs.slice(0, period).reduce((x, y) => x + y, 0);
  result.push(sum / period);
  for (let i = period; i < trs.length; i++) {
    result.push((result[result.length - 1] * (period - 1) + trs[i]) / period);
  }
  return result;
}

export function calcCVD(candles) {
  let cum = 0;
  return candles.map((c) => {
    cum += c.buyVol - c.sellVol;
    return cum;
  });
}

export function calcEnvelopes(closes, candles, emaPeriod, atrPeriod, mult) {
  const ema = calcEMA(closes, emaPeriod);
  const atr = calcATR(candles, atrPeriod);
  const offset = ema.length - atr.length;
  const upper = [];
  const lower = [];
  const mid = [];
  for (let i = 0; i < atr.length; i++) {
    const ei = offset + i;
    mid.push(ema[ei]);
    upper.push(ema[ei] + atr[i] * mult);
    lower.push(ema[ei] - atr[i] * mult);
  }
  return { upper, lower, mid, ema, atr };
}
