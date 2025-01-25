import { Box, Stack, Typography } from "@mui/material";
import { useScore } from "../../../providers/ScoreProvier";
import { GameData, useHighScore } from "../../../providers/HighScoreProvider";
import { useEffect } from "react";
import GameOverModal from "../../modals/GameOverModal";
import SnakeGameLogic from "./SnakeGameLogic";
import GamePausedModal from "../../modals/GamePausedModal";
import { useIsGameOver } from "../../../providers/IsGameOver";

const SnakeGame = () => {
  const { score } = useScore();
  const { highScore, setHighScore } = useHighScore();
  const { isGameOver, setIsGameOver } = useIsGameOver();

  useEffect(() => {
    const gameData: GameData = {
      highScore: highScore,
    };
    localStorage.setItem("gameData", JSON.stringify(gameData));
  }, [highScore, setHighScore]);

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
            width: "90.5%",
            maxWidth: "100%",
            height: "87%",
            maxHeight: "100%",
            aspectRatio: "1",
            border: "3px solid #8F5E0F",
            borderRadius: "1%",
            marginTop: "-8px",
            justifyContent: "center",
            backgroundColor: "white",
            display: "flex",
            alignItems: "center",
          }}
        >
          <SnakeGameLogic />
          <GameOverModal
            onRestart={() => setIsGameOver(false)}
            gameOver={isGameOver}
          />
          <GamePausedModal gameOver={isGameOver} />
        </Box>
      </Box>
    </Stack>
  );
};

export default SnakeGame;
