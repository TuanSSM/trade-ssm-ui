import { useState, useMemo, useCallback } from "react";
import { genTrainingSession, genEpisodeHistory } from "../utils/rlGenerators";
import { useInterval } from "./useInterval";
import { rng } from "../utils/math";

const INITIAL_EPISODES = 200;

function genNextEpisode(prev, session) {
  const ep = prev.length + 1;
  const progress = ep / session.totalEpisodes;
  const noise = 1 - progress * 0.6;
  const trend = progress * 2.5 - 0.8;

  const totalReward = trend * 100 + (Math.random() - 0.5) * 200 * noise;
  const loss = Math.max(0.01, 0.5 * Math.pow(0.992, ep) + (Math.random() - 0.5) * 0.08 * noise);
  const actorLoss = loss * rng(0.4, 0.6);

  return {
    episode: ep,
    totalReward: +totalReward.toFixed(2),
    avgReward: +(totalReward / Math.max(1, Math.floor(rng(5, 25)))).toFixed(2),
    cumulativeReward: +((prev[prev.length - 1]?.cumulativeReward || 0) + totalReward).toFixed(2),
    loss: +loss.toFixed(4),
    actorLoss: +actorLoss.toFixed(4),
    criticLoss: +(loss - actorLoss).toFixed(4),
    entropy: +Math.max(0.1, 1.8 * Math.pow(0.997, ep) + (Math.random() - 0.5) * 0.15).toFixed(3),
    explorationRate: +Math.max(0.01, 1.0 * Math.pow(0.995, ep)).toFixed(4),
    steps: Math.floor(rng(150, 300)),
    finalPnL: +(totalReward * rng(3, 8)).toFixed(2),
    sharpeRatio: +(-0.5 + progress * 2.0 + (Math.random() - 0.5) * 0.6 * noise).toFixed(2),
    maxDrawdown: +Math.max(0.5, 15 - progress * 10 + (Math.random() - 0.5) * 5).toFixed(1),
    winRate: +Math.min(0.75, 0.32 + progress * 0.3 + (Math.random() - 0.5) * 0.1).toFixed(3),
    tradesExecuted: Math.floor(rng(5, 25)),
    timestamp: Date.now(),
  };
}

export function useTrainingMetrics() {
  const [session, setSession] = useState(() => genTrainingSession());
  const [episodes, setEpisodes] = useState(() => genEpisodeHistory(INITIAL_EPISODES));
  const [isTraining, setIsTraining] = useState(true);

  const tick = useCallback(() => {
    if (!isTraining) return;

    setSession((prev) => ({
      ...prev,
      currentEpisode: Math.min(prev.currentEpisode + 1, prev.totalEpisodes),
      currentStep: prev.currentStep + Math.floor(rng(150, 300)),
      explorationRate: +Math.max(0.01, prev.explorationRate * prev.explorationDecay).toFixed(4),
      learningRate: +(prev.learningRate * 0.9998).toFixed(6),
    }));

    setEpisodes((prev) => {
      const next = [...prev, genNextEpisode(prev, session)];
      if (next.length > 2000) next.shift();
      return next;
    });
  }, [isTraining, session]);

  useInterval(tick, isTraining ? 2000 : null);

  const toggleTraining = useCallback(() => {
    setIsTraining((v) => !v);
    setSession((prev) => ({
      ...prev,
      status: prev.status === "TRAINING" ? "PAUSED" : "TRAINING",
    }));
  }, []);

  const rewardCurve = useMemo(() => episodes.map((e) => e.totalReward), [episodes]);
  const lossCurve = useMemo(() => episodes.map((e) => e.loss), [episodes]);
  const explorationCurve = useMemo(() => episodes.map((e) => e.explorationRate), [episodes]);
  const lrCurve = useMemo(() => episodes.map((e, i) => 0.0003 * Math.pow(0.95, (i / episodes.length) * 20)), [episodes]);
  const winRateCurve = useMemo(() => episodes.map((e) => e.winRate), [episodes]);
  const sharpeCurve = useMemo(() => episodes.map((e) => e.sharpeRatio), [episodes]);

  const currentMetrics = episodes[episodes.length - 1] || null;

  return {
    session,
    episodes,
    isTraining,
    rewardCurve,
    lossCurve,
    explorationCurve,
    lrCurve,
    winRateCurve,
    sharpeCurve,
    currentMetrics,
    toggleTraining,
  };
}
