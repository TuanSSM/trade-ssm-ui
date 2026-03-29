import * as mixins from "../../styles/mixins";

export default function Badge({ color, filled = false, children }) {
  return <span style={mixins.badge(color, filled)}>{children}</span>;
}
