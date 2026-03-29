import { BASE } from "../constants/pricing";
import { EXCHANGES } from "../constants/exchanges";
import { MODES } from "../constants/modes";
import { rng } from "./math";

const VOLATILITY = {
  "1m": 0.001,
  "5m": 0.0025,
  "15m": 0.004,
  "1H": 0.008,
  "4H": 0.015,
  "1D": 0.02,
};

export function genCandle(prev, tf) {
  const vol = VOLATILITY[tf] || 0.008;
  const d = (Math.random() - 0.498) * vol;
  const o = prev || BASE;
  const c = o * (1 + d);
  const h = Math.max(o, c) * (1 + Math.random() * vol * 0.5);
  const l = Math.min(o, c) * (1 - Math.random() * vol * 0.5);
  const v = Math.floor(50 + Math.random() * 800);
  const buyVol = Math.floor(v * (0.3 + Math.random() * 0.4));
  return { o, h, l, c, v, buyVol, sellVol: v - buyVol, t: Date.now() };
}

export function genSeries(n, tf) {
  const series = [];
  let p = BASE * (0.95 + Math.random() * 0.1);
  for (let i = 0; i < n; i++) {
    const candle = genCandle(p, tf);
    series.push(candle);
    p = candle.c;
  }
  return series;
}

const STRATEGIES = [
  { tf: "1m", base: "Scalp", types: ["Microstructure", "OrderFlow", "TickScalp"] },
  { tf: "5m", base: "Swing5", types: ["BiDir Sweep", "Momentum Burst", "ATR Breakout"] },
  { tf: "15m", base: "Swing15", types: ["EMA Pullback", "Envelope Fade", "CVD Divergence"] },
  { tf: "1H", base: "Intra", types: ["Trend Follow", "Mean Rev", "Liquidity Hunt"] },
  { tf: "4H", base: "Pos4H", types: ["Macro Trend", "Range Break", "Delta Neutral"] },
  { tf: "1D", base: "Daily", types: ["Swing Position", "Hedge Rotate", "Carry Trade"] },
];

const MODE_PARAMS = {
  CONSERVATIVE: { atrMult: 1.5, emaPeriod: 21, slMult: 1.2, tpMult: 1.8, riskPct: 0.5, maxLev: 5 },
  NORMAL: { atrMult: 2.0, emaPeriod: 14, slMult: 1.0, tpMult: 2.5, riskPct: 1.0, maxLev: 15 },
  AGGRESSIVE: { atrMult: 3.0, emaPeriod: 9, slMult: 0.7, tpMult: 3.5, riskPct: 2.5, maxLev: 30 },
};

function buildPullbackLogic(mode) {
  if (mode === "CONSERVATIVE") {
    return "LONG: Price touches MA Lower \u2192 bullish CVD confirm \u2192 entry. SHORT: Price rejects MA Upper \u2192 bearish divergence \u2192 entry.";
  }
  if (mode === "NORMAL") {
    return "LONG: EMA pullback to mid-band + volume spike \u2192 entry. SHORT: Fade MA Upper with ATR contraction \u2192 entry.";
  }
  return "LONG: Aggressive entry on any MA Lower wick with ATR expansion. SHORT: Immediate fade at MA Upper touch.";
}

export function generateAgents() {
  const agents = [];

  STRATEGIES.forEach(({ tf, base, types }) => {
    MODES.forEach((mode, mi) => {
      const type = types[mi];
      const mp = MODE_PARAMS[mode];
      const bias =
        mi === 0
          ? Math.random() > 0.5
            ? "LONG"
            : "NEUTRAL"
          : mi === 1
            ? "BOTH"
            : Math.random() > 0.5
              ? "SHORT"
              : "BOTH";

      agents.push({
        id: `RIFE-${base}-${mode.charAt(0)}`,
        name: `RIFE ${base} ${mode.charAt(0)}${mode.slice(1).toLowerCase()}`,
        mode,
        tf,
        type,
        bias,
        confidence: +(0.45 + Math.random() * 0.5).toFixed(2),
        params: mp,
        desc: `${type} on ${tf} \u00B7 EMA(${mp.emaPeriod}) \u00B1 ATR\u00D7${mp.atrMult} envelope \u00B7 SL ${mp.slMult}\u00D7 TP ${mp.tpMult}\u00D7`,
        pullbackLogic: buildPullbackLogic(mode),
        envelopeDesc: `MA Upper = EMA(${mp.emaPeriod}) + ATR(14)\u00D7${mp.atrMult} | MA Lower = EMA(${mp.emaPeriod}) - ATR(14)\u00D7${mp.atrMult}`,
        active: Math.random() > 0.15,
        trades24h: Math.floor(rng(1, mode === "AGGRESSIVE" ? 45 : mode === "NORMAL" ? 20 : 8)),
        winRate: +(0.4 + Math.random() * 0.3).toFixed(2),
        pnl24h: +((Math.random() - 0.35) * 5000).toFixed(2),
      });
    });
  });

  // 3 special agents
  agents.push(
    {
      id: "RIFE-AGGR-VISION",
      name: "RIFE Aggr Vision",
      mode: "AGGRESSIVE",
      tf: "MULTI",
      type: "Aggr Vision",
      bias: "BOTH",
      confidence: 0.82,
      params: MODE_PARAMS.AGGRESSIVE,
      desc: "Multi-exchange aggr.trade vision with CVD heatmap overlay.",
      pullbackLogic: "Monitors aggr.trade flow for liquidation cascades and sweep patterns.",
      envelopeDesc: "N/A \u2014 uses raw trade flow data",
      active: true,
      trades24h: 38,
      winRate: 0.61,
      pnl24h: 2340.5,
    },
    {
      id: "RIFE-AGGR-SCRIPTS",
      name: "RIFE Community Scripts",
      mode: "NORMAL",
      tf: "MULTI",
      type: "Script Aggregator",
      bias: "LONG",
      confidence: 0.74,
      params: MODE_PARAMS.NORMAL,
      desc: "Aggregates signals from top community scripts on aggr.trade.",
      pullbackLogic: "Consensus-based entry from multiple community indicators.",
      envelopeDesc: "N/A \u2014 uses community script signals",
      active: true,
      trades24h: 12,
      winRate: 0.58,
      pnl24h: 890.2,
    },
    {
      id: "RIFE-HEDGE-MASTER",
      name: "RIFE Hedge Master",
      mode: "CONSERVATIVE",
      tf: "MULTI",
      type: "Hedge Engine",
      bias: "NEUTRAL",
      confidence: 0.88,
      params: MODE_PARAMS.CONSERVATIVE,
      desc: "Cross-exchange hedge optimizer with delta-neutral targeting.",
      pullbackLogic: "Balances long/short exposure across exchanges to minimize directional risk.",
      envelopeDesc: "N/A \u2014 uses portfolio-level metrics",
      active: true,
      trades24h: 6,
      winRate: 0.72,
      pnl24h: 450.8,
    }
  );

  return agents;
}

export function generatePositions(agents) {
  return EXCHANGES.flatMap((ex) => {
    const n = 1 + Math.floor(Math.random() * 3);
    return Array.from({ length: n }, (_, i) => {
      const side = Math.random() > 0.5 ? "LONG" : "SHORT";
      const size = +(0.05 + Math.random() * 2.5).toFixed(4);
      const entry = BASE * (0.97 + Math.random() * 0.06);
      const agent = agents[Math.floor(Math.random() * agents.length)];
      const lev = Math.min(agent.params.maxLev, [3, 5, 10, 15, 20, 25][Math.floor(Math.random() * 6)]);
      const pnl = (side === "LONG" ? 1 : -1) * (BASE - entry) * size;
      return {
        id: `${ex}-${i}`,
        exchange: ex,
        pair: "BTC/USDT",
        side,
        size,
        entry: +entry.toFixed(2),
        current: BASE,
        leverage: lev,
        pnl: +pnl.toFixed(2),
        pnlPct: +((pnl / (entry * size)) * 100).toFixed(2),
        agentId: agent.id,
        agentMode: agent.mode,
        status: Math.random() > 0.3 ? "ACTIVE" : "PENDING",
      };
    });
  });
}

export function genAggrTrades() {
  return Array.from({ length: 30 }, (_, i) => ({
    t: Date.now() - (30 - i) * 2000,
    price: BASE + (Math.random() - 0.5) * 200,
    size: +rng(0.01, 5).toFixed(3),
    side: Math.random() > 0.48 ? "buy" : "sell",
    exchange: EXCHANGES[Math.floor(Math.random() * EXCHANGES.length)],
    liquidation: Math.random() > 0.92,
  }));
}
