import { memo } from "react";
import { Card, CardBody } from "../../components/ui/Card";
import { color, font } from "../../styles/tokens";

function TrainingMetricCards({ currentMetrics }) {
  if (!currentMetrics) return null;

  const metrics = [
    {
      label: "Episode Reward",
      value: currentMetrics.totalReward.toFixed(1),
      sub: `Avg: ${currentMetrics.avgReward.toFixed(1)}`,
      color: currentMetrics.totalReward >= 0 ? color.reward : color.loss,
    },
    {
      label: "Policy Loss",
      value: currentMetrics.loss.toFixed(4),
      sub: `A: ${currentMetrics.actorLoss.toFixed(4)} C: ${currentMetrics.criticLoss.toFixed(4)}`,
      color: color.orange,
    },
    {
      label: "Win Rate",
      value: `${(currentMetrics.winRate * 100).toFixed(1)}%`,
      sub: `${currentMetrics.tradesExecuted} trades`,
      color: currentMetrics.winRate >= 0.5 ? color.reward : color.loss,
    },
    {
      label: "Sharpe Ratio",
      value: currentMetrics.sharpeRatio.toFixed(2),
      sub: `DD: ${currentMetrics.maxDrawdown}%`,
      color: currentMetrics.sharpeRatio >= 0 ? color.reward : color.loss,
    },
  ];

  return (
    <>
      {metrics.map((m, i) => (
        <Card key={i}>
          <CardBody style={{ textAlign: "center" }}>
            <div style={{
              fontSize: font.size.xxs,
              color: color.textGhost,
              textTransform: "uppercase",
              letterSpacing: ".08em",
            }}>
              {m.label}
            </div>
            <div style={{
              fontSize: font.size.xxxl,
              fontWeight: 700,
              color: m.color,
              margin: "6px 0 2px",
            }}>
              {m.value}
            </div>
            <div style={{
              fontSize: font.size.xxs,
              color: m.color,
              opacity: 0.6,
            }}>
              {m.sub}
            </div>
          </CardBody>
        </Card>
      ))}
    </>
  );
}

export default memo(TrainingMetricCards);
