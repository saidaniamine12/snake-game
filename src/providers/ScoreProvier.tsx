import { createContext, ReactNode, useContext } from "react";

// define the interface
interface Score {
  score: number | 0;
  setScore: (score: number) => void;
}

// create the context
const ScoreContext = createContext<Score>({
  score: 0,
  setScore: () => {},
});

// create the provider
const ScoreProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ScoreContext.Provider value={{ score: 0, setScore: () => {} }}>
      {children}
    </ScoreContext.Provider>
  );
};
// make the access to the context easier
export const useScore = () => {
  const context = useContext(ScoreContext);
  if (context === undefined) {
    throw new Error("useScore must be used within a ScoreProvider");
  }
  return context;
};

// export the provider
export default ScoreProvider;
