import { useState, useMemo, useCallback } from "react";
import { genAgentDecisions, genQValueHeatmap } from "../utils/rlGenerators";
import { useInterval } from "./useInterval";

export function useAgentDecisions(agents, price) {
  const [decisions, setDecisions] = useState(() => {
    const map = new Map();
    agents.forEach((a) => {
      map.set(a.id, genAgentDecisions(a.id, price));
    });
    return map;
  });

  const [selectedAgent, setSelectedAgent] = useState(agents[0]?.id || null);
  const [qValueHeatmap, setQValueHeatmap] = useState(() => genQValueHeatmap());

  const refresh = useCallback(() => {
    setDecisions((prev) => {
      const next = new Map(prev);
      agents.forEach((a) => {
        next.set(a.id, genAgentDecisions(a.id, price));
      });
      return next;
    });
    setQValueHeatmap(genQValueHeatmap());
  }, [agents, price]);

  useInterval(refresh, 3000);

  const currentDecision = decisions.get(selectedAgent) || null;

  const policyComparison = useMemo(() => {
    return agents
      .filter((a) => a.active)
      .slice(0, 12)
      .map((a) => {
        const d = decisions.get(a.id);
        return {
          agentId: a.id,
          name: a.name,
          mode: a.mode,
          actionProbabilities: d?.actionProbabilities || { LONG: 0.33, SHORT: 0.33, HOLD: 0.34 },
          selectedAction: d?.selectedAction || "HOLD",
        };
      });
  }, [agents, decisions]);

  return {
    decisions,
    selectedAgent,
    setSelectedAgent,
    currentDecision,
    qValueHeatmap,
    policyComparison,
  };
}
