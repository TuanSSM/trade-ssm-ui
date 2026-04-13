import { useState, useContext, memo } from "react";
import { MarketContext } from "../../context/MarketContext";
import { TrainingContext } from "../../context/TrainingContext";
import { useTradeHistory } from "../../hooks/useTradeHistory";
import { color, space, font } from "../../styles/tokens";

import TrainingStatusBar from "./TrainingStatusBar";
import TrainingMetricCards from "./TrainingMetricCards";
import RewardCurveChart from "./RewardCurveChart";
import ExplorationChart from "./ExplorationChart";
import PerformanceChart from "./PerformanceChart";
import TradeOverlayChart from "./TradeOverlayChart";
import TradeReasonPanel from "./TradeReasonPanel";
import TradeTable from "./TradeTable";

const s = {
  container: {
    padding: `${space.md}px ${space.lg}px`,
  },
  metricGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: space.md,
    marginBottom: space.md,
  },
  chartGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: space.md,
    marginBottom: space.md,
  },
  tradeSection: {
    display: "grid",
    gridTemplateColumns: "1fr 320px",
    gap: space.md,
    marginBottom: space.md,
  },
  sectionTitle: {
    fontSize: font.size.xs,
    color: color.textGhost,
    textTransform: "uppercase",
    letterSpacing: ".1em",
    marginBottom: space.md,
    marginTop: space.lg,
  },
};

function TrainingDashboard() {
  const { candles, envelopes } = useContext(MarketContext);
  const training = useContext(TrainingContext);
  const { completedTrades, tradeStats } = useTradeHistory(candles);
  const [selectedTrade, setSelectedTrade] = useState(null);

  if (!training) return null;

  const {
    session, isTraining, toggleTraining,
    rewardCurve, lossCurve, explorationCurve, lrCurve,
    winRateCurve, sharpeCurve, currentMetrics,
  } = training;

  return (
    <div style={s.container}>
      <TrainingStatusBar session={session} isTraining={isTraining} onToggle={toggleTraining} />

      <div style={s.metricGrid} className="responsive-grid-4">
        <TrainingMetricCards currentMetrics={currentMetrics} session={session} />
      </div>

      <div style={s.sectionTitle}>Training Curves</div>
      <div style={s.chartGrid}>
        <RewardCurveChart rewardCurve={rewardCurve} lossCurve={lossCurve} />
        <ExplorationChart explorationCurve={explorationCurve} lrCurve={lrCurve} />
      </div>

      <div style={{ marginBottom: space.md }}>
        <PerformanceChart winRateCurve={winRateCurve} sharpeCurve={sharpeCurve} />
      </div>

      <div style={s.sectionTitle}>Trade Execution</div>
      <TradeOverlayChart
        candles={candles}
        trades={completedTrades}
        envelopes={envelopes}
        selectedTrade={selectedTrade}
        onSelectTrade={setSelectedTrade}
      />

      <div style={{ ...s.sectionTitle, marginTop: space.lg }}>
        Trade Log
        <span style={{ fontSize: font.size.xxs, color: color.textFaint, marginLeft: 8, textTransform: "none", letterSpacing: 0 }}>
          {tradeStats.totalTrades} total \u00B7 {(tradeStats.winRate * 100).toFixed(0)}% win \u00B7 PF {tradeStats.profitFactor}
        </span>
      </div>
      <div style={s.tradeSection}>
        <TradeTable
          trades={completedTrades}
          selectedId={selectedTrade?.id}
          onSelect={setSelectedTrade}
        />
        <TradeReasonPanel trade={selectedTrade} />
      </div>
    </div>
  );
}

export default memo(TrainingDashboard);
