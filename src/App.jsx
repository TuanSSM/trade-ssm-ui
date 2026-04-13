import { useState, useContext } from "react";
import MarketProvider, { MarketContext } from "./context/MarketContext";
import TrainingProvider, { TrainingContext } from "./context/TrainingContext";
import { ToastProvider } from "./components/ui/Toast";
import { Header, TabBar, Footer } from "./components/layout";
import { EXCHANGES } from "./constants";
import { useAgents, usePositions } from "./hooks";
import { color, font } from "./styles/tokens";

import { Dashboard } from "./features/dashboard";
import { PositionsTab } from "./features/positions";
import { AgentsTab } from "./features/agents";
import { TrainingTab } from "./features/training";
import { DecisionsTab } from "./features/decisions";
import { AnalysisTab } from "./features/analysis";
import { AggrTab } from "./features/aggr";

function AppContent() {
  const [tab, setTab] = useState("dashboard");
  const [modeFilter, setModeFilter] = useState("ALL");
  const { price, priceChange, tick, envEMA, envMult } = useContext(MarketContext);
  const training = useContext(TrainingContext);
  const { agents } = useAgents(modeFilter);
  const { positions } = usePositions(agents, price);

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

        /* Focus indicators for accessibility */
        button:focus-visible, [role="option"]:focus-visible, [tabindex]:focus-visible, select:focus-visible, input:focus-visible {
          outline: 2px solid #06b6d4;
          outline-offset: 1px;
        }
        button:focus:not(:focus-visible) { outline: none; }

        /* Responsive overrides */
        @media (max-width: 768px) {
          .responsive-grid-4 { grid-template-columns: 1fr 1fr !important; }
          .responsive-grid-2 { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .responsive-grid-4 { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Header price={price} priceChange={priceChange} agentCount={agents.length} />
      <TabBar tab={tab} setTab={setTab} modeFilter={modeFilter} setModeFilter={setModeFilter} />

      <main role="main" aria-label={`${tab} tab content`}>
        {tab === "dashboard" && <Dashboard modeFilter={modeFilter} />}
        {tab === "positions" && <PositionsTab modeFilter={modeFilter} />}
        {tab === "agents" && <AgentsTab modeFilter={modeFilter} />}
        {tab === "training" && <TrainingTab />}
        {tab === "decisions" && <DecisionsTab modeFilter={modeFilter} />}
        {tab === "analysis" && <AnalysisTab modeFilter={modeFilter} />}
        {tab === "aggr" && <AggrTab />}
      </main>

      <Footer
        agentCount={agents.length}
        positionCount={positions.length}
        exchangeCount={EXCHANGES.length}
        tick={tick}
        envEMA={envEMA}
        envMult={envMult}
        trainingStatus={training?.session?.status}
      />
    </div>
  );
}

export default function App() {
  return (
    <MarketProvider>
      <TrainingProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </TrainingProvider>
    </MarketProvider>
  );
}
