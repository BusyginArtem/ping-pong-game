# 🏓 Ping-Pong Game – Project Plan

This is a step-by-step implementation plan for the Ping-Pong game in React + TypeScript + Vite.

---

## ✅ Setup
- [✅] Create Vite + React + TS project
- [✅] Add ESLint + Prettier + Husky + lint-staged
- [✅] Add Vitest + React Testing Library
- [✅] Create folder structure:
    src/
       - app/
       - shared/ui/
       - modules/
          - game/
              - core/
              - hooks/
              - ui/
              - types/

---

## 🎮 Core Game
- [✅] Implement `useGameLoop` hook with `requestAnimationFrame`
- [✅] Store ball & paddles positions in Zustand state
- [✅] Manage scores & game status in Zustand state

---

## ⌨️ Controls
- [✅] Add keyboard handling (W/S for left, ArrowUp/Down for right)
- [✅] Clamp paddles to canvas bounds

---

## 🖼 Rendering
- [✅] Set up `<canvas>` for game field
- [✅] Draw net, paddles, ball each frame
- [✅] Clear canvas each frame
- [ ] Handle canvas scaling (responsive)

---

## 🔄 Collision & Physics
- [✅] Ball-wall collision → invert Y velocity
- [✅] Ball-paddle collision → invert X velocity + adjust angle by hit position
- [✅] Ball out of bounds → increment opponent score + reset ball

---

## 🏆 Scoring System
- [✅] Track `leftScore` and `rightScore`
- [✅] Win condition: 5 points
- [✅] Show modal with winner & restart button

---

## ⭐ Bonus Features
### Ball Traces
- [✅] Keep buffer of last 30 ball positions
- [✅] Render trail with fading alpha

### Difficulty Levels
- [✅] Define `Easy | Medium | Hard` difficulties
- [✅] Adjust ball speed per difficulty
- [✅] Add difficulty selector in UI

### Leaderboard
- [✅] Store results in `localStorage`
- [✅] Save `{ player, score, date }` on game end
- [✅] Display scores in UI

---

## 🖥 UI Components
- [✅] `Field` – canvas + game loop
- [✅] `Controls` – pause/resume, restart, difficulty
- [✅] `Leaderboard` – scores
- [✅] `GameOverModal` – winner screen, enter name

---

## ♿ Accessibility & UX
- [✅] Keyboard-only play
- [ ] Announce score changes with `aria-live="polite"`
- [✅] Add visible game instructions

---

## 🧪 Testing
- [✅] Unit tests for collision, scoring, reset
- [✅] Component tests for scoreboard, difficulty selector, leaderboard
- [ ] Mock `requestAnimationFrame` for loop tests

---

## 🚀 Deployment
- [✅] Push repo to GitHub
- [✅] Add live link to README

---

## 📄 Documentation
- [✅] `README.md` → features, controls, setup, deploy link
- [✅] `Notes.md` → architecture, design decisions, trade-offs, improvements

---

## 🎨 Polishing
- [ ] Responsive canvas scaling
- [ ] Consistent aspect ratio
- [✅] Nice styling (CSS modules / Tailwind)
- [✅] Highlight score changes