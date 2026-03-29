import { useState, useMemo } from "react";
import { generateAgents } from "../utils";

export function useAgents(modeFilter) {
  const [agents] = useState(generateAgents);

  const filteredAgents = useMemo(
    () => (modeFilter === "ALL" ? agents : agents.filter((a) => a.mode === modeFilter)),
    [agents, modeFilter]
  );

  return { agents, filteredAgents };
}
