import { memo } from "react";
import { useAggrTrades } from "../../hooks";
import LiveTape from "./LiveTape";
import AggrVision from "./AggrVision";
import CommunityScripts from "./CommunityScripts";
import ScriptConsensus from "./ScriptConsensus";

function AggrTab() {
  const { trades, connected, setConnected } = useAggrTrades();

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 10, padding: 14 }}>
      <LiveTape trades={trades} connected={connected} setConnected={setConnected} />
      <AggrVision trades={trades} />
      <div style={{ gridColumn: "1 / -1" }}>
        <CommunityScripts />
      </div>
      <div style={{ gridColumn: "1 / -1" }}>
        <ScriptConsensus />
      </div>
    </div>
  );
}

export default memo(AggrTab);
