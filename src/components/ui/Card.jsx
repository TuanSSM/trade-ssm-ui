import * as mixins from "../../styles/mixins";

export function Card({ children, style = {} }) {
  return <div style={{ ...mixins.card, ...style }}>{children}</div>;
}

export function CardHead({ children }) {
  return <div style={mixins.cardHead}>{children}</div>;
}

export function CardBody({ children, style = {} }) {
  return <div style={{ ...mixins.cardBody, ...style }}>{children}</div>;
}

export function CardTitle({ children }) {
  return <span style={mixins.cardTitle}>{children}</span>;
}
