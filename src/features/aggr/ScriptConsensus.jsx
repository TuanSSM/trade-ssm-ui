import { AGGR_SCRIPTS } from "../../constants";
import { color, font } from "../../styles/tokens";
import * as mixins from "../../styles/mixins";

export default function ScriptConsensus() {
  const longCount = AGGR_SCRIPTS.filter((s) => s.signal === "LONG").length;
  const shortCount = AGGR_SCRIPTS.filter((s) => s.signal === "SHORT").length;
  const bothCount = AGGR_SCRIPTS.filter((s) => s.signal === "BOTH").length;
  const neutralCount = AGGR_SCRIPTS.filter((s) => s.signal === "NEUTRAL").length;
  const consensus = longCount > shortCount ? "BULLISH" : longCount < shortCount ? "BEARISH" : "MIXED";
  const consensusColor = consensus === "BULLISH" ? color.bull : consensus === "BEARISH" ? color.bear : color.orange;

  return (
    <div
      style={{
        marginTop: 10,
        padding: 10,
        background: color.surfaceAlt,
        borderRadius: 6,
        border: `1px solid ${color.border}`,
      }}
    >
      <div style={{ fontSize: font.size.xs, fontWeight: 700, color: color.cyan, marginBottom: 6 }}>
        SCRIPT CONSENSUS
      </div>
      <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        {[
          { l: "LONG", v: longCount, c: color.bull },
          { l: "SHORT", v: shortCount, c: color.bear },
          { l: "BOTH", v: bothCount, c: color.purple },
          { l: "NEUTRAL", v: neutralCount, c: color.textMuted },
        ].map((item) => (
          <div key={item.l} style={{ textAlign: "center" }}>
            <div style={{ fontSize: font.size.xxl, fontWeight: 700, color: item.c }}>{item.v}</div>
            <div style={{ fontSize: font.size.xxs, color: color.textGhost }}>{item.l}</div>
          </div>
        ))}
        <div style={{ flex: 1, textAlign: "right" }}>
          <span style={mixins.badge(consensusColor, true)}>CONSENSUS: {consensus}</span>
        </div>
      </div>
    </div>
  );
}
