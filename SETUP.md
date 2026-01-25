# Quick Setup Guide

## Prerequisites
- Node.js 18+ (Angular 17 compatible)
- npm

## Installation Steps

1. **Install Dependencies**
   ```bash
   cd championship
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Open Browser**
   Navigate to `http://localhost:4200/`

## Features Implemented

✅ Tournament creation with any number of players (>= 2)  
✅ Automatic bye handling for odd numbers  
✅ Interactive bracket visualization  
✅ Click-to-select winners  
✅ Automatic winner advancement  
✅ Edit completed matches  
✅ LocalStorage persistence  
✅ Import/Export JSON  
✅ Responsive design (desktop + mobile)  
✅ Dark theme with retro aesthetic  

## Project Structure

```
championship/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── tournament-setup/    # Setup form
│   │   │   ├── player-input/        # Player names
│   │   │   ├── bracket-tree/        # Main bracket
│   │   │   └── match-node/          # Match component
│   │   ├── services/
│   │   │   └── tournament.service.ts
│   │   └── models/
│   ├── styles.scss
│   └── main.ts
├── package.json
└── angular.json
```

## Usage

1. Enter tournament name (optional) and number of players
2. Fill in all player names
3. Click "Start Tournament"
4. Click player names to select winners
5. Use "Edit" button to reopen matches
6. Export/Import tournament state as needed
