import { COLORS, CANVAS_WIDTH, CANVAS_HEIGHT } from '@/shared/constants';
import type { Ball, Paddle } from '../types';

export const drawCenterLine = (ctx: CanvasRenderingContext2D) => {
  ctx.strokeStyle = COLORS.ball;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(CANVAS_WIDTH / 2, 0);
  ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
  ctx.stroke();
  ctx.setLineDash([]);
};

export const drawBall = (ctx: CanvasRenderingContext2D, ball: Ball) => {
  ctx.fillStyle = COLORS.ball;
  ctx.beginPath();
  ctx.arc(ball.position.x, ball.position.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
};

// export const drawBallTrail = (ctx: CanvasRenderingContext2D, ball: Ball) => {
//   ball.trails.forEach(({ position }, index) => {
//     const opacity = 1 - index / ball.trails.length;
//     const radius = ball.radius * (1 - (index / ball.trails.length) * 0.5);

//     ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
//     ctx.globalAlpha = opacity * 0.6;
//     ctx.beginPath();
//     ctx.arc(position.x, position.y, radius, 0, Math.PI * 2);
//     ctx.fill();
//   });
//   ctx.globalAlpha = 1;
// };

// NOTE FOURTH VARIANT WITH GAPS
export const drawBallTrail = (ctx: CanvasRenderingContext2D, ball: Ball) => {
  // Save the current context state
  ctx.save();

  // Draw each trail segment at its actual recorded position with gaps
  ball.trails.forEach(({ position }, index) => {
    if (index === 0) return; // Skip the first trail (current ball position)

    const opacity = 1 - index / ball.trails.length;
    const baseRadius = ball.radius;

    // Calculate scale factor based on trail index (older trails are smaller)
    const scaleFactor = 1 - (index / ball.trails.length) * 0.3; // Scale from 1.0 to 0.3

    // Use the actual recorded position from the trail - no direction-based shifting
    // This preserves the trail when the ball changes direction
    const trailX = position.x;
    const trailY = position.y;

    // Create fading effect for trail balls
    const segmentOpacity = Math.max(0.1, opacity * 0.6);

    // Render trail ball with scaling
    ctx.globalAlpha = segmentOpacity;
    ctx.fillStyle = `rgba(255, 255, 255, ${segmentOpacity})`;

    ctx.beginPath();
    ctx.save();
    ctx.translate(trailX, trailY);
    ctx.scale(scaleFactor, scaleFactor);
    ctx.arc(0, 0, baseRadius, 0, Math.PI * 2);
    ctx.restore();
    ctx.fill();

    // Add subtle outline for better definition
    if (scaleFactor > 0.4) {
      ctx.globalAlpha = segmentOpacity * 0.8;
      ctx.strokeStyle = `rgba(255, 255, 255, ${segmentOpacity * 0.5})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.save();
      ctx.translate(trailX, trailY);
      ctx.scale(scaleFactor, scaleFactor);
      ctx.arc(0, 0, baseRadius, 0, Math.PI * 2);
      ctx.restore();
      ctx.stroke();
    }
  });

  // Restore the original context state
  ctx.restore();
};

// NOTE THIRD VARIANT
// export const drawBallTrail = (ctx: CanvasRenderingContext2D, ball: Ball) => {
//   // Save the current context state
//   ctx.save();

//   // Draw each trail segment at its actual recorded position with gaps
//   ball.trails.forEach(({ position }, index) => {
//     if (index === 0) return; // Skip the first trail (current ball position)

//     const opacity = 1 - (index / ball.trails.length);
//     const baseRadius = ball.radius;

//     // Calculate scale factor based on trail index (older trails are smaller)
//     const scaleFactor = 1 - (index / ball.trails.length) * 0.7; // Scale from 1.0 to 0.3

//     // Use the actual recorded position from the trail - no direction-based shifting
//     // This preserves the trail when the ball changes direction
//     const trailX = position.x;
//     const trailY = position.y;

//     // Create fading effect for trail balls
//     const segmentOpacity = Math.max(0.1, opacity * 0.6);

//     // Only render if the trail ball is at a reasonable distance from the previous one
//     // This creates the gap effect naturally based on ball movement speed
//     let shouldRender = true;
//     if (index > 1) {
//       const prevPosition = ball.trails[index - 1].position;
//       const distance = Math.sqrt(
//         Math.pow(trailX - prevPosition.x, 2) + Math.pow(trailY - prevPosition.y, 2)
//       );
//       // Only render if there's sufficient distance (creates natural gaps)
//       shouldRender = distance >= ball.radius * 0.8;
//     }

//     if (shouldRender) {
//       // Render trail ball with scaling
//       ctx.globalAlpha = segmentOpacity;
//       ctx.fillStyle = `rgba(255, 255, 255, ${segmentOpacity})`;

//       ctx.beginPath();
//       ctx.save();
//       ctx.translate(trailX, trailY);
//       ctx.scale(scaleFactor, scaleFactor);
//       ctx.arc(0, 0, baseRadius, 0, Math.PI * 2);
//       ctx.restore();
//       ctx.fill();

//       // Add subtle outline for better definition
//       if (scaleFactor > 0.4) {
//         ctx.globalAlpha = segmentOpacity * 0.8;
//         ctx.strokeStyle = `rgba(255, 255, 255, ${segmentOpacity * 0.5})`;
//         ctx.lineWidth = 1;
//         ctx.beginPath();
//         ctx.save();
//         ctx.translate(trailX, trailY);
//         ctx.scale(scaleFactor, scaleFactor);
//         ctx.arc(0, 0, baseRadius, 0, Math.PI * 2);
//         ctx.restore();
//         ctx.stroke();
//       }
//     }
//   });

//   // Restore the original context state
//   ctx.restore();
// };

// NOTE SECOND VARIANT WITH GAPS AND SCALING
// export const drawBallTrail = (ctx: CanvasRenderingContext2D, ball: Ball) => {
//   // Save the current context state
//   ctx.save();

//   // Calculate ball movement angle for directional trail effects
//   const ballAngle = Math.atan2(ball.velocity.y, ball.velocity.x);

//   // Draw each trail segment separately with gaps between them
//   ball.trails.forEach(({ position }, index) => {
//     const opacity = 1 - index / ball.trails.length;
//     const baseRadius = ball.radius;

//     // Calculate scale factor based on trail index (older trails are smaller)
//     const scaleFactor = 1 - (index / ball.trails.length) * 0.7; // Scale from 1.0 to 0.3

//     // Calculate gap spacing - create discrete gaps between trail balls
//     const gapSize = baseRadius * 0.8; // Gap between trail balls
//     const trailSpacing = baseRadius * 1.5 + gapSize; // Total spacing including ball size + gap

//     // Calculate position with gaps along movement direction
//     const distanceBack = (index + 1) * trailSpacing; // +1 to start after the main ball
//     const gapX = -Math.cos(ballAngle) * distanceBack;
//     const gapY = -Math.sin(ballAngle) * distanceBack;
//     const adjustedX = position.x + gapX;
//     const adjustedY = position.y + gapY;

//     // Create fading effect for trail balls
//     const segmentOpacity = Math.max(0.1, opacity * 0.6);

//     // Render trail ball with scaling and gaps
//     ctx.globalAlpha = segmentOpacity;
//     ctx.fillStyle = `rgba(255, 255, 255, ${segmentOpacity})`;

//     ctx.beginPath();
//     ctx.save();
//     ctx.translate(adjustedX, adjustedY);
//     ctx.scale(scaleFactor, scaleFactor);
//     ctx.arc(0, 0, baseRadius, 0, Math.PI * 2);
//     ctx.restore();
//     ctx.fill();

//     // // Add subtle outline for better definition
//     if (scaleFactor > 0.4) {
//       ctx.globalAlpha = segmentOpacity * 0.8;
//       ctx.strokeStyle = `rgba(255, 255, 255, ${segmentOpacity * 0.5})`;
//       ctx.lineWidth = 1;
//       ctx.beginPath();
//       ctx.save();
//       ctx.translate(adjustedX, adjustedY);
//       ctx.scale(scaleFactor, scaleFactor);
//       ctx.arc(0, 0, baseRadius, 0, Math.PI * 2);
//       ctx.restore();
//       ctx.stroke();
//     }
//   });

//   // Restore the original context state
//   ctx.restore();
// };

export const drawPaddle = (ctx: CanvasRenderingContext2D, paddle: Paddle) => {
  ctx.fillStyle = COLORS.ball;
  ctx.fillRect(paddle.position.x, paddle.position.y, paddle.width, paddle.height);
};

export const drawScore = (ctx: CanvasRenderingContext2D, leftScore: number, rightScore: number) => {
  ctx.fillStyle = COLORS.text;
  ctx.font = '48px Arial';
  ctx.textAlign = 'center';

  ctx.fillText(leftScore.toString(), CANVAS_WIDTH / 4, 60);
  ctx.fillText(rightScore.toString(), (CANVAS_WIDTH * 3) / 4, 60);
};
