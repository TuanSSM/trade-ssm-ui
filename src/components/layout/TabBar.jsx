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

export default function TabBar({ tab, setTab, modeFilter, setModeFilter }) {
  return (
    <div style={s.bar}>
      <div style={s.tabs}>
        {TABS.map(([k, l]) => (
          <button key={k} style={s.tab(tab === k)} onClick={() => setTab(k)}>
            {l}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 3 }}>
        <button style={mixins.modeBtn(modeFilter === "ALL", "#888")} onClick={() => setModeFilter("ALL")}>
          ALL
        </button>
        {MODES.map((m) => (
          <button
            key={m}
            style={mixins.modeBtn(modeFilter === m, MODE_COLORS[m])}
            onClick={() => setModeFilter(m)}
          >
            {m.slice(0, 4)}
          </button>
        ))}
      </div>
    </div>
  );
}
