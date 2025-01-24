import { useCallback, useEffect, useRef, useState } from "react";
import { useScore } from "../../../providers/ScoreProvier";
import { useIsGamePaused } from "../../../providers/IsGamePausedProvider";

interface Segment {
  x: number;
  y: number;
}
interface SnakeGameLogicProps {
  // used to notify the parent and the logic will be handled in the parent
  // better for separation of concerns and reusability, so the child does not need to care how the game over is handled
  // ---->> flexibilty, encapsulation and separation of concerns
  // and it uses callbacks so it might be more efficient if it was already memoized
  // alternativee use setGameOver in the state and handle the game over in the logic Dispatch<SetStateAction<boolean>>
  onGameOver: () => void;
}

// Game constants
const GRID_SIZE = 20; // Grid size in pixels meaning the food width and length
const UPDATE_INTERVAL = 100; // Update interval in milliseconds

const SnakeGameLogic: React.FC<SnakeGameLogicProps> = ({ onGameOver }) => {
  const ratImagePath = "mouse.png";
  // In draw function:
  const ratImage = new Image();
  ratImage.src = ratImagePath;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const { setScore } = useScore();
  // direction state vars to track the direction and prevent the 180 degree turn
  const [direction, setDirection] = useState({ dx: 0, dy: 0 });
  const currentDirection = useRef(direction);
  const queuedDirection = useRef(direction);
  // adding the pause fonctionality
  const {isGamePaused, setIsGamePaused} = useIsGamePaused();
  const isGamePausedRef = useRef(isGamePaused);
  const accumulatedPauseTime = useRef(0);

  const newRat = (): Segment => {
    let rat: Segment;
    do {
      rat = {
        x: Math.floor(Math.random() * 20),
        y: Math.floor(Math.random() * 20),
      };
    } while (
      snake.some((segment) => segment.x === rat.x && segment.y === rat.y)
    );
    return rat;
  };
  const newPosition = newRat();
  const [rat, setRat] = useState<Segment>({
    x: newPosition.x,
    y: newPosition.y,
  });

  const newRandomRatPosition = () => {
    let newRat: Segment;
    do {
      newRat = {
        x: Math.floor(Math.random() * 20),
        y: Math.floor(Math.random() * 20),
      };
    } while (
      snake.some((segment) => segment.x === newRat.x && segment.y === newRat.y)
    );
    setRat(newRat);
  };

  useEffect(() => {
    setScore(snake.length - 1);
  }, [snake]);

  // Update game logic
  // using callback to avoid infinite loop
  // and update the game state without causing re-render
  // based on the old state
  const updateGame = useCallback(() => {
    setDirection(queuedDirection.current);
    currentDirection.current = queuedDirection.current;
    setSnake((prevSnake) => {
      const newSnake: Segment[] = [...prevSnake];
      const newHead = {
        x: prevSnake[0].x + currentDirection.current.dx,
        y: prevSnake[0].y + currentDirection.current.dy,
      };

      // collision case
      prevSnake.some((segment, index) => {
        if (segment.x === newHead.x && segment.y === newHead.y && index != 0) {
          console.log("Game Over");
          // setGameOver(true);
          // return prevSnake;
        }
      });

      // Check if the snake eats the rat
      if (newHead.x === rat.x && newHead.y === rat.y) {
        newRandomRatPosition();
      } else {
        newSnake.pop();
      }

      return [newHead, ...newSnake];
    });
  }, [snake]);

  // Game loop
  // used to update the game state every 100ms
  useEffect(() => {
    let lastUpdateTime = 0; // initialize the time stamp
    let animationFrameId: number;

    const gameLoop = (timestamp: number) => {

      if (!isGamePausedRef.current) {
      
        if (!lastUpdateTime) lastUpdateTime = timestamp; 
        // Adjust time for pause duration
        const adjustedTime = timestamp - accumulatedPauseTime.current;
        const deltaTime = adjustedTime - lastUpdateTime;

        if (deltaTime >= UPDATE_INTERVAL) {
          updateGame();
          lastUpdateTime = adjustedTime;
        }
      }

      animationFrameId = requestAnimationFrame(gameLoop); // call the game loop recursively on the next frame
    };

    animationFrameId = requestAnimationFrame(gameLoop); // start the game loop
    return () => cancelAnimationFrame(animationFrameId); // stop the game loop when the component is unmounted
  }, [updateGame]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    const draw = () => {
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      const computedStyle = getComputedStyle(canvas);
      const width = parseFloat(computedStyle.width);
      const height = parseFloat(computedStyle.height);
      // Set internal pixel grid
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      // Set CSS display size
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      // Scale context for sharp rendering
      ctx.scale(devicePixelRatio, devicePixelRatio);
      ctx.fillStyle = "#EDDB78";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw snake
      ctx.fillStyle = "red";
      snake.forEach((segment) => {
        ctx.fillRect(
          segment.x * GRID_SIZE,
          segment.y * GRID_SIZE,
          GRID_SIZE - 2,
          GRID_SIZE - 2,
        );
      });

      // Draw rat
      ctx.fillStyle = "green";
      if (ratImage.complete) {
        ctx.drawImage(
          ratImage,
          rat.x * GRID_SIZE,
          rat.y * GRID_SIZE,
          GRID_SIZE,
          GRID_SIZE,
        );
      } else {
        ctx.fillStyle = "green";
        ctx.fillRect(
          rat.x * GRID_SIZE,
          rat.y * GRID_SIZE,
          GRID_SIZE - 2,
          GRID_SIZE - 2,
        );
      }
    };

    draw();
  }, [direction, snake]);

  // Input handling
  useEffect(() => {

    // space handling
    // arrow keys handling
    const handleKeyPress = (e: KeyboardEvent) => {
      if(e.code === "Space") {
        if (!isGamePausedRef.current) {
          // set it to true
            isGamePausedRef.current = true;
            setIsGamePaused(true); 
        }
      } 
      if (isGamePausedRef.current ) {
        if ( e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "ArrowDown"){
          isGamePausedRef.current = false;
        setIsGamePaused(false);
        
        }

        
      };
      const newDir = (() => {
        const { dx, dy } = currentDirection.current;
        switch (e.key) {
          case "ArrowLeft":
            return dx !== 1 ? { dx: -1, dy: 0 } : null;
          case "ArrowRight":
            return dx !== -1 ? { dx: 1, dy: 0 } : null;
          case "ArrowUp":
            return dy !== 1 ? { dx: 0, dy: -1 } : null;
          case "ArrowDown":
            return dy !== -1 ? { dx: 0, dy: 1 } : null;
          default:
            return null;
        }
      })();

      if (newDir) {
        queuedDirection.current = newDir;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    }
  }, [direction]);

  return <canvas ref={canvasRef} />;
};

export default SnakeGameLogic;
