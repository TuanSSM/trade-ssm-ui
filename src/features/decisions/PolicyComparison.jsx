import { memo } from "react";
import { Card, CardHead, CardBody, CardTitle } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { color, font, space } from "../../styles/tokens";
import { MODE_COLORS } from "../../constants";

const ACTION_COLORS = {
  LONG: color.qPositive,
  SHORT: color.qNegative,
  HOLD: color.qNeutral,
};

function PolicyComparison({ policyComparison }) {
  if (!policyComparison?.length) {
    return (
      <Card>
        <CardHead><CardTitle>Policy Comparison</CardTitle></CardHead>
        <CardBody>
          <div style={{ color: color.textFaint, fontSize: font.size.xs, textAlign: "center", padding: 20 }}>
            No active agents
          </div>
        </CardBody>
      </Card>
    );
  }

  const grouped = {};
  policyComparison.forEach((p) => {
    if (!grouped[p.mode]) grouped[p.mode] = [];
    grouped[p.mode].push(p);
  });

  return (
    <Card>
      <CardHead>
        <CardTitle>Policy Comparison</CardTitle>
        <span style={{ fontSize: font.size.xxs, color: color.textFaint }}>
          {policyComparison.length} active agents
        </span>
      </CardHead>
      <CardBody>
        {Object.entries(grouped).map(([mode, agents]) => (
          <div key={mode} style={{ marginBottom: space.lg }}>
            <div style={{
              fontSize: font.size.xxs,
              color: MODE_COLORS[mode] || color.textDim,
              fontWeight: font.weight.semibold,
              textTransform: "uppercase",
              letterSpacing: ".06em",
              marginBottom: space.sm,
            }}>
              {mode}
            </div>

            {agents.map((agent) => (
              <div
                key={agent.agentId}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 4,
                  padding: "3px 0",
                }}
              >
                <span style={{
                  fontSize: font.size.xxs,
                  color: color.textDim,
                  width: 90,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}>
                  {agent.agentId}
                </span>

                {/* Stacked probability bar */}
                <div style={{
                  flex: 1,
                  height: 12,
                  display: "flex",
                  borderRadius: 3,
                  overflow: "hidden",
                }}>
                  {["LONG", "SHORT", "HOLD"].map((action) => (
                    <div
                      key={action}
                      style={{
                        width: `${(agent.actionProbabilities[action] || 0) * 100}%`,
                        height: "100%",
                        background: ACTION_COLORS[action],
                        opacity: agent.selectedAction === action ? 1 : 0.4,
                        transition: "width 0.3s",
                      }}
                      title={`${action}: ${((agent.actionProbabilities[action] || 0) * 100).toFixed(1)}%`}
                    />
                  ))}
                </div>

                <Badge color={ACTION_COLORS[agent.selectedAction]} filled>
                  {agent.selectedAction}
                </Badge>
              </div>
            ))}
          </div>
        ))}

        {/* Legend */}
        <div style={{
          display: "flex",
          gap: 12,
          marginTop: space.sm,
          paddingTop: space.sm,
          borderTop: `1px solid ${color.borderSubtle}`,
          justifyContent: "center",
        }}>
          {["LONG", "SHORT", "HOLD"].map((action) => (
            <div key={action} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{
                width: 8,
                height: 8,
                borderRadius: 2,
                background: ACTION_COLORS[action],
              }} />
              <span style={{ fontSize: font.size.xxs, color: color.textDim }}>{action}</span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

export default memo(PolicyComparison);
