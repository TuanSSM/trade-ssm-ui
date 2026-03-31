import { useState } from "react";
import { color, font } from "../../styles/tokens";

export default function Tooltip({ content, children }) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    setPos({ x: e.clientX + 10, y: e.clientY - 30 });
  };

  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onMouseMove={handleMouse}
    >
      {children}
      {show && content && (
        <div
          style={{
            position: "fixed",
            left: pos.x,
            top: pos.y,
            padding: "4px 8px",
            borderRadius: 4,
            background: "#1a1a2e",
            border: `1px solid ${color.border}`,
            color: color.textBright,
            fontSize: font.size.xxs,
            fontFamily: font.mono,
            whiteSpace: "nowrap",
            zIndex: 9999,
            pointerEvents: "none",
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
