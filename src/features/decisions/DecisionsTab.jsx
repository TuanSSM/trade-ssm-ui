import { useContext, memo } from "react";
import { MarketContext } from "../../context/MarketContext";
import { useAgents, useAgentDecisions } from "../../hooks";
import { color, font, space } from "../../styles/tokens";
import QValueDisplay from "./QValueDisplay";
import ActionProbChart from "./ActionProbChart";
import FeatureImportance from "./FeatureImportance";
import QValueHeatmap from "./QValueHeatmap";
import PolicyComparison from "./PolicyComparison";

const s = {
  container: {
    padding: `${space.md}px ${space.lg}px`,
  },
  selector: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: space.md,
    padding: `${space.md}px ${space.lg}px`,
    background: color.surface,
    border: `1px solid ${color.border}`,
    borderRadius: 9,
  },
  selectorLabel: {
    fontSize: font.size.xs,
    color: color.textGhost,
    textTransform: "uppercase",
    letterSpacing: ".06em",
  },
  agentBtn: (active) => ({
    padding: "4px 10px",
    borderRadius: 5,
    border: active ? `1px solid ${color.bull}40` : `1px solid ${color.border}`,
    background: active ? `${color.bull}15` : "transparent",
    color: active ? color.bull : color.textDim,
    fontSize: font.size.xxs,
    cursor: "pointer",
    fontFamily: font.mono,
    fontWeight: active ? 600 : 400,
    transition: "all .15s",
  }),
  topRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: space.md,
    marginBottom: space.md,
  },
  bottomRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: space.md,
    marginBottom: space.md,
  },
};

function DecisionsTab({ modeFilter }) {
  const { price } = useContext(MarketContext);
  const { agents } = useAgents(modeFilter);
  const {
    selectedAgent,
    setSelectedAgent,
    currentDecision,
    qValueHeatmap,
    policyComparison,
  } = useAgentDecisions(agents, price);

  const displayAgents = agents.filter((a) => a.active).slice(0, 15);

  return (
    <div style={s.container}>
      {/* Agent Selector */}
      <div style={s.selector} role="group" aria-label="Agent selector">
        <span style={s.selectorLabel}>Agent:</span>
        {displayAgents.map((a) => (
          <button
            key={a.id}
            style={s.agentBtn(selectedAgent === a.id)}
            onClick={() => setSelectedAgent(a.id)}
            aria-pressed={selectedAgent === a.id}
          >
            {a.id}
          </button>
        ))}
      </div>

      {/* Q-Values and Action Distribution */}
      <div style={s.topRow}>
        <QValueDisplay decision={currentDecision} />
        <ActionProbChart
          probabilities={currentDecision?.actionProbabilities}
          selectedAction={currentDecision?.selectedAction}
        />
      </div>

      {/* Feature Importance */}
      <div style={{ marginBottom: space.md }}>
        <FeatureImportance features={currentDecision?.stateFeatures} />
      </div>

      {/* Heatmap and Policy Comparison */}
      <div style={s.bottomRow}>
        <QValueHeatmap heatmap={qValueHeatmap} />
        <PolicyComparison policyComparison={policyComparison} agents={agents} />
      </div>
    </div>
  );
}

export default memo(DecisionsTab);
