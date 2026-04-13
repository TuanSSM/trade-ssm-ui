import { useRef, useEffect, memo } from "react";
import { createChart, ColorType } from "lightweight-charts";
import { color, font } from "../../styles/tokens";

function TrainingChart({
  data = [],
  label = "",
  lineColor = color.bull,
  height = 120,
  width = 400,
  showArea = false,
  secondaryData = null,
  secondaryColor = color.bear,
  secondaryLabel = "",
}) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const secondaryRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      width,
      height,
      layout: {
        background: { type: ColorType.Solid, color: color.surface },
        textColor: color.textDim,
        fontFamily: font.mono,
        fontSize: 9,
      },
      grid: {
        vertLines: { color: color.borderSubtle },
        horzLines: { color: color.borderSubtle },
      },
      rightPriceScale: {
        borderColor: color.border,
        scaleMargins: { top: 0.15, bottom: 0.1 },
      },
      timeScale: {
        borderColor: color.border,
        visible: false,
      },
      crosshair: {
        vertLine: { color: color.textGhost, width: 1, style: 2 },
        horzLine: { color: color.textGhost, width: 1, style: 2 },
      },
      handleScale: false,
      handleScroll: false,
    });

    const primary = showArea
      ? chart.addAreaSeries({
          lineColor,
          topColor: lineColor + "40",
          bottomColor: lineColor + "08",
          lineWidth: 2,
          crosshairMarkerVisible: false,
          priceLineVisible: false,
          lastValueVisible: true,
        })
      : chart.addLineSeries({
          color: lineColor,
          lineWidth: 2,
          crosshairMarkerVisible: false,
          priceLineVisible: false,
          lastValueVisible: true,
        });

    chartRef.current = chart;
    seriesRef.current = primary;

    return () => {
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
      secondaryRef.current = null;
    };
  }, []);

  // Resize
  useEffect(() => {
    if (chartRef.current) chartRef.current.resize(width, height);
  }, [width, height]);

  // Update primary data
  useEffect(() => {
    if (!seriesRef.current || !data.length) return;

    const lineData = data.map((val, i) => ({
      time: i,
      value: val,
    }));

    seriesRef.current.setData(lineData);
    chartRef.current?.timeScale().fitContent();
  }, [data]);

  // Update secondary data
  useEffect(() => {
    if (!chartRef.current) return;

    if (secondaryRef.current) {
      try { chartRef.current.removeSeries(secondaryRef.current); } catch { /* ok */ }
      secondaryRef.current = null;
    }

    if (secondaryData?.length) {
      const sec = chartRef.current.addLineSeries({
        color: secondaryColor,
        lineWidth: 2,
        crosshairMarkerVisible: false,
        priceLineVisible: false,
        lastValueVisible: true,
      });

      sec.setData(secondaryData.map((val, i) => ({ time: i, value: val })));
      secondaryRef.current = sec;
      chartRef.current.timeScale().fitContent();
    }
  }, [secondaryData, secondaryColor]);

  return (
    <div style={{ position: "relative" }}>
      {label && (
        <div
          style={{
            position: "absolute",
            top: 4,
            left: 8,
            zIndex: 1,
            fontSize: font.size.xxs,
            color: color.textFaint,
            pointerEvents: "none",
          }}
        >
          {label}
          {secondaryLabel && (
            <span style={{ color: secondaryColor, marginLeft: 8 }}>
              {secondaryLabel}
            </span>
          )}
        </div>
      )}
      <div ref={containerRef} style={{ borderRadius: 5, overflow: "hidden" }} />
    </div>
  );
}

export default memo(TrainingChart);
