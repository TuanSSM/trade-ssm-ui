import { memo } from "react";
import { Card, CardHead, CardBody, CardTitle } from "../../components/ui/Card";
import { color, font, space } from "../../styles/tokens";

function FeatureImportance({ features }) {
  if (!features?.length) {
    return (
      <Card>
        <CardHead><CardTitle>State Feature Importance</CardTitle></CardHead>
        <CardBody>
          <div style={{ color: color.textFaint, fontSize: font.size.xs, textAlign: "center", padding: 20 }}>
            No data
          </div>
        </CardBody>
      </Card>
    );
  }

  const maxImportance = Math.max(...features.map((f) => f.importance), 0.01);

  return (
    <Card>
      <CardHead><CardTitle>State Feature Importance</CardTitle></CardHead>
      <CardBody>
        {features.map((f, i) => (
          <div
            key={f.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: i < features.length - 1 ? 5 : 0,
            }}
          >
            <span style={{
              fontSize: font.size.xxs,
              color: color.textDim,
              width: 100,
              flexShrink: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {f.name}
            </span>

            <div style={{
              flex: 1,
              height: 12,
              background: color.borderSubtle,
              borderRadius: 3,
              overflow: "hidden",
            }}>
              <div style={{
                height: "100%",
                width: `${(f.importance / maxImportance) * 100}%`,
                background: `linear-gradient(90deg, ${color.cyan}80, ${color.cyan})`,
                borderRadius: 3,
                transition: "width 0.3s",
                opacity: 0.4 + (f.importance / maxImportance) * 0.6,
              }} />
            </div>

            <span style={{
              fontSize: font.size.xxs,
              color: color.textFaint,
              width: 36,
              textAlign: "right",
            }}>
              {(f.importance * 100).toFixed(1)}%
            </span>

            <span style={{
              fontSize: font.size.xxs,
              color: f.value >= 0 ? color.bull : color.bear,
              width: 40,
              textAlign: "right",
              fontWeight: font.weight.semibold,
            }}>
              {f.value >= 0 ? "+" : ""}{f.value}
            </span>
          </div>
        ))}

        <div style={{
          marginTop: space.md,
          paddingTop: space.sm,
          borderTop: `1px solid ${color.borderSubtle}`,
          fontSize: font.size.xxs,
          color: color.textGhost,
        }}>
          Features sorted by importance. Bar = weight, value = current state observation.
        </div>
      </CardBody>
    </Card>
  );
}

export default memo(FeatureImportance);
