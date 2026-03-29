import { createContext, useState } from "react";
import { useMarketData } from "../hooks";

export const MarketContext = createContext(null);

export default function MarketProvider({ children }) {
  const [tf, setTF] = useState("4H");
  const [envEMA, setEnvEMA] = useState(21);
  const [envMult, setEnvMult] = useState(2.0);

  const marketData = useMarketData(tf, envEMA, envMult);

  return (
    <MarketContext.Provider
      value={{
        ...marketData,
        tf,
        setTF,
        envEMA,
        setEnvEMA,
        envMult,
        setEnvMult,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
}
