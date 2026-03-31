import { memo } from "react";
import { useAgents } from "../../hooks";
import MultiTFScan from "./MultiTFScan";
import ModeRiskProfiles from "./ModeRiskProfiles";
import BiDirPanel from "./BiDirPanel";

function AnalysisTab({ modeFilter }) {
  const { agents } = useAgents(modeFilter);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 10, padding: 14 }}>
      <MultiTFScan />
      <ModeRiskProfiles agents={agents} />
      <BiDirPanel agents={agents} />
    </div>
  );
}

export default memo(AnalysisTab);
