import { useAggrTrades } from "../../hooks";
import LiveTape from "./LiveTape";
import AggrVision from "./AggrVision";
import CommunityScripts from "./CommunityScripts";
import ScriptConsensus from "./ScriptConsensus";

export default function AggrTab() {
  const { trades, connected, setConnected } = useAggrTrades();

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: 14 }}>
      <LiveTape trades={trades} connected={connected} setConnected={setConnected} />
      <AggrVision trades={trades} />
      <CommunityScripts />
      <ScriptConsensus />
    </div>
  );
}
