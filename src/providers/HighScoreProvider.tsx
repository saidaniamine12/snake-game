import { ReactNode, useContext, useState } from "react";
import { createContext } from "react";

// define high score context :defining yhe struture of the context
interface HighScore {
    highScore: number | 0; // stores the details of the current high score 
    setHighScore: (score: number) => void; // function to set the current high score
}

// create the context
const HighScoreContext = createContext<HighScore>({
    highScore: 0, // default value of the current high score
    setHighScore: () => {}, // default value of the function to set the current high score
});

// create the provider component, it  Provides the context to its children.
const HighScoreProvider = ({ children }: { children: ReactNode }) => {
    const [highScore, setHighScore] = useState<number | 0>(0);

    return (
        <HighScoreContext.Provider value={{ highScore, setHighScore }}>
            {children}
        </HighScoreContext.Provider>
    );
}

// create a custom hook to use the context and simplify the access to the context
// eslint-disable-next-line react-refresh/only-export-components
export const useHighScore = () => {
   const context = useContext(HighScoreContext);
    if (context === undefined) {
        throw new Error("useHighScore must be used within a HighScoreProvider");
    }
    return context;
}


// export the provider
export default HighScoreProvider;