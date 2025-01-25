import snakeLogo from "/snake.svg";
import "./App.css";

import { Stack, Typography, Container } from "@mui/material";
import SnakeGame from "./components/snake_game/score/SnakeGame";
import HighScoreProvider from "./providers/HighScoreProvider";
import ScoreProvider from "./providers/ScoreProvier";
import IsGamePausedProvider from "./providers/IsGamePausedProvider";
import IsGameOverProvider from "./providers/IsGameOver";
// App.tsx
function App() {
  return (
    <Container 
      sx={{ 
        width: "636px",
        height: "100vh",
        maxHeight: "100vh",
        padding: "10px 0",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Stack
        direction="column"
        alignItems="center"
        sx={{
          border: "3px solid #f8a24d",
          borderRadius: "1%",
          flexGrow: 1,
          minHeight: "565px",
          width: "100%",
          backgroundColor: "#f8a24d",
          overflow: "hidden",
        }}
      >
        {/* Header Section */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            marginBottom: "8px",
            padding: "0 20px",
            minHeight: "80px",
          }}
        >
          <img
            src={snakeLogo}
            className="logo"
            alt="Snake Game Logo"
            style={{ height: "60px" }}
          />
          <Typography variant="h4">Snake Game</Typography>
        </Stack>

        {/* Game Section */}
        <Stack sx={{ 
          flexGrow: 1,
          width: "100%",
          padding: "0 20px",
          overflow: "hidden"
        }}>
          <IsGameOverProvider>
            <HighScoreProvider>
              <ScoreProvider>
                <IsGamePausedProvider>
                  <SnakeGame />
                </IsGamePausedProvider>
              </ScoreProvider>
            </HighScoreProvider>
          </IsGameOverProvider>
        </Stack>
      </Stack>
    </Container>
  );
}

export default App;
