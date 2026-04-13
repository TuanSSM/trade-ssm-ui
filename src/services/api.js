import {
  genTrainingSession,
  genEpisodeHistory,
  genTradeHistory,
  genAgentDecisions,
  genQValueHeatmap,
} from "../utils/rlGenerators";

export const api = {
  fetchTrainingSession: () => Promise.resolve(genTrainingSession()),
  fetchEpisodeHistory: (n) => Promise.resolve(genEpisodeHistory(n)),
  fetchTradeHistory: (n, candles) => Promise.resolve(genTradeHistory(n, candles)),
  fetchAgentDecisions: (agentId, price) => Promise.resolve(genAgentDecisions(agentId, price)),
  fetchQValueHeatmap: () => Promise.resolve(genQValueHeatmap()),
};
