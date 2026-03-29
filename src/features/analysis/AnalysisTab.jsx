import { useAgents } from "../../hooks";
import MultiTFScan from "./MultiTFScan";
import ModeRiskProfiles from "./ModeRiskProfiles";
import BiDirPanel from "./BiDirPanel";

export default function AnalysisTab({ modeFilter }) {
  const { agents } = useAgents(modeFilter);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: 14 }}>
      <MultiTFScan />
      <ModeRiskProfiles agents={agents} />
      <BiDirPanel agents={agents} />
    </div>
  );
}
