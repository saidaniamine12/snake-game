import snakeLogo from "/snake.svg";
import "./App.css";

import { Stack, Typography, Container } from "@mui/material";
import SnakeGame from "./components/snake_game/score/SnakeGame";
import HighScoreProvider from "./providers/HighScoreProvider";
import ScoreProvider from "./providers/ScoreProvier";

function App() {
  return (
    <>
      <Container sx={{ width: "636px", height: "710px" }}>
        <Stack
          direction="column"
          alignItems="center"
          sx={{
            border: "3px solid #f8a24d",
            height: "90%",
            minHeight: "565px",
            width: "100%",
            backgroundColor: "#f8a24d",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
              marginBottom: "8px",
              textAlign: "center",
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
          <HighScoreProvider>
            <ScoreProvider>
              <SnakeGame />
            </ScoreProvider>
          </HighScoreProvider>
        </Stack>
      </Container>
    </>
  );
}

export default App;
