# Global Strategy Game

A complex strategy game with advanced AI diplomacy, market simulation, and multiple game systems.

## Features

- Advanced AI Diplomacy System
- Dynamic Market Simulation
- Intelligence & Espionage System
- Population & Social Dynamics
- Environmental Impact System
- Research & Technology System

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Technology Stack

- Next.js
- TypeScript
- Zustand (State Management)
- Immer (Immutable State Updates)
- TailwindCSS (Styling)

## Project Structure

```
src/
  ├── types/          # TypeScript type definitions
  ├── lib/            # Core game logic
  │   └── game-engine/
  │       ├── core.ts
  │       └── systems/
  │           ├── ai-diplomacy.ts
  │           ├── market-simulation.ts
  │           ├── intelligence.ts
  │           ├── population.ts
  │           ├── environment.ts
  │           └── research.ts
  ├── components/     # React components
  ├── pages/         # Next.js pages
  └── styles/        # CSS styles
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT