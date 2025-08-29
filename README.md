# Ping Pong Game

A classic arcade-style ping pong game built with TypeScript, React, and HTML5 Canvas.

## 🎮 Features

- **Two-player gameplay** with smooth paddle controls
- **Ball trail effects** with fading animation
- **Multiple difficulty levels** (Easy, Medium, Hard)
- **Score tracking** and match history
- **Leaderboard** with persistent game records
- **Keyboard controls** for both players

## 🚀 Live Demo

**🎮 [Play the Game](https://busyginartem.github.io/ping-pong-game)**

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## 🎯 How to Play

1. Click "New Game" and enter player names
2. Choose difficulty level
3. Player 1 uses `W/S` keys, Player 2 uses `↑/↓` arrow keys
4. First to 5 points wins!

### Controls

- **Player 1**: `W` (up) / `S` (down)
- **Player 2**: `↑` (up) / `↓` (down)
- **Pause**: `Space`
- **Restart**: `R`

## 🛠️ Technology Choices

### Why Zustand?

Chose Zustand over Redux for lightweight state management with better performance for frequent game state updates.

### Why HTML5 Canvas?

Canvas provides smooth 60fps rendering and precise collision detection needed for real-time gameplay, superior to DOM-based animations.

### Why Custom Game Engine?

Separated game logic into a dedicated class for better testability, easier debugging, and potential future AI opponent integration.

### Architecture Pattern

Used modular architecture with:

- **Core layer**: Game engine and utilities
- **Store layer**: State management with Zustand
- **Hooks layer**: Reusable game logic
- **UI layer**: React components

## 📁 Project Structure

```
src/
├── app/                # App entry point and global styles
├── modules/game/       # Game module
│   ├── core/               # Game engine & utilities
│   ├── hooks/              # Custom hooks
│   ├── store/              # State management
│   ├── types/              # TypeScript definitions
│   └── ui/                 # React components
├── shared/             # Shared utilities & components
│   ├── constants/          # Game constants
│   ├── hooks/              # Shared hooks
│   ├── ui/                 # UI components
│   └── utils/              # Utility functions
└── tests/              # Test files
```

## 🔮 Future Enhancements

- AI opponent for single-player mode
- Sound effects and background music
- Online multiplayer with WebSockets
- Player statistics and achievements
