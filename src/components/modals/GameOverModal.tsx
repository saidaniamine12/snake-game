import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React from "react";
import { useScore } from "../../providers/ScoreProvier";
import { useIsGamePaused } from "../../providers/IsGamePausedProvider";

interface GameOverModalProps {
  onRestart: () => void;
  gameOver: boolean;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const GameOverModal: React.FC<GameOverModalProps> = ({
  onRestart,
  gameOver,
}) => {
  const { score } = useScore();
  const { isGamePaused } = useIsGamePaused();

  return (
    <Dialog
      TransitionComponent={Transition}
      open={gameOver && !isGamePaused}
      disableEscapeKeyDown
      sx={{ textAlign: "center" }}
      PaperProps={{
        sx: {
          opacity: 0.5,
          minWidth: "400px", // Wider dialog
          minHeight: "20px", // Taller dialog
          padding: "24px", // More internal space
        },
      }}
    >
      <DialogTitle sx={{ opacity: 1 }}>GAME OVER!</DialogTitle>
      <DialogContent>
        <p>Your Score: {score}</p>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button onClick={onRestart} variant="contained" color="primary">
          Restart
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GameOverModal;
