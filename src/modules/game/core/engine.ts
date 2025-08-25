import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PADDLE_CONFIG,
  BALL_CONFIG,
  DIFFICULTY_CONFIGS,
} from '@/shared/constants';
import type { Ball, Paddle, Controls, Difficulty, Players } from '../types';

export class GameEngine {
  private paddleSpeed = 6;
  private maxBallSpeed = 8;
  private trailLength = 8;

  /**
   * Updates paddle positions based on current controls
   */
  updatePaddles(
    leftPaddle: Paddle,
    rightPaddle: Paddle,
    controls: Controls
  ): { leftPaddle: Paddle; rightPaddle: Paddle } {
    const newLeftPaddle = { ...leftPaddle };
    const newRightPaddle = { ...rightPaddle };

    // Update left paddle
    if (controls.playerLeftUp && leftPaddle.position.y > 0) {
      newLeftPaddle.position.y = Math.max(0, leftPaddle.position.y - this.paddleSpeed);
    }
    if (controls.playerLeftDown && leftPaddle.position.y < CANVAS_HEIGHT - PADDLE_CONFIG.height) {
      newLeftPaddle.position.y = Math.min(
        CANVAS_HEIGHT - PADDLE_CONFIG.height,
        leftPaddle.position.y + this.paddleSpeed
      );
    }

    // Update right paddle
    if (controls.playerRightUp && rightPaddle.position.y > 0) {
      newRightPaddle.position.y = Math.max(0, rightPaddle.position.y - this.paddleSpeed);
    }
    if (controls.playerRightDown && rightPaddle.position.y < CANVAS_HEIGHT - PADDLE_CONFIG.height) {
      newRightPaddle.position.y = Math.min(
        CANVAS_HEIGHT - PADDLE_CONFIG.height,
        rightPaddle.position.y + this.paddleSpeed
      );
    }

    return { leftPaddle: newLeftPaddle, rightPaddle: newRightPaddle };
  }

  /**
   * Updates ball position and handles collisions
   */
  updateBall(
    ball: Ball,
    leftPaddle: Paddle,
    rightPaddle: Paddle,
    difficulty: Difficulty
  ): { ball: Ball; scoringPlayer: Players | null } {
    const newBall = { ...ball };
    let scoringPlayer: Players | null = null;

    // Update ball position
    newBall.position.x += newBall.velocity.x;
    newBall.position.y += newBall.velocity.y;

    // TODO remove debug logs
    const speed = Math.sqrt(newBall.velocity.x ** 2 + newBall.velocity.y ** 2);
    const angle = Math.atan2(newBall.velocity.y, newBall.velocity.x);
    const direction = this.getBallDirection(newBall.velocity.x, newBall.velocity.y);

    console.log(
      `Ball Direction: ${direction}, Speed: ${speed.toFixed(2)}, Angle: ${((angle * 180) / Math.PI).toFixed(1)}°`
    );

    // Add trail
    newBall.trails = [
      { position: { x: ball.position.x, y: ball.position.y }, timestamp: Date.now() },
      ...ball.trails.slice(0, this.trailLength - 1),
    ];

    // Top and bottom wall collisions
    if (newBall.position.y <= BALL_CONFIG.radius) {
      newBall.position.y = BALL_CONFIG.radius;
      newBall.velocity.y = Math.abs(newBall.velocity.y);
    } else if (newBall.position.y >= CANVAS_HEIGHT - BALL_CONFIG.radius) {
      newBall.position.y = CANVAS_HEIGHT - BALL_CONFIG.radius;
      newBall.velocity.y = -Math.abs(newBall.velocity.y);
    }

    // Left paddle collision
    const leftPaddleCollision = this.checkPaddleCollision(newBall, leftPaddle);
    if (leftPaddleCollision.hit) {
      newBall.position.x = leftPaddle.position.x + leftPaddle.width + BALL_CONFIG.radius;
      newBall.velocity.x = Math.abs(newBall.velocity.x);
      newBall.velocity.y = leftPaddleCollision.deflectionAngle * this.maxBallSpeed;
      this.limitBallSpeed(newBall, difficulty);
    }

    // Right paddle collision
    const rightPaddleCollision = this.checkPaddleCollision(newBall, rightPaddle);
    if (rightPaddleCollision.hit) {
      newBall.position.x = rightPaddle.position.x - BALL_CONFIG.radius;
      newBall.velocity.x = -Math.abs(newBall.velocity.x);
      newBall.velocity.y = rightPaddleCollision.deflectionAngle * this.maxBallSpeed;
      this.limitBallSpeed(newBall, difficulty);
    }

    // Check for scoring (ball goes off left or right edge)
    if (newBall.position.x <= 0) {
      scoringPlayer = 'playerRight';
    } else if (newBall.position.x >= CANVAS_WIDTH) {
      scoringPlayer = 'playerLeft';
    }

    return { ball: newBall, scoringPlayer };
  }

  /**
   * Checks collision between ball and paddle
   */
  private checkPaddleCollision(
    ball: Ball,
    paddle: Paddle
  ): { hit: boolean; deflectionAngle: number } {
    const ballLeft = ball.position.x - ball.radius;
    const ballRight = ball.position.x + ball.radius;
    const ballTop = ball.position.y - ball.radius;
    const ballBottom = ball.position.y + ball.radius;

    const paddleLeft = paddle.position.x;
    const paddleRight = paddle.position.x + paddle.width;
    const paddleTop = paddle.position.y;
    const paddleBottom = paddle.position.y + paddle.height;

    // Check if ball overlaps with paddle
    const hit =
      ballRight >= paddleLeft &&
      ballLeft <= paddleRight &&
      ballBottom >= paddleTop &&
      ballTop <= paddleBottom;

    let deflectionAngle = 0;
    if (hit) {
      // Calculate deflection angle based on where ball hits paddle
      const paddleCenter = paddle.position.y + paddle.height / 2;
      const hitPosition = (ball.position.y - paddleCenter) / (paddle.height / 2);
      // Normalize to -1 to 1 and apply max deflection of 0.75 radians
      deflectionAngle = hitPosition * 0.75;
    }

    return { hit, deflectionAngle };
  }

  /**
   * Limits ball speed based on difficulty
   */
  private limitBallSpeed(ball: Ball, difficulty: Difficulty): void {
    const maxSpeed = DIFFICULTY_CONFIGS[difficulty].ballSpeed * 1.2;
    const currentSpeed = Math.sqrt(ball.velocity.x ** 2 + ball.velocity.y ** 2);

    if (currentSpeed > maxSpeed) {
      const ratio = maxSpeed / currentSpeed;
      ball.velocity.x *= ratio;
      ball.velocity.y *= ratio;
    }
  }

  private getBallDirection(velocityX: number, velocityY: number): string {
    const absX = Math.abs(velocityX);
    const absY = Math.abs(velocityY);

    // Determine primary horizontal direction
    const horizontal = velocityX > 0 ? 'Right' : 'Left';

    // Determine vertical component
    let vertical = '';
    if (absY > absX * 0.3) {
      // Only include vertical if it's significant
      vertical = velocityY > 0 ? 'Down' : 'Up';
    }

    // Combine directions
    if (vertical) {
      return `${vertical}-${horizontal}`;
    } else {
      return horizontal;
    }
  }

  /**
   * Resets ball to center with random direction
   */
  resetBall(difficulty: Difficulty): Ball {
    const speed = DIFFICULTY_CONFIGS[difficulty].ballSpeed;
    const direction = Math.random() > 0.5 ? 1 : -1;
    const angle = (Math.random() - 0.5) * 0.5; // Random angle up to 0.25 radians

    return {
      position: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 },
      velocity: {
        x: speed * direction,
        y: speed * Math.sin(angle),
      },
      radius: BALL_CONFIG.radius,
      trails: [],
    };
  }

  /**
   * Checks if game should end based on score
   */
  checkGameEnd(
    playerLeftScore: number,
    playerRightScore: number,
    winningScore: number = 5
  ): {
    gameEnded: boolean;
    winner: Players | null;
  } {
    if (playerLeftScore >= winningScore) {
      return { gameEnded: true, winner: 'playerLeft' };
    } else if (playerRightScore >= winningScore) {
      return { gameEnded: true, winner: 'playerRight' };
    }
    return { gameEnded: false, winner: null };
  }
}
