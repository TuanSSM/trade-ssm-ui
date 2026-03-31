import { memo } from "react";
import { MODE_COLORS, MODE_ICONS, BIAS_COLORS } from "../../constants";
import { Gauge } from "../../components/charts";
import Badge from "../../components/ui/Badge";
import { color, font } from "../../styles/tokens";
import * as mixins from "../../styles/mixins";

function AgentConsensus({ agents }) {
  return (
    <div>
      <div style={{ ...mixins.cardTitle, marginBottom: 6 }}>Agent Consensus</div>
      {agents.slice(0, 8).map((a) => (
        <div
          key={a.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 4,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: font.size.xxs, color: MODE_COLORS[a.mode] }}>{MODE_ICONS[a.mode]}</span>
            <span style={{ fontSize: font.size.xs, color: color.textDim }}>{a.id}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Gauge
              value={a.confidence}
              size={28}
              color={a.confidence > 0.75 ? color.bull : a.confidence > 0.5 ? color.orange : color.bear}
            />
            <Badge color={BIAS_COLORS[a.bias] || color.textDim}>{a.bias}</Badge>
          </div>
        </div>
      ))}
    </div>
  );
}

export default memo(AgentConsensus);
