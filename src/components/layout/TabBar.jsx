import { memo, useCallback } from "react";
import { color, font } from "../../styles/tokens";
import * as mixins from "../../styles/mixins";
import { MODES, MODE_COLORS } from "../../constants";

const TABS = [
  ["dashboard", "\u25C8 Dashboard"],
  ["positions", "\u2B21 Positions"],
  ["agents", "\u2699 Agents"],
  ["analysis", "\u25E4 Envelopes"],
  ["aggr", "\u25C9 aggr.trade"],
];

const s = {
  bar: {
    padding: "6px 14px 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },
  tabs: { display: "flex", gap: 1, background: "#0c0c14", borderRadius: 7, padding: 2 },
  tab: (active) => ({
    padding: "6px 12px",
    borderRadius: 5,
    border: "none",
    background: active ? "#16162a" : "transparent",
    color: active ? color.bull : color.textDim,
    fontSize: font.size.xs,
    fontWeight: active ? 600 : 400,
    cursor: "pointer",
    fontFamily: font.mono,
    transition: "all .15s",
  }),
};

function TabBar({ tab, setTab, modeFilter, setModeFilter }) {
  const handleKeyDown = useCallback(
    (e) => {
      const tabKeys = TABS.map(([k]) => k);
      const idx = tabKeys.indexOf(tab);
      if (e.key === "ArrowRight" && idx < tabKeys.length - 1) {
        e.preventDefault();
        setTab(tabKeys[idx + 1]);
      } else if (e.key === "ArrowLeft" && idx > 0) {
        e.preventDefault();
        setTab(tabKeys[idx - 1]);
      }
    },
    [tab, setTab]
  );

  return (
    <nav style={s.bar} aria-label="Main navigation">
      <div style={s.tabs} role="tablist" aria-label="Dashboard tabs" onKeyDown={handleKeyDown}>
        {TABS.map(([k, l]) => (
          <button
            key={k}
            style={s.tab(tab === k)}
            onClick={() => setTab(k)}
            role="tab"
            aria-selected={tab === k}
            aria-controls={`tabpanel-${k}`}
            tabIndex={tab === k ? 0 : -1}
          >
            {l}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 3 }} role="group" aria-label="Mode filter">
        <button style={mixins.modeBtn(modeFilter === "ALL", "#888")} onClick={() => setModeFilter("ALL")} aria-pressed={modeFilter === "ALL"}>
          ALL
        </button>
        {MODES.map((m) => (
          <button
            key={m}
            style={mixins.modeBtn(modeFilter === m, MODE_COLORS[m])}
            onClick={() => setModeFilter(m)}
            aria-pressed={modeFilter === m}
          >
            {m.slice(0, 4)}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default memo(TabBar);
