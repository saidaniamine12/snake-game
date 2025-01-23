import { useCallback, useEffect, useRef, useState } from "react";
import { useScore } from "../../../providers/ScoreProvier";

interface SnakeGameLogicProps {
  setGameOver: () => void;
}

const SnakeGameLogic: React.FC<SnakeGameLogicProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake] = useState([{ x: 10, y: 10 }]);
  const [rat, setRat] = useState({ x: 10, y: 10 });
  const { score, setScore } = useScore();
  const [direction, setDirection] = useState({ dx: 0, dy: 0 });
  const gameLoopRef = useRef<number | null>(null);

  const newRandomRatPosition = () => {
    const newRat = {
      x: Math.floor(Math.random() * 20),
      y: Math.floor(Math.random() * 20),
    };
    setRat(newRat);
  };

  useEffect(() => {
    setScore(score + 1);
    console.log("Score", score);
    }, [direction]);
  // Game constants
  const GRID_SIZE = 20; // Grid size in pixels meaning the food 

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const draw = () => {
      if (!ctx) return;
      // Clear canvas
      newRandomRatPosition();
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
      ctx.fillRect(
        rat.x * GRID_SIZE,
        rat.y * GRID_SIZE,
        GRID_SIZE - 2,
        GRID_SIZE - 2,
      );
    };

    draw();
    console.log("direction", direction);
  }, [direction]);

  const updateGame = useCallback(() => {
    // on rat eat

    // on collision with wall or self
    // if(false) {
    //     setGameOver();
    // }
    // on snake eat rat , new rat position

    //newRandomRatPosition();
    console.log("Update Game");
  }, [direction]);

  // Game loop
  useEffect(() => {
    console.log("Game Loop");
    gameLoopRef.current = setInterval(updateGame, 100);

    return () => {
      if (gameLoopRef.current !== null) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [updateGame]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const { key } = e;
      const { dx, dy } = direction;

      switch (key) {
        case "ArrowLeft":
          if (dx !== 1) setDirection({ dx: -1, dy: 0 });
          break;
        case "ArrowRight":
          if (dx !== -1) setDirection({ dx: 1, dy: 0 });
          break;
        case "ArrowUp":
          if (dy !== 1) setDirection({ dx: 0, dy: -1 });
          break;
        case "ArrowDown":
          if (dy !== -1) setDirection({ dx: 0, dy: 1 });
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [direction]);

  useEffect(() => {}, [rat, direction]);
  return <canvas ref={canvasRef} />;
};

export default SnakeGameLogic;
