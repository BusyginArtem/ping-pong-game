import { useRef, useEffect } from 'react';

import { COLORS, CANVAS_WIDTH, CANVAS_HEIGHT } from '@/shared/constants';
import { drawCenterLine, drawScore, drawBallTrail, drawBall, drawPaddle } from '../core';
import { cn } from '@/shared/utils/styling';
import { GameState } from '../types';
import { useGameLogic } from '../hooks/useGameLogic';
import { useGameLoop } from '../hooks/useGameLoop';
import {
  useGameBall,
  useGamePlayerLeftPaddle,
  useGamePlayerRightPaddle,
  useGameScore,
  useGameState,
} from '../store/useGameStore';

function Field() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const gameState = useGameState();

  const score = useGameScore();
  const playerLeftPaddle = useGamePlayerLeftPaddle();
  const playerRightPaddle = useGamePlayerRightPaddle();
  const ball = useGameBall();
  const { updateGame } = useGameLogic();

  useGameLoop({
    gameState,
    onUpdate: updateGame,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = COLORS.background;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    drawCenterLine(ctx);
    drawScore(ctx, score.playerLeft, score.playerRight);
    drawBallTrail(ctx, ball);
    drawBall(ctx, ball);
    drawPaddle(ctx, playerLeftPaddle);
    drawPaddle(ctx, playerRightPaddle);
  }, [ball, playerLeftPaddle, playerRightPaddle, score]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className={cn(
        'relative z-10 border-2 border-gray-600/50 rounded-lg bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-inner transition-all duration-300',
        { 'shadow-blue-500/20 shadow-lg': gameState === GameState.PLAYING }
      )}
      style={{
        width: '100%',
        maxWidth: `${CANVAS_WIDTH}px`,
        height: 'auto',
        imageRendering: 'pixelated',
        filter: gameState === GameState.PAUSED ? 'brightness(0.7) blur(1px)' : 'brightness(1)',
      }}
    />
  );
}

export default Field;
