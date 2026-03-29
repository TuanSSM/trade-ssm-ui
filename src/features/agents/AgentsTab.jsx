import { useState } from "react";
import { useAgents, usePositions } from "../../hooks";
import { Card, CardHead, CardBody, CardTitle } from "../../components/ui/Card";
import AgentList from "./AgentList";
import AgentDetail from "./AgentDetail";

export default function AgentsTab({ modeFilter }) {
  const { agents, filteredAgents } = useAgents(modeFilter);
  const { positions } = usePositions(agents);
  const [selAgent, setSelAgent] = useState(null);

  const selectedAgent = agents.find((a) => a.id === selAgent) || null;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 10, padding: 14 }}>
      <Card style={{ maxHeight: "80vh", overflowY: "auto" }}>
        <CardHead>
          <CardTitle>{filteredAgents.length} Agents</CardTitle>
        </CardHead>
        <CardBody>
          <AgentList agents={filteredAgents} selectedId={selAgent} onSelect={setSelAgent} />
        </CardBody>
      </Card>

      <Card>
        <CardHead>
          <CardTitle>Agent Detail</CardTitle>
        </CardHead>
        <CardBody>
          <AgentDetail agent={selectedAgent} positions={positions} />
        </CardBody>
      </Card>
    </div>
  );
}
