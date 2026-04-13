import { useRef, useEffect, memo } from "react";
import { createChart, ColorType } from "lightweight-charts";
import { color, font } from "../../styles/tokens";

function LightweightChart({
  candles = [],
  markers = [],
  lines = [],
  overlays = [],
  width = 680,
  height = 320,
}) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const overlaySeriesRefs = useRef([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      width,
      height,
      layout: {
        background: { type: ColorType.Solid, color: color.bg },
        textColor: color.textDim,
        fontFamily: font.mono,
        fontSize: 10,
      },
      grid: {
        vertLines: { color: color.border },
        horzLines: { color: color.border },
      },
      crosshair: {
        vertLine: { color: color.textGhost, width: 1, style: 2 },
        horzLine: { color: color.textGhost, width: 1, style: 2 },
      },
      rightPriceScale: {
        borderColor: color.border,
        scaleMargins: { top: 0.1, bottom: 0.1 },
      },
      timeScale: {
        borderColor: color.border,
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: color.bull,
      downColor: color.bear,
      borderUpColor: color.bull,
      borderDownColor: color.bear,
      wickUpColor: color.bull,
      wickDownColor: color.bear,
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;

    return () => {
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
      overlaySeriesRefs.current = [];
    };
  }, []);

  // Resize
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.resize(width, height);
    }
  }, [width, height]);

  // Update candle data
  useEffect(() => {
    if (!candleSeriesRef.current || !candles.length) return;

    const data = candles.map((c, i) => ({
      time: Math.floor((c.t || Date.now() - (candles.length - i) * 60000) / 1000),
      open: c.o,
      high: c.h,
      low: c.l,
      close: c.c,
    }));

    // Deduplicate and sort by time
    const seen = new Set();
    const deduped = [];
    for (const d of data) {
      if (!seen.has(d.time)) {
        seen.add(d.time);
        deduped.push(d);
      }
    }
    deduped.sort((a, b) => a.time - b.time);

    candleSeriesRef.current.setData(deduped);
    chartRef.current?.timeScale().fitContent();
  }, [candles]);

  // Update markers
  useEffect(() => {
    if (!candleSeriesRef.current || !markers.length) return;

    const chartMarkers = markers
      .map((m) => ({
        time: Math.floor(m.time / 1000),
        position: m.type === "entry"
          ? (m.side === "LONG" ? "belowBar" : "aboveBar")
          : "inBar",
        color: m.type === "entry"
          ? (m.side === "LONG" ? color.bull : color.bear)
          : color.purple,
        shape: m.type === "entry"
          ? (m.side === "LONG" ? "arrowUp" : "arrowDown")
          : "circle",
        text: m.type === "entry"
          ? m.side
          : `${m.pnl >= 0 ? "+" : ""}${m.pnl?.toFixed(0)}`,
      }))
      .sort((a, b) => a.time - b.time);

    candleSeriesRef.current.setMarkers(chartMarkers);
  }, [markers]);

  // Update price lines
  useEffect(() => {
    if (!candleSeriesRef.current) return;

    // Remove existing price lines by recreating
    lines.forEach((line) => {
      candleSeriesRef.current.createPriceLine({
        price: line.price,
        color: line.color || color.cyan,
        lineWidth: line.lineWidth || 1,
        lineStyle: 2,
        axisLabelVisible: true,
        title: line.title || "",
      });
    });
  }, [lines]);

  // Update overlays (line series)
  useEffect(() => {
    if (!chartRef.current) return;

    // Remove old overlay series
    overlaySeriesRefs.current.forEach((s) => {
      try { chartRef.current.removeSeries(s); } catch { /* already removed */ }
    });
    overlaySeriesRefs.current = [];

    overlays.forEach((overlay) => {
      if (!overlay.data?.length) return;
      const series = chartRef.current.addLineSeries({
        color: overlay.color || color.purple,
        lineWidth: overlay.lineWidth || 1,
        crosshairMarkerVisible: false,
        priceLineVisible: false,
        lastValueVisible: false,
      });

      const lineData = overlay.data
        .map((val, i) => ({
          time: Math.floor((candles[i]?.t || Date.now() - (overlay.data.length - i) * 60000) / 1000),
          value: val,
        }))
        .filter((d) => d.value != null && isFinite(d.value));

      // Deduplicate
      const seen = new Set();
      const deduped = [];
      for (const d of lineData) {
        if (!seen.has(d.time)) {
          seen.add(d.time);
          deduped.push(d);
        }
      }
      deduped.sort((a, b) => a.time - b.time);

      if (deduped.length) series.setData(deduped);
      overlaySeriesRefs.current.push(series);
    });
  }, [overlays, candles]);

  return (
    <div
      ref={containerRef}
      style={{ borderRadius: 5, overflow: "hidden" }}
    />
  );
}

export default memo(LightweightChart);
