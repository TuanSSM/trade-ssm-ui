import { BASE } from "../constants/pricing";
import { EXCHANGES } from "../constants/exchanges";
import { rng } from "./math";

const ALGORITHMS = ["PPO", "DQN", "A2C", "SAC"];
const EXIT_REASONS = ["TP", "SL", "TRAILING_SL", "SIGNAL_REVERSE", "TIMEOUT"];
const ACTIONS = ["LONG", "SHORT", "HOLD"];

const FEATURE_NAMES = [
  "Price vs EMA",
  "ATR Normalized",
  "CVD Slope",
  "Volume Ratio",
  "RSI",
  "Dist Upper Band",
  "Dist Lower Band",
  "Funding Rate",
];

const ENTRY_REASONS = [
  "EMA pullback to lower band with bullish CVD confirmation",
  "Momentum burst above upper envelope with volume spike",
  "Mean reversion setup at MA Lower with RSI oversold",
  "CVD divergence signaling hidden bullish momentum",
  "ATR breakout with expanding volatility confirmation",
  "Liquidity sweep below lower band with quick recovery",
  "Trend follow entry on EMA bounce with strong delta",
  "Range break above consolidation with volume confirmation",
  "Pullback to mid-band in strong uptrend",
  "Aggressive fade at MA Upper with bearish CVD",
  "Delta neutral rebalance triggered by exposure drift",
  "Envelope squeeze breakout with directional bias",
];

export function genTrainingSession() {
  const totalEpisodes = 5000;
  const currentEpisode = Math.floor(rng(1800, 3200));
  const totalSteps = 1200000;
  const currentStep = Math.floor((currentEpisode / totalEpisodes) * totalSteps * rng(0.9, 1.1));
  const progress = currentEpisode / totalEpisodes;

  return {
    sessionId: `RL-SESSION-${String(Math.floor(rng(1, 99))).padStart(3, "0")}`,
    algorithm: ALGORITHMS[Math.floor(Math.random() * ALGORITHMS.length)],
    startedAt: Date.now() - Math.floor(rng(3600000, 86400000)),
    totalEpisodes,
    currentEpisode,
    totalSteps,
    currentStep,
    learningRate: 0.0003 * Math.pow(0.95, progress * 20),
    explorationRate: Math.max(0.01, 1.0 * Math.pow(0.995, currentEpisode)),
    explorationDecay: 0.995,
    gamma: 0.99,
    batchSize: 64,
    replayBufferSize: 100000,
    replayBufferFill: Math.floor(rng(40000, 80000)),
    status: "TRAINING",
  };
}

export function genEpisodeHistory(numEpisodes) {
  const episodes = [];
  let cumulativeReward = 0;

  for (let i = 0; i < numEpisodes; i++) {
    const progress = i / numEpisodes;
    const noise = (1 - progress * 0.6);
    const trend = progress * 2.5 - 0.8;

    const totalReward = trend * 100 + (Math.random() - 0.5) * 200 * noise;
    cumulativeReward += totalReward;
    const loss = Math.max(0.01, 0.5 * Math.pow(0.992, i) + (Math.random() - 0.5) * 0.08 * noise);
    const actorLoss = loss * rng(0.4, 0.6);
    const criticLoss = loss - actorLoss;
    const entropy = Math.max(0.1, 1.8 * Math.pow(0.997, i) + (Math.random() - 0.5) * 0.15);
    const explorationRate = Math.max(0.01, 1.0 * Math.pow(0.995, i));
    const winRate = Math.min(0.75, 0.32 + progress * 0.3 + (Math.random() - 0.5) * 0.1);
    const sharpe = -0.5 + progress * 2.0 + (Math.random() - 0.5) * 0.6 * noise;
    const tradesExecuted = Math.floor(rng(5, 25));

    episodes.push({
      episode: i + 1,
      totalReward: +totalReward.toFixed(2),
      avgReward: +(totalReward / Math.max(1, tradesExecuted)).toFixed(2),
      cumulativeReward: +cumulativeReward.toFixed(2),
      loss: +loss.toFixed(4),
      actorLoss: +actorLoss.toFixed(4),
      criticLoss: +criticLoss.toFixed(4),
      entropy: +entropy.toFixed(3),
      explorationRate: +explorationRate.toFixed(4),
      steps: Math.floor(rng(150, 300)),
      finalPnL: +(totalReward * rng(3, 8)).toFixed(2),
      sharpeRatio: +sharpe.toFixed(2),
      maxDrawdown: +Math.max(0.5, 15 - progress * 10 + (Math.random() - 0.5) * 5).toFixed(1),
      winRate: +winRate.toFixed(3),
      tradesExecuted,
      timestamp: Date.now() - (numEpisodes - i) * 2000,
    });
  }

  return episodes;
}

export function genTradeHistory(numTrades, candles) {
  const trades = [];
  const candleCount = candles ? candles.length : 60;

  for (let i = 0; i < numTrades; i++) {
    const side = Math.random() > 0.48 ? "LONG" : "SHORT";
    const entryCandle = Math.floor(rng(5, candleCount - 15));
    const duration = Math.floor(rng(3, 12));
    const exitCandle = Math.min(candleCount - 1, entryCandle + duration);

    const entryPrice = candles
      ? candles[entryCandle].c
      : BASE * (0.97 + Math.random() * 0.06);

    const moveDir = side === "LONG" ? 1 : -1;
    const isWin = Math.random() > 0.42;
    const movePct = isWin
      ? moveDir * rng(0.002, 0.015)
      : -moveDir * rng(0.001, 0.008);
    const exitPrice = entryPrice * (1 + movePct);

    const size = +rng(0.05, 2.5).toFixed(4);
    const pnl = (side === "LONG" ? 1 : -1) * (exitPrice - entryPrice) * size;
    const confidence = +rng(0.4, 0.95).toFixed(2);
    const qLong = +rng(-0.3, 1.0).toFixed(2);
    const qShort = +rng(-0.3, 1.0).toFixed(2);
    const qHold = +rng(-0.1, 0.7).toFixed(2);

    trades.push({
      id: `T-${String(i + 1).padStart(3, "0")}`,
      agentId: `RIFE-${["Scalp", "Swing5", "Swing15", "Intra", "Pos4H", "Daily"][Math.floor(Math.random() * 6)]}-${["C", "N", "A"][Math.floor(Math.random() * 3)]}`,
      exchange: EXCHANGES[Math.floor(Math.random() * EXCHANGES.length)],
      side,
      entryPrice: +entryPrice.toFixed(2),
      exitPrice: +exitPrice.toFixed(2),
      entryTime: Date.now() - (numTrades - i) * 60000 * rng(5, 30),
      exitTime: Date.now() - (numTrades - i) * 60000 * rng(1, 5),
      entryCandle,
      exitCandle,
      size,
      pnl: +pnl.toFixed(2),
      pnlPct: +((pnl / (entryPrice * size)) * 100).toFixed(2),
      reason: ENTRY_REASONS[Math.floor(Math.random() * ENTRY_REASONS.length)],
      exitReason: EXIT_REASONS[Math.floor(Math.random() * EXIT_REASONS.length)],
      confidence,
      qValueAtEntry: side === "LONG" ? qLong : qShort,
      alternativeQValues: {
        LONG: qLong,
        SHORT: qShort,
        HOLD: qHold,
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
  }

  return trades.sort((a, b) => a.entryTime - b.entryTime);
}

export function genAgentDecisions(agentId, price) {
  const qLong = +rng(-0.5, 1.0).toFixed(3);
  const qShort = +rng(-0.5, 1.0).toFixed(3);
  const qHold = +rng(-0.2, 0.8).toFixed(3);

  const maxQ = Math.max(qLong, qShort, qHold);
  const expL = Math.exp(qLong * 3);
  const expS = Math.exp(qShort * 3);
  const expH = Math.exp(qHold * 3);
  const sumExp = expL + expS + expH;

  const selectedAction = maxQ === qLong ? "LONG" : maxQ === qShort ? "SHORT" : "HOLD";

  const features = FEATURE_NAMES.map((name) => {
    const importance = +rng(0.02, 0.30).toFixed(3);
    const value = +rng(-2, 2).toFixed(2);
    return { name, value, importance };
  });
  features.sort((a, b) => b.importance - a.importance);
  const totalImp = features.reduce((s, f) => s + f.importance, 0);
  features.forEach((f) => { f.importance = +(f.importance / totalImp).toFixed(3); });

  return {
    agentId,
    timestamp: Date.now(),
    qValues: { LONG: qLong, SHORT: qShort, HOLD: qHold },
    actionProbabilities: {
      LONG: +(expL / sumExp).toFixed(3),
      SHORT: +(expS / sumExp).toFixed(3),
      HOLD: +(expH / sumExp).toFixed(3),
    },
    selectedAction,
    stateFeatures: features,
    policyEntropy: +rng(0.2, 1.5).toFixed(3),
    valueEstimate: +rng(-0.5, 1.0).toFixed(3),
    advantageEstimate: +rng(-0.3, 0.5).toFixed(3),
    price,
  };
}

export function genQValueHeatmap() {
  const priceLevels = 12;
  const timeSteps = 20;
  const priceAxis = Array.from({ length: priceLevels }, (_, i) =>
    Math.floor(BASE - 600 + (i * 1200) / (priceLevels - 1))
  );
  const timeAxis = Array.from({ length: timeSteps }, (_, i) => i);

  const grid = {};
  const bestAction = [];

  for (const action of ACTIONS) {
    grid[action] = [];
    for (let p = 0; p < priceLevels; p++) {
      grid[action][p] = [];
      for (let t = 0; t < timeSteps; t++) {
        const priceEffect = action === "LONG"
          ? (p - priceLevels / 2) * -0.1
          : action === "SHORT"
            ? (p - priceLevels / 2) * 0.1
            : 0;
        grid[action][p][t] = +(priceEffect + rng(-0.3, 0.3)).toFixed(3);
      }
    }
  }

  for (let p = 0; p < priceLevels; p++) {
    bestAction[p] = [];
    for (let t = 0; t < timeSteps; t++) {
      let best = ACTIONS[0];
      let bestVal = grid[ACTIONS[0]][p][t];
      for (const a of ACTIONS) {
        if (grid[a][p][t] > bestVal) {
          bestVal = grid[a][p][t];
          best = a;
        }
      }
      bestAction[p][t] = best;
    }
  }

  return { priceAxis, timeAxis, actions: ACTIONS, grid, bestAction };
}
