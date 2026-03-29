import { useState, useContext } from "react";
import MarketProvider, { MarketContext } from "./context/MarketContext";
import { Header, TabBar, Footer } from "./components/layout";
import { EXCHANGES } from "./constants";
import { useAgents, usePositions } from "./hooks";
import { color, font } from "./styles/tokens";

import { Dashboard } from "./features/dashboard";
import { PositionsTab } from "./features/positions";
import { AgentsTab } from "./features/agents";
import { AnalysisTab } from "./features/analysis";
import { AggrTab } from "./features/aggr";

function AppContent() {
  const [tab, setTab] = useState("dashboard");
  const [modeFilter, setModeFilter] = useState("ALL");
  const { price, priceChange, tick, envEMA, envMult } = useContext(MarketContext);
  const { agents } = useAgents(modeFilter);
  const { positions } = usePositions(agents);

  return (
    <div
      style={{
        background: color.bg,
        color: color.text,
        fontFamily: font.mono,
        minHeight: "100vh",
        fontSize: font.size.md,
      }}
    >
      <style>{`
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.4; } }
        @keyframes slideIn { from { opacity:0; transform:translateY(4px); } to { opacity:1; transform:translateY(0); } }
        .anim-row { animation: slideIn .3s ease; }
        *::-webkit-scrollbar { width:4px; height:4px; }
        *::-webkit-scrollbar-track { background:#08080d; }
        *::-webkit-scrollbar-thumb { background:#222; border-radius:2px; }
        body { margin: 0; }
      `}</style>

      <Header price={price} priceChange={priceChange} agentCount={agents.length} />
      <TabBar tab={tab} setTab={setTab} modeFilter={modeFilter} setModeFilter={setModeFilter} />

      {tab === "dashboard" && <Dashboard modeFilter={modeFilter} />}
      {tab === "positions" && <PositionsTab modeFilter={modeFilter} />}
      {tab === "agents" && <AgentsTab modeFilter={modeFilter} />}
      {tab === "analysis" && <AnalysisTab modeFilter={modeFilter} />}
      {tab === "aggr" && <AggrTab />}

      <Footer
        agentCount={agents.length}
        positionCount={positions.length}
        exchangeCount={EXCHANGES.length}
        tick={tick}
        envEMA={envEMA}
        envMult={envMult}
      />
    </div>
  );
}

export default function App() {
  return (
    <MarketProvider>
      <AppContent />
    </MarketProvider>
  );
}
