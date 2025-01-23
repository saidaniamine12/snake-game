import { Box, Button, Stack, Typography } from "@mui/material";
import { useScore } from "../../../providers/ScoreProvier";
import { GameData, useHighScore } from "../../../providers/HighScoreProvider";
import { useEffect, useState } from "react";
import GameOverModal from "../../GameOverModal";

const SnakeGame = () => {
  const { score } = useScore();
  const { highScore, setHighScore } = useHighScore();
  const [gameOver, setGameOver] = useState(false);

  // handling game over
  const handleGameOver = () => {
    setGameOver(true);
  };
  // handling restart
  const handleRestartGame = () => {
    if (score > highScore) {
      setHighScore(score);
    }
    setGameOver(false);
  };

  useEffect(() => {
    const gameData: GameData = {
      highScore: highScore,
      score: 0,
    };
    localStorage.setItem("gameData", JSON.stringify(gameData));
  }, [setHighScore]);

  return (
    // In SnakeGame component
    <Stack
      spacing={2}
      direction="column"
      alignItems="center"
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
      }}
    >
      <Stack
        direction="row"
        maxWidth="90%"
        width="90%"
        sx={{ justifyContent: "space-between" }}
      >
        <Box>
          <Typography variant="h6">Score: {score}</Typography>
        </Box>
        <Box>
          <Typography variant="h6">High Score: {highScore} </Typography>
        </Box>
      </Stack>

      <Box
        sx={{
          flex: 1,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Box
          sx={{
            width: "90%",
            maxWidth: "100%",
            height: "90%",
            maxHeight: "100%",
            aspectRatio: "1",
            border: "3px solid #8F5E0F",
            borderRadius: "1%",
            marginTop: "-8px",
            justifyContent: "center",
            backgroundColor: "#EDDB78",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Button variant="outlined" onClick={handleGameOver}>
            Game Over
          </Button>

          <GameOverModal
            score={score}
            onRestart={handleRestartGame}
            gameOver={gameOver}
          />
        </Box>
      </Box>
    </Stack>
  );
};

export default SnakeGame;
