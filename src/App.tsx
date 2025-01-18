import snakeLogo from "/snake.svg";
import "./App.css";

import { Stack, Container, Typography } from "@mui/material";
import SnakeGame from "./components/snake_game/score/SnakeGame";
import HighScoreProvider from "./providers/HighScoreProvider";
import ScoreProvider from "./providers/ScoreProvier";

function App() {
  return (
    <>
      <Container maxWidth="lg">
        <Stack
          direction="column"
          alignItems="center"
          sx={{
            border: '1px solid blue',
            height: '90vh',
            width: '560px',
            margin: 'auto',
          }}
        >
    
          <Stack 
            direction="row" 
            alignItems="center" 
            spacing={1}
            sx={{
              marginBottom: '16px',
              textAlign: 'center',
            }}
          >
            <img
              src={snakeLogo}
              className="logo"
              alt="Snake Game Logo"
              style={{ height: '60px' }}
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
