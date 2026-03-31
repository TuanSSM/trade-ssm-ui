import { useContext, memo } from "react";
import { MarketContext } from "../../context/MarketContext";
import { useAgents, usePositions, usePullback, useEquityCurve } from "../../hooks";
import { Card, CardHead, CardBody, CardTitle } from "../../components/ui/Card";
import MetricCards from "./MetricCards";
import ChartPanel from "./ChartPanel";
import PullbackZones from "./PullbackZones";
import AgentConsensus from "./AgentConsensus";
import ExchangeExposure from "./ExchangeExposure";
import EquityCurve from "./EquityCurve";

function Dashboard({ modeFilter }) {
  const {
    candles, envelopes, atr, cvd, price,
    tf, setTF, envEMA, setEnvEMA, envMult, setEnvMult,
  } = useContext(MarketContext);

  const { agents, filteredAgents } = useAgents(modeFilter);
  const { positions, net, hedgeRatio, totalPnL } = usePositions(agents, price);
  const pullback = usePullback(envelopes, price);
  const equity = useEquityCurve(totalPnL);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10, padding: 14 }}>
      <MetricCards
        net={net}
        hedgeRatio={hedgeRatio}
        totalPnL={totalPnL}
        positionCount={positions.length}
        agents={agents}
      />

      <div style={{ gridColumn: "1 / -1", display: "grid", gridTemplateColumns: "minmax(0, 3fr) minmax(240px, 1fr)", gap: 10 }}>
        <ChartPanel
          candles={candles}
          envelopes={envelopes}
          atr={atr}
          cvd={cvd}
          tf={tf}
          setTF={setTF}
          envEMA={envEMA}
          setEnvEMA={setEnvEMA}
          envMult={envMult}
          setEnvMult={setEnvMult}
        />

        <Card>
          <CardHead>
            <CardTitle>MA Pullback Zones</CardTitle>
          </CardHead>
          <CardBody>
            <PullbackZones pullback={pullback} />
            <div style={{ marginTop: 10, borderTop: "1px solid #161628", paddingTop: 8 }}>
              <AgentConsensus agents={filteredAgents} />
            </div>
          </CardBody>
        </Card>
      </div>

      <EquityCurve
        values={equity.values}
        current={equity.current}
        peak={equity.peak}
        drawdown={equity.drawdown}
        returnPct={equity.returnPct}
        initialBalance={equity.initialBalance}
      />

      <div style={{ gridColumn: "1 / -1" }}>
        <ExchangeExposure positions={positions} />
      </div>
    </div>
  );
}

export default memo(Dashboard);
