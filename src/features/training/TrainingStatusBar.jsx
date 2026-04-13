import { memo } from "react";
import { color, font, radius, space } from "../../styles/tokens";
import Badge from "../../components/ui/Badge";

const s = {
  bar: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
    padding: `${space.md}px ${space.lg}px`,
    background: color.surface,
    border: `1px solid ${color.border}`,
    borderRadius: radius.xxl,
    marginBottom: space.md,
  },
  label: {
    fontSize: font.size.xxs,
    color: color.textGhost,
    textTransform: "uppercase",
    letterSpacing: ".06em",
  },
  value: {
    fontSize: font.size.sm,
    color: color.textBright,
    fontWeight: font.weight.semibold,
  },
  progressBar: {
    flex: 1,
    minWidth: 100,
    height: 6,
    background: color.borderSubtle,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: (pct) => ({
    height: "100%",
    width: `${pct}%`,
    background: `linear-gradient(90deg, ${color.cyan}, ${color.bull})`,
    borderRadius: 3,
    transition: "width 0.5s ease",
  }),
  btn: (active) => ({
    padding: "4px 12px",
    borderRadius: radius.md,
    border: `1px solid ${active ? color.bull : color.bear}40`,
    background: `${active ? color.bull : color.bear}15`,
    color: active ? color.bull : color.bear,
    fontSize: font.size.xxs,
    fontWeight: font.weight.semibold,
    cursor: "pointer",
    fontFamily: font.mono,
  }),
  stat: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
  },
};

function TrainingStatusBar({ session, isTraining, onToggle }) {
  const progress = ((session.currentEpisode / session.totalEpisodes) * 100).toFixed(1);

  return (
    <div style={s.bar} role="status" aria-label="Training status">
      <div style={s.stat}>
        <span style={s.label}>Algorithm</span>
        <Badge color={color.purple} filled>{session.algorithm}</Badge>
      </div>

      <div style={s.stat}>
        <span style={s.label}>Session</span>
        <span style={s.value}>{session.sessionId}</span>
      </div>

      <div style={s.stat}>
        <span style={s.label}>Episode</span>
        <span style={s.value}>{session.currentEpisode.toLocaleString()} / {session.totalEpisodes.toLocaleString()}</span>
      </div>

      <div style={{ ...s.stat, flex: 1, minWidth: 80 }}>
        <span style={s.label}>Progress {progress}%</span>
        <div style={s.progressBar}>
          <div style={s.progressFill(parseFloat(progress))} />
        </div>
      </div>

      <div style={s.stat}>
        <span style={s.label}>LR</span>
        <span style={{ ...s.value, color: color.orange }}>{session.learningRate.toExponential(2)}</span>
      </div>

      <div style={s.stat}>
        <span style={s.label}>Explore</span>
        <span style={{ ...s.value, color: color.cyan }}>{(session.explorationRate * 100).toFixed(1)}%</span>
      </div>

      <div style={s.stat}>
        <span style={s.label}>Status</span>
        <Badge color={isTraining ? color.bull : color.bear} filled>
          {session.status}
        </Badge>
      </div>

      <button
        style={s.btn(isTraining)}
        onClick={onToggle}
        aria-label={isTraining ? "Pause training" : "Resume training"}
      >
        {isTraining ? "\u2759\u2759 PAUSE" : "\u25B6 RESUME"}
      </button>
    </div>
  );
}

export default memo(TrainingStatusBar);
