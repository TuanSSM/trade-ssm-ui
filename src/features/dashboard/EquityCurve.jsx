import { memo } from "react";
import { Card, CardHead, CardBody, CardTitle } from "../../components/ui/Card";
import { Spark } from "../../components/charts";
import { fmt, fmtP } from "../../utils";
import { color, font } from "../../styles/tokens";

function EquityCurve({ values, current, peak, drawdown, returnPct, initialBalance }) {
  const curveColor = returnPct >= 0 ? color.bull : color.bear;

  return (
    <Card style={{ gridColumn: "1 / -1" }}>
      <CardHead>
        <CardTitle>Equity Curve</CardTitle>
        <div style={{ display: "flex", gap: 16, fontSize: font.size.xxs }}>
          <span style={{ color: color.textFaint }}>
            Balance: <span style={{ color: color.textBright, fontWeight: 600 }}>${fmt(current)}</span>
          </span>
          <span style={{ color: color.textFaint }}>
            Return: <span style={{ color: curveColor, fontWeight: 600 }}>{fmtP(returnPct)}%</span>
          </span>
          <span style={{ color: color.textFaint }}>
            Peak: <span style={{ color: color.textBright }}>${fmt(peak)}</span>
          </span>
          <span style={{ color: color.textFaint }}>
            Drawdown: <span style={{ color: drawdown > 2 ? color.bear : color.orange, fontWeight: 600 }}>
              {drawdown.toFixed(2)}%
            </span>
          </span>
        </div>
      </CardHead>
      <CardBody>
        <Spark data={values} color={curveColor} w={800} h={60} />
      </CardBody>
    </Card>
  );
}

export default memo(EquityCurve);
