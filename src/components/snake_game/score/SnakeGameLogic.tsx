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
const SNAKE_GAME_UPDATE_INTERVAL = 100; // Update interval in milliseconds

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
  const [updateInterval, setUpdateInterval] = useState(
    SNAKE_GAME_UPDATE_INTERVAL,
  );
  const lasGrid = useRef({ x: 25, y: 25 });

  const newRat = (): Segment => {
    let rat: Segment;
    do {
      rat = {
        x: Math.floor(Math.random() * lasGrid.current.x),
        y: Math.floor(Math.random() * lasGrid.current.y),
      };
    } while (
      snake.some((segment) => segment.x === rat.x && segment.y === rat.y)
    );
    return rat;
  };
  const [rat, setRat] = useState<Segment>(() => newRat());

  const newRandomRatPosition = () => {
    setRat(newRat());
  };

  useEffect(() => {
    setScore(snake.length - 1);
    // Increase speed when snake grows in length
    setUpdateInterval(SNAKE_GAME_UPDATE_INTERVAL - (snake.length - 1) * 2);
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

    // the walls are not solid and even so I'm going to use the width and height
    // of the canvas to wrap around the snake
    //

    if (newHead.x >= canvasRef.current!.width / GRID_SIZE) {
      newHead.x = 0;
    }
    if (newHead.x < 0) {
      newHead.x = lasGrid.current.x;
    }
    if (newHead.y >= canvasRef.current!.height / GRID_SIZE) {
      newHead.y = 0;
    }
    if (newHead.y < 0) {
      newHead.y = lasGrid.current.y;
    }
    // Wrap around logic for walls

    // Check collisions before state update
    const hasSelfCollision = snake.some(
      (segment, index) =>
        index !== 0 && segment.x === newHead.x && segment.y === newHead.y,
    );
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

        if (deltaTime >= updateInterval) {
          updateGame();
          lastUpdateTime = timestamp;
        }
      }

      animationFrameId = requestAnimationFrame(gameLoop); // call the game loop recursively on the next frame
    };

    animationFrameId = requestAnimationFrame(gameLoop); // start the game loop
    return () => cancelAnimationFrame(animationFrameId); // stop the game loop when the component is unmounted
  }, [updateGame]);

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

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // if value is same do not update
    if (
      lasGrid.current.x !== Math.floor(canvas.width / GRID_SIZE) ||
      lasGrid.current.y !== Math.floor(canvas.height / GRID_SIZE)
    ) {
      lasGrid.current.x = Math.floor(canvas.width / GRID_SIZE);
      lasGrid.current.y = Math.floor(canvas.height / GRID_SIZE);
    }

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
      ctx.fillStyle = "#EDDB78";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const drawSnake = () => {
        snake.forEach((segment, index) => {
          // Create gradient for snake segments for each segment
          const gradient = ctx.createLinearGradient(
            segment.x * GRID_SIZE,
            segment.y * GRID_SIZE,
            (segment.x + 1) * GRID_SIZE,
            (segment.y + 1) * GRID_SIZE,
          );

          // Color gradient from head (bluer) to tail (greener)
          // using hsl because we are changing the color from head to tale based on index
          gradient.addColorStop(0, `hsl(${200 - index * 2}, 70%, 50%)`);
          // changing the vividness of the color and the lightness of each segment
          gradient.addColorStop(1, `hsl(${200 - index * 2}, 90%, 30%)`);

          // Rounded snake segments
          ctx.beginPath();
          ctx.roundRect(
            segment.x * GRID_SIZE + 1,
            segment.y * GRID_SIZE + 1,
            GRID_SIZE - 1,
            GRID_SIZE - 1,
            5, // Rounded corners radius
          );
          ctx.fillStyle = gradient;
          ctx.fill();

        });

        ctx.save();
      };
      drawSnake();

      // Draw rat
      if (ratImage.complete) {
        ctx.drawImage(
          ratImage,
          rat.x * GRID_SIZE,
          rat.y * GRID_SIZE,
          GRID_SIZE,
          GRID_SIZE,
        );
      } else {
        // Create gradient for snake segments for each segment
        const gradient = ctx.createLinearGradient(
          rat.x * GRID_SIZE,
          rat.y * GRID_SIZE,
          (rat.x + 1) * GRID_SIZE,
          (rat.y + 1) * GRID_SIZE,
        );

        // Color gradient from head (bluer) to tail (greener)
        // using hsl because we are changing the color from head to tale based on index
        gradient.addColorStop(0, `hsl(106, 88%, 48%)`);
        // changing the vividness of the color and the lightness of each segment
        gradient.addColorStop(1, `hsl(106, 88%, 36%)`);

        // Rounded snake segments
        ctx.beginPath();
        ctx.roundRect(
          rat.x * GRID_SIZE + 1,
          rat.y * GRID_SIZE + 1,
          GRID_SIZE - 1,
          GRID_SIZE - 1,
          5, // Rounded corners radius
        );
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    };

    draw();
  }, [direction, snake]);

  return <canvas ref={canvasRef} />;
};

export default SnakeGameLogic;
