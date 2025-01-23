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

interface GameOverModalProps {
  score: number;
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
  score,
  onRestart,
  gameOver,
}) => {
  return (
    <Dialog
      TransitionComponent={Transition}
      open={gameOver}
      disableEscapeKeyDown
      sx={{ textAlign: "center" }}
      PaperProps={{
        sx: {
          minWidth: "400px", // Wider dialog
          minHeight: "250px", // Taller dialog
          padding: "24px", // More internal space
        },
      }}
    >
      <DialogTitle>GAME OVER!</DialogTitle>
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
