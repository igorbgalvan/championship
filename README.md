# Championship - Tournament Bracket System

A single-page Angular application for managing single-elimination (knockout) tournaments with a beautiful bracket visualization.

## Features

- Create tournaments with any number of players (>= 2)
- Automatic handling of odd numbers with random byes
- Interactive bracket tree visualization
- Click player names to select winners
- Automatic winner advancement
- Edit completed matches and recalculate future rounds
- LocalStorage persistence
- Import/Export tournament state as JSON
- Responsive design (vertical tree on desktop, horizontal scroll on mobile)
- Dark theme with retro/terminal aesthetic

## Tech Stack

- Angular 17 (standalone components)
- NG Zorro Ant Design
- TypeScript
- SCSS

## Installation

```bash
cd championship
npm install
```

## Development

```bash
npm start
```

Navigate to `http://localhost:4200/`

## Build

```bash
npm run build
```

## Usage

1. **Create Tournament**: Enter tournament name (optional) and number of players
2. **Add Players**: Enter player names
3. **Start Tournament**: The bracket is automatically generated
4. **Select Winners**: Click on player names to advance them
5. **Edit Matches**: Use the edit button to reopen completed matches
6. **Export/Import**: Save or load tournament state as JSON

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── tournament-setup/    # Initial setup form
│   │   ├── player-input/         # Player name input
│   │   ├── bracket-tree/         # Main bracket visualization
│   │   └── match-node/           # Individual match component
│   ├── services/
│   │   └── tournament.service.ts # Tournament logic & state
│   └── models/
│       ├── tournament.model.ts
│       └── match.model.ts
└── styles.scss                    # Global styles
```

## License

MIT
# championship
