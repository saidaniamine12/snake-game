import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { createContext } from "react";

// define high score context :defining yhe struture of the context
interface IsGamePausedProps {
  isGamePaused: boolean | false;
  setIsGamePaused: Dispatch<SetStateAction<boolean>>;
}

// create the context
const isGamePausedContext = createContext<IsGamePausedProps>({
  isGamePaused: false,
  setIsGamePaused: () => {},
});

// create the provider component, it  Provides the context to its children.
const IsGamePausedProvider = ({ children }: { children: ReactNode }) => {
  const [isGamePaused, setIsGamePaused] = useState<boolean>(false);

  return (
    <isGamePausedContext.Provider value={{ isGamePaused, setIsGamePaused }}>
      {children}
    </isGamePausedContext.Provider>
  );
};

// create a custom hook to use the context and simplify the access to the context
// eslint-disable-next-line react-refresh/only-export-components
export const useIsGamePaused = () => {
  const context = useContext(isGamePausedContext);
  if (context === undefined) {
    throw new Error("useHighScore must be used within a HighScoreProvider");
  }
  return context;
};

// export the provider
export default IsGamePausedProvider;
