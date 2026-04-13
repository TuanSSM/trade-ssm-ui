import { useRef, useState, useEffect, memo } from "react";
import { Card, CardHead, CardBody, CardTitle } from "../../components/ui/Card";
import { TrainingChart } from "../../components/charts";
import { color } from "../../styles/tokens";

function RewardCurveChart({ rewardCurve, lossCurve }) {
  const ref = useRef(null);
  const [w, setW] = useState(400);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new ResizeObserver((entries) => {
      for (const e of entries) setW(Math.floor(e.contentRect.width));
    });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <Card>
      <CardHead>
        <CardTitle>Reward &amp; Loss Curves</CardTitle>
      </CardHead>
      <CardBody>
        <div ref={ref}>
          <TrainingChart
            data={rewardCurve}
            label="Reward"
            lineColor={color.reward}
            secondaryData={lossCurve}
            secondaryColor={color.loss}
            secondaryLabel="Loss"
            height={160}
            width={w}
            showArea
          />
        </div>
      </CardBody>
    </Card>
  );
}

export default memo(RewardCurveChart);
