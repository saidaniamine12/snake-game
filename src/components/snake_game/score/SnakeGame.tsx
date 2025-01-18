import { Box, Stack, Typography } from "@mui/material";
import { useScore } from "../../../providers/ScoreProvier";
import { useHighScore } from "../../../providers/HighScoreProvider";

const SnakeGame = () => {
  const {score} = useScore();
  const {highScore} = useHighScore();

  return (
    <Stack
      spacing={2}
      direction="column"
      alignItems="center"
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
      }}
    >
     
      <Stack 
        direction="row" 
        maxWidth="90%" 
        width="90%"
        sx={{ justifyContent: 'space-between', marginBottom: '16px' }}
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
          border: '1px solid red',
          width: '90%',
          aspectRatio: '1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography>bbb</Typography>
      </Box>
    </Stack>
  );
};

export default SnakeGame;
