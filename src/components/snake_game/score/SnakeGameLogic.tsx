import { useCallback, useEffect, useRef, useState } from "react";
import { useScore } from "../../../providers/ScoreProvier";
import { useIsGamePaused } from "../../../providers/IsGamePausedProvider";
import { useHighScore } from "../../../providers/HighScoreProvider";
import { useIsGameOver } from "../../../providers/IsGameOver";

interface Segment {
  x: number;
  y: number;
}
// Game constants
const GRID_SIZE = 20; // Grid size in pixels meaning the food width and length
const UPDATE_INTERVAL = 120; // Update interval in milliseconds

const SnakeGameLogic = () => {
  const ratImagePath = "mouse.png";
  // In draw function:
  const ratImage = new Image();
  ratImage.src = ratImagePath;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const { highScore, setHighScore } = useHighScore();
  const { score, setScore } = useScore();
  // direction state vars to track the direction and prevent the 180 degree turn
  const [direction, setDirection] = useState({ dx: 0, dy: 0 });
  const currentDirection = useRef(direction);
  const queuedDirection = useRef(direction);
  // adding the pause fonctionality
  const { isGamePaused, setIsGamePaused } = useIsGamePaused();
  const isGamePausedRef = useRef(isGamePaused);
  // adding game over logic
  const { isGameOver, setIsGameOver } = useIsGameOver();
  const isGameOverRef = useRef(isGameOver);

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

    // Calculate new head position first
    const newHead = {
      x: snake[0].x + queuedDirection.current.dx,
      y: snake[0].y + queuedDirection.current.dy,
    };

    // Check collisions before state update
    const hasSelfCollision = snake.some(
      (segment, index) =>
        index !== 0 && segment.x === newHead.x && segment.y === newHead.y,
    );
    // const hasWallCollision =
    //   newHead.x < 0 || newHead.x >= 20 ||
    //   newHead.y < 0 || newHead.y >= 20;

    if (hasSelfCollision) {
      isGameOverRef.current = true;
      setIsGameOver(true);
      return; // Exit early if game over
    }
    setSnake((prevSnake) => {
      const newSnake: Segment[] = [...prevSnake];

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
      if (!isGamePausedRef.current && !isGameOverRef.current) {
        if (!lastUpdateTime) lastUpdateTime = timestamp;
        // Adjust time for pause duration
        const deltaTime = timestamp - lastUpdateTime;

        if (deltaTime >= UPDATE_INTERVAL) {
          updateGame();
          lastUpdateTime = timestamp;
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

  // game over handling
  useEffect(() => {
    // Reset game state when gameOver changes from true to false
    if (isGameOver) {
      if (score > highScore) {
        setHighScore(score);
      }
    }
    if (!isGameOver && score !== 0) {
      // Reset snake position
      setSnake([{ x: 10, y: 10 }]);
      // Reset directions
      setDirection({ dx: 0, dy: 0 });
      currentDirection.current = { dx: 0, dy: 0 };
      queuedDirection.current = { dx: 0, dy: 0 };
      isGameOverRef.current = isGameOver;
      //  Generate new rat position
      setRat(newRat());
      // Reset score
      setScore(0);
    }
  }, [isGameOver]);

  // Input handling
  useEffect(() => {
    // space handling
    // arrow keys handling
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        if (!isGamePausedRef.current) {
          // set it to true
          isGamePausedRef.current = true;
          setIsGamePaused(true);
        }
      }
      if (isGamePausedRef.current) {
        if (
          e.key === "ArrowLeft" ||
          e.key === "ArrowRight" ||
          e.key === "ArrowUp" ||
          e.key === "ArrowDown"
        ) {
          isGamePausedRef.current = false;
          setIsGamePaused(false);
        }
      }
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
    };
  }, [direction]);

  return <canvas ref={canvasRef} />;
};

export default SnakeGameLogic;
