import { createContext } from "react";
import { useTrainingMetrics } from "../hooks/useTrainingMetrics";

// eslint-disable-next-line react-refresh/only-export-components
export const TrainingContext = createContext(null);

export default function TrainingProvider({ children }) {
  const training = useTrainingMetrics();

  return (
    <TrainingContext.Provider value={training}>
      {children}
    </TrainingContext.Provider>
  );
}
