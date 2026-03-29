import { useContext } from "react";
import { MarketContext } from "../../context/MarketContext";
import { useAgents } from "../../hooks";
import { usePositions } from "../../hooks";
import { usePullback } from "../../hooks";
import { Card, CardHead, CardBody, CardTitle } from "../../components/ui/Card";
import MetricCards from "./MetricCards";
import ChartPanel from "./ChartPanel";
import PullbackZones from "./PullbackZones";
import AgentConsensus from "./AgentConsensus";
import ExchangeExposure from "./ExchangeExposure";

export default function Dashboard({ modeFilter }) {
  const {
    candles,
    envelopes,
    atr,
    cvd,
    price,
    tf,
    setTF,
    envEMA,
    setEnvEMA,
    envMult,
    setEnvMult,
  } = useContext(MarketContext);

  const { agents, filteredAgents } = useAgents(modeFilter);
  const { positions, net, hedgeRatio, totalPnL } = usePositions(agents);
  const pullback = usePullback(envelopes, price);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, padding: 14 }}>
      <MetricCards
        net={net}
        hedgeRatio={hedgeRatio}
        totalPnL={totalPnL}
        positionCount={positions.length}
        agents={agents}
      />

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

      <Card style={{ gridColumn: "4/5" }}>
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

      <ExchangeExposure positions={positions} />
    </div>
  );
}
