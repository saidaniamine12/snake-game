import { Dialog, DialogContent, Slide } from "@mui/material";
import { useIsGamePaused } from "../../providers/IsGamePausedProvider";
import { TransitionProps } from "@mui/material/transitions";
import React from "react";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface GamePausedProps {
  gameOver: boolean;
}

const GamePausedModal: React.FC<GamePausedProps> = ({ gameOver }) => {
  const { isGamePaused } = useIsGamePaused();
  return (
    <Dialog
      open={isGamePaused && !gameOver}
      TransitionComponent={Transition}
      disableEscapeKeyDown
      sx={{ textAlign: "center" }}
      PaperProps={{
        sx: {
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          marginTop: "80vh",
          minWidth: "400px", // Wider dialog
          minHeight: "100", // Taller dialog
        },
      }}
    >
      <DialogContent sx={{ opacity: 1 }}>
        <p>Press any Arrow key to resume</p>
      </DialogContent>
    </Dialog>
  );
};

export default GamePausedModal;
