import { useCallback, useEffect, useRef, useState } from "react";
import { useScore } from "../../../providers/ScoreProvier";

interface Segment {
  x: number;
  y: number;
}
interface SnakeGameLogicProps {
  setGameOver: () => void;
}

  // Game constants
  const GRID_SIZE = 20; // Grid size in pixels meaning the food width and length
  const UPDATE_INTERVAL  = 100  // Update interval in milliseconds

const SnakeGameLogic: React.FC<SnakeGameLogicProps> = () => {
  const ratImagePath = "mouse.png";
  // In draw function:
  const ratImage = new Image();
  ratImage.src = ratImagePath;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const {setScore } = useScore();
  const [direction, setDirection] = useState({ dx: 0, dy: 0 });

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



    // Update game logic
  // using callback to avoid infinite loop
  // and update the game state without causing re-render
  // based on the old state 
  const updateGame = useCallback(() => {
    // moving the snake
    setSnake((prevSnake) => {
      const newSnake: Segment[] = [...prevSnake];
      const newHead : Segment= {
        x : newSnake[0].x + direction.dx,
        y : newSnake[0].y + direction.dy
      };
          // Check if the snake eats the rat
    if (newHead.x === rat.x && newHead.y === rat.y) {
      newRandomRatPosition();
      setScore(snake.length)
    } else {
      
        newSnake.pop();
      };
    
      return [newHead, ...newSnake];
    })

   

  }, [direction, snake]);

    // Game loop
  // used to update the game state every 100ms
  useEffect(() => {
    let lastUpdateTime = 0; // initialize the time stamp
    let animationFrameId: number;

    const gameLoop = (timestamp: number) => { // timestamp from the browser
      if (!lastUpdateTime) lastUpdateTime = timestamp; // if it is 0 set it to the current timestamp to be accurate
      const deltaTime = timestamp - lastUpdateTime; // calculate the time difference
      if (deltaTime >= UPDATE_INTERVAL) {
        updateGame();
        lastUpdateTime = timestamp; //reset the lastUpdateTime 
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
  }, [direction, snake, rat]);





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

  return <canvas ref={canvasRef} />;
};

export default SnakeGameLogic;
