import { useState, useContext, useCallback, memo } from "react";
import { MarketContext } from "../../context/MarketContext";
import { useAgents, usePositions } from "../../hooks";
import { Card, CardHead, CardBody, CardTitle } from "../../components/ui/Card";
import SearchInput from "../../components/ui/SearchInput";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { useToast } from "../../components/ui/Toast";
import AgentList from "./AgentList";
import AgentDetail from "./AgentDetail";

function AgentsTab({ modeFilter }) {
  const { price } = useContext(MarketContext);
  const { agents, filteredAgents, toggleAgent } = useAgents(modeFilter);
  const { positions, closeAllByAgent } = usePositions(agents, price);
  const addToast = useToast();

  const [selAgent, setSelAgent] = useState(null);
  const [search, setSearch] = useState("");
  const [confirmClose, setConfirmClose] = useState(null);

  const selectedAgent = agents.find((a) => a.id === selAgent) || null;

  const searchedAgents = search
    ? filteredAgents.filter(
        (a) =>
          a.id.toLowerCase().includes(search.toLowerCase()) ||
          a.name.toLowerCase().includes(search.toLowerCase()) ||
          a.type.toLowerCase().includes(search.toLowerCase())
      )
    : filteredAgents;

  const handleToggle = useCallback(
    (agentId) => {
      toggleAgent(agentId);
      const a = agents.find((x) => x.id === agentId);
      addToast?.(`${a?.active ? "Paused" : "Activated"} agent ${agentId}`, a?.active ? "warning" : "success");
    },
    [toggleAgent, agents, addToast]
  );

  const handleCloseAll = useCallback(
    (agentId) => {
      const count = positions.filter((p) => p.agentId === agentId).length;
      setConfirmClose({ agentId, count });
    },
    [positions]
  );

  const confirmCloseAll = useCallback(() => {
    if (confirmClose) {
      closeAllByAgent(confirmClose.agentId);
      addToast?.(`Closed ${confirmClose.count} positions for ${confirmClose.agentId}`, "success");
      setConfirmClose(null);
    }
  }, [confirmClose, closeAllByAgent, addToast]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(220px, 280px) 1fr", gap: 10, padding: 14 }}>
      <Card style={{ maxHeight: "80vh", overflowY: "auto" }}>
        <CardHead>
          <CardTitle>{searchedAgents.length} Agents</CardTitle>
        </CardHead>
        <div style={{ padding: "8px 12px 0" }}>
          <SearchInput value={search} onChange={setSearch} placeholder="Search agents..." />
        </div>
        <CardBody>
          <AgentList agents={searchedAgents} selectedId={selAgent} onSelect={setSelAgent} onToggle={handleToggle} />
        </CardBody>
      </Card>

      <Card>
        <CardHead>
          <CardTitle>Agent Detail</CardTitle>
        </CardHead>
        <CardBody>
          <AgentDetail
            agent={selectedAgent}
            positions={positions}
            onToggle={handleToggle}
            onCloseAll={handleCloseAll}
          />
        </CardBody>
      </Card>

      <ConfirmDialog
        open={!!confirmClose}
        title="Close All Positions"
        message={confirmClose ? `Close all ${confirmClose.count} positions for agent ${confirmClose.agentId}? This cannot be undone.` : ""}
        confirmLabel="Close All"
        danger={true}
        onConfirm={confirmCloseAll}
        onCancel={() => setConfirmClose(null)}
      />
    </div>
  );
}

export default memo(AgentsTab);
