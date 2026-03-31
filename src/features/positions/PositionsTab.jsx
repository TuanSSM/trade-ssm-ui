import { useState, useMemo, useContext, useCallback, memo } from "react";
import { MarketContext } from "../../context/MarketContext";
import { useAgents, usePositions } from "../../hooks";
import { Card, CardHead, CardBody, CardTitle } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import SearchInput from "../../components/ui/SearchInput";
import EmptyState from "../../components/ui/EmptyState";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { useToast } from "../../components/ui/Toast";
import { fmtP, exportToCSV } from "../../utils";
import { color, font } from "../../styles/tokens";
import { MODE_COLORS, MODE_ICONS, EXCHANGES } from "../../constants";
import * as mixins from "../../styles/mixins";

const SORT_KEYS = ["exchange", "side", "size", "entry", "current", "leverage", "pnl", "pnlPct", "agentId", "agentMode", "status"];

function SortableHeader({ label, sortKey, sortState, onSort }) {
  const active = sortState.key === sortKey;
  const arrow = active ? (sortState.dir === "asc" ? " \u25B2" : " \u25BC") : "";
  return (
    <th
      style={{ ...mixins.th, cursor: "pointer", userSelect: "none" }}
      onClick={() => onSort(sortKey)}
      role="columnheader"
      aria-sort={active ? (sortState.dir === "asc" ? "ascending" : "descending") : "none"}
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSort(sortKey)}
    >
      {label}{arrow}
    </th>
  );
}

function PositionsTab({ modeFilter }) {
  const { price } = useContext(MarketContext);
  const { agents } = useAgents(modeFilter);
  const { positions, closePosition } = usePositions(agents, price);
  const addToast = useToast();

  // Filters
  const [search, setSearch] = useState("");
  const [sideFilter, setSideFilter] = useState("ALL");
  const [exchangeFilter, setExchangeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Sort
  const [sortState, setSortState] = useState({ key: "pnl", dir: "desc" });

  // Confirm dialog
  const [confirmTarget, setConfirmTarget] = useState(null);

  const handleSort = useCallback((key) => {
    setSortState((prev) =>
      prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" }
    );
  }, []);

  const filtered = useMemo(() => {
    let result = modeFilter === "ALL" ? positions : positions.filter((p) => p.agentMode === modeFilter);

    if (sideFilter !== "ALL") result = result.filter((p) => p.side === sideFilter);
    if (exchangeFilter !== "ALL") result = result.filter((p) => p.exchange === exchangeFilter);
    if (statusFilter !== "ALL") result = result.filter((p) => p.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.exchange.toLowerCase().includes(q) ||
          p.agentId.toLowerCase().includes(q) ||
          p.pair.toLowerCase().includes(q)
      );
    }

    const { key, dir } = sortState;
    result = [...result].sort((a, b) => {
      const av = a[key], bv = b[key];
      const cmp = typeof av === "string" ? av.localeCompare(bv) : av - bv;
      return dir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [positions, modeFilter, sideFilter, exchangeFilter, statusFilter, search, sortState]);

  const handleClose = useCallback(() => {
    if (confirmTarget) {
      closePosition(confirmTarget.id);
      addToast?.(`Closed ${confirmTarget.side} ${confirmTarget.exchange} position`, "success");
      setConfirmTarget(null);
    }
  }, [confirmTarget, closePosition, addToast]);

  const handleExport = useCallback(() => {
    exportToCSV(
      filtered.map(({ id, exchange, side, size, entry, current, leverage, pnl, pnlPct, agentId, agentMode, status }) => ({
        id, exchange, side, size, entry, current, leverage, pnl, pnlPct, agentId, agentMode, status,
      })),
      "positions"
    );
    addToast?.(`Exported ${filtered.length} positions to CSV`, "info");
  }, [filtered, addToast]);

  const longCount = positions.filter((p) => p.side === "LONG").length;
  const shortCount = positions.filter((p) => p.side === "SHORT").length;

  return (
    <div style={{ padding: 14 }}>
      <Card>
        <CardHead>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CardTitle>Positions \u00B7 {positions.length}</CardTitle>
            <Badge color={color.bull}>{longCount} L</Badge>
            <Badge color={color.bear}>{shortCount} S</Badge>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <SearchInput value={search} onChange={setSearch} placeholder="Search..." />
            <select
              value={sideFilter}
              onChange={(e) => setSideFilter(e.target.value)}
              style={{ ...filterStyle, width: 70 }}
              aria-label="Filter by side"
            >
              <option value="ALL">Side</option>
              <option value="LONG">Long</option>
              <option value="SHORT">Short</option>
            </select>
            <select
              value={exchangeFilter}
              onChange={(e) => setExchangeFilter(e.target.value)}
              style={{ ...filterStyle, width: 90 }}
              aria-label="Filter by exchange"
            >
              <option value="ALL">Exchange</option>
              {EXCHANGES.map((ex) => <option key={ex} value={ex}>{ex}</option>)}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ ...filterStyle, width: 80 }}
              aria-label="Filter by status"
            >
              <option value="ALL">Status</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
            </select>
            <button onClick={handleExport} style={exportBtnStyle} title="Export to CSV" aria-label="Export positions to CSV">
              \u2913 CSV
            </button>
          </div>
        </CardHead>

        {filtered.length === 0 ? (
          <EmptyState
            icon="\u2B21"
            title="No positions found"
            message={search ? `No results for "${search}"` : "Adjust your filters to see positions"}
          />
        ) : (
          <div style={{ overflowX: "auto" }} role="region" aria-label="Positions table">
            <table style={mixins.table} role="table">
              <thead>
                <tr>
                  <SortableHeader label="Exchange" sortKey="exchange" sortState={sortState} onSort={handleSort} />
                  <SortableHeader label="Side" sortKey="side" sortState={sortState} onSort={handleSort} />
                  <SortableHeader label="Size" sortKey="size" sortState={sortState} onSort={handleSort} />
                  <SortableHeader label="Entry" sortKey="entry" sortState={sortState} onSort={handleSort} />
                  <SortableHeader label="Current" sortKey="current" sortState={sortState} onSort={handleSort} />
                  <SortableHeader label="Lev" sortKey="leverage" sortState={sortState} onSort={handleSort} />
                  <SortableHeader label="PnL ($)" sortKey="pnl" sortState={sortState} onSort={handleSort} />
                  <SortableHeader label="PnL (%)" sortKey="pnlPct" sortState={sortState} onSort={handleSort} />
                  <SortableHeader label="Agent" sortKey="agentId" sortState={sortState} onSort={handleSort} />
                  <SortableHeader label="Mode" sortKey="agentMode" sortState={sortState} onSort={handleSort} />
                  <SortableHeader label="Status" sortKey="status" sortState={sortState} onSort={handleSort} />
                  <th style={mixins.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="anim-row">
                    <td style={mixins.td}><span style={{ fontWeight: 600 }}>{p.exchange}</span></td>
                    <td style={mixins.td}><Badge color={p.side === "LONG" ? color.bull : color.bear}>{p.side}</Badge></td>
                    <td style={mixins.td}>{p.size}</td>
                    <td style={mixins.td}>${p.entry.toLocaleString()}</td>
                    <td style={mixins.td}>${p.current.toLocaleString()}</td>
                    <td style={mixins.td}>{p.leverage}\u00D7</td>
                    <td style={{ ...mixins.td, color: p.pnl >= 0 ? color.bull : color.bear, fontWeight: 600 }}>{fmtP(p.pnl)}</td>
                    <td style={{ ...mixins.td, color: p.pnlPct >= 0 ? color.bull : color.bear }}>{fmtP(p.pnlPct)}%</td>
                    <td style={{ ...mixins.td, fontSize: font.size.xxs, color: color.textDim }}>{p.agentId}</td>
                    <td style={mixins.td}>
                      <span style={{ fontSize: font.size.xxs, color: MODE_COLORS[p.agentMode] }}>
                        {MODE_ICONS[p.agentMode]} {p.agentMode.slice(0, 4)}
                      </span>
                    </td>
                    <td style={mixins.td}><Badge color={p.status === "ACTIVE" ? color.bull : color.orange}>{p.status}</Badge></td>
                    <td style={mixins.td}>
                      <button
                        onClick={() => setConfirmTarget(p)}
                        style={closeBtnStyle}
                        title="Close position"
                        aria-label={`Close ${p.side} position on ${p.exchange}`}
                      >
                        \u2715
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Summary row */}
        {filtered.length > 0 && (
          <div style={{ padding: "8px 12px", borderTop: `1px solid ${color.border}`, display: "flex", gap: 16, fontSize: font.size.xxs, color: color.textFaint }}>
            <span>Showing {filtered.length} of {positions.length}</span>
            <span style={{ color: color.bull }}>
              PnL: {fmtP(filtered.reduce((a, p) => a + p.pnl, 0))}
            </span>
            <span>
              Avg Lev: {(filtered.reduce((a, p) => a + p.leverage, 0) / filtered.length).toFixed(1)}\u00D7
            </span>
          </div>
        )}
      </Card>

      <ConfirmDialog
        open={!!confirmTarget}
        title="Close Position"
        message={confirmTarget ? `Close ${confirmTarget.side} ${confirmTarget.size} BTC on ${confirmTarget.exchange}? PnL: $${fmtP(confirmTarget.pnl)}` : ""}
        confirmLabel="Close Position"
        danger={true}
        onConfirm={handleClose}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}

const filterStyle = {
  background: "#0a0a12",
  border: "1px solid #1a1a2e",
  borderRadius: 4,
  padding: "3px 6px",
  color: "#b8c0cc",
  fontSize: 9,
  fontFamily: "'IBM Plex Mono',monospace",
};

const exportBtnStyle = {
  ...filterStyle,
  width: "auto",
  cursor: "pointer",
  color: "#06b6d4",
  border: "1px solid #06b6d430",
};

const closeBtnStyle = {
  background: "transparent",
  border: `1px solid #ff497630`,
  borderRadius: 3,
  color: "#ff4976",
  fontSize: 9,
  cursor: "pointer",
  padding: "2px 6px",
  fontFamily: "'IBM Plex Mono',monospace",
};

export default memo(PositionsTab);
