import { useEffect, useRef, useCallback } from 'react';
import { GameState } from '../types';

interface UseGameLoopProps {
  gameState: GameState;
  onUpdate: () => void;
}

const fps = 60;

export const useGameLoop = ({ gameState, onUpdate }: UseGameLoopProps) => {
  const animationId = useRef<number | undefined>(undefined);
  const previousTime = useRef<number | undefined>(undefined);
  const fpsInterval = 1000 / fps;

  const animate = useCallback(
    (time: number) => {
      if (previousTime.current !== undefined) {
        const deltaTime = time - previousTime.current;

        if (deltaTime >= fpsInterval) {
          if (gameState === GameState.PLAYING) {
            onUpdate();
          }
          previousTime.current = time - (deltaTime % fpsInterval);
        }
      } else {
        previousTime.current = time;
      }

      animationId.current = requestAnimationFrame(animate);
    },
    [gameState, onUpdate, fpsInterval]
  );

  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      animationId.current = requestAnimationFrame(animate);
    } else if (animationId.current) {
      cancelAnimationFrame(animationId.current);
    }

    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, [gameState, animate]);

  const startLoop = useCallback(() => {
    if (!animationId.current && gameState === GameState.PLAYING) {
      animationId.current = requestAnimationFrame(animate);
    }
  }, [gameState, animate]);

  const stopLoop = useCallback(() => {
    if (animationId.current) {
      cancelAnimationFrame(animationId.current);
      animationId.current = undefined;
    }
  }, []);

  return { startLoop, stopLoop };
};
