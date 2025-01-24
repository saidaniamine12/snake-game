import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { createContext } from "react";

// define high score context :defining yhe struture of the context
interface IsGameOverProps {
  isGameOver: boolean | false;
  setIsGameOver: Dispatch<SetStateAction<boolean>>;
}

// create the context
const isGameOverContext = createContext<IsGameOverProps>({
  isGameOver: false,
  setIsGameOver: () => {},
});

// create the provider component, it  Provides the context to its children.
const IsGameOverProvider = ({ children }: { children: ReactNode }) => {
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  return (
    <isGameOverContext.Provider value={{ isGameOver, setIsGameOver }}>
      {children}
    </isGameOverContext.Provider>
  );
};

// create a custom hook to use the context and simplify the access to the context
// eslint-disable-next-line react-refresh/only-export-components
export const useIsGameOver = () => {
  const context = useContext(isGameOverContext);
  if (context === undefined) {
    throw new Error("useHighScore must be used within a IsGameOverProvider");
  }
  return context;
};

// export the provider
export default IsGameOverProvider;
