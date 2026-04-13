import { useRef, useState, useEffect, memo } from "react";
import { Card, CardHead, CardBody, CardTitle } from "../../components/ui/Card";
import { TrainingChart } from "../../components/charts";
import { color } from "../../styles/tokens";

function ExplorationChart({ explorationCurve, lrCurve }) {
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
        <CardTitle>Exploration &amp; Learning Rate</CardTitle>
      </CardHead>
      <CardBody>
        <div ref={ref}>
          <TrainingChart
            data={explorationCurve}
            label="Exploration \u03B5"
            lineColor={color.exploration}
            secondaryData={lrCurve}
            secondaryColor={color.orange}
            secondaryLabel="Learning Rate"
            height={160}
            width={w}
          />
        </div>
      </CardBody>
    </Card>
  );
}

export default memo(ExplorationChart);
