import { useEffect, useRef } from 'react';

import { CANVAS_HEIGHT, CANVAS_WIDTH, COLORS } from '@/shared/constants';
import type { Ball, Paddle } from '../types';
import { useGameStore } from '../store/useGameStore';

const drawCenterLine = (ctx: CanvasRenderingContext2D) => {
  ctx.strokeStyle = COLORS.ball;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(CANVAS_WIDTH / 2, 0);
  ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
  ctx.stroke();
  ctx.setLineDash([]);
};

const drawBall = (ctx: CanvasRenderingContext2D, ball: Ball) => {
  ctx.fillStyle = COLORS.ball;
  ctx.beginPath();
  ctx.arc(ball.position.x, ball.position.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
};

const drawBallTrail = (ctx: CanvasRenderingContext2D, ball: Ball) => {
  ball.trails.forEach(({ position }, index) => {
    const opacity = 1 - index / ball.trails.length;
    const radius = ball.radius * (1 - (index / ball.trails.length) * 0.5);

    ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
    ctx.globalAlpha = opacity * 0.6;
    ctx.beginPath();
    ctx.arc(position.x, position.y, radius, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
};

const drawPaddle = (ctx: CanvasRenderingContext2D, paddle: Paddle) => {
  ctx.fillStyle = COLORS.ball;
  ctx.fillRect(paddle.position.x, paddle.position.y, paddle.width, paddle.height);
};

export default function Board() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { ball, playerLeftPaddle, playerRightPaddle } = useGameStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = COLORS.background;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    drawCenterLine(ctx);

    drawBallTrail(ctx, ball);

    drawBall(ctx, ball);

    drawPaddle(ctx, playerLeftPaddle);
    drawPaddle(ctx, playerRightPaddle);
  }, [ball, playerLeftPaddle, playerRightPaddle]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className={`border-2 border-gray-300 rounded-lg bg-gray-800`}
      style={{
        width: '100%',
        maxWidth: `${CANVAS_WIDTH}px`,
        height: 'auto',
      }}
    />
  );
}
