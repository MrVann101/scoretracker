# Sports Score Tracker - Next.js Migration

This project has been successfully migrated from a vanilla HTML/JavaScript application to a modern Next.js application with React components and Firebase integration.

## Project Structure

```
app/
├── layout.tsx              # Root layout with GameProvider
├── page.tsx               # Basketball page (default)
├── globals.css            # Global styles with custom theme
├── volleyball/page.tsx    # Volleyball tracker
├── badminton/page.tsx     # Badminton tracker
└── tennis/page.tsx        # Tennis tracker

components/
├── game-page.tsx          # Main game page component
├── scoreboard.tsx         # Scoreboard display
├── action-panel.tsx       # Player action controls
└── new-game-modal.tsx     # New game setup modal

lib/
├── firebase.ts            # Firebase configuration
├── sports-config.ts       # Sport configurations and types
└── game-context.tsx       # React Context for game state management

public/                    # Static assets
```

## Key Changes from Original

### Architecture
- **Vanilla JavaScript** → **React with TypeScript**
- **HTML files** → **Next.js Pages & Components**
- **Global state** → **React Context API**
- **Static styling** → **Tailwind CSS + Custom Theme**

### Technology Stack
- Next.js 16.2.2 with App Router
- React 19 with TypeScript
- Firebase Admin SDK with Firestore
- Tailwind CSS v4
- ESLint configuration

### Features Preserved
✅ Multi-sport support (Basketball, Volleyball, Badminton, Tennis)
✅ Firebase Firestore backend
✅ Real-time score updates
✅ Player stat tracking
✅ Persist game state in localStorage
✅ Art-deco theme with gold accents

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Firebase Setup

The Firebase configuration is already included in `lib/firebase.ts`. Make sure you have access to the Firebase project with ID `score-tracker-7bfc7`.

## Development

### Creating a New Game

1. Click "New Game" button
2. Select a sport
3. Enter team names
4. Click "Start" to begin

### Recording Player Actions

1. Enter player name and jersey number
2. Select team (Home/Guest)
3. Click action buttons to record stats
4. Stats update in real-time in Firestore

### Switching Sports

Use the sport buttons in the navigation bar to switch between different sports. Each sport has its own action buttons and stat tracking.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Styling

The application uses a custom theme with:
- Dark background: `#0a192f`
- Gold accent color: `#D4AF37`
- Monaco-inspired serif font (Cinzel)
- Shadow effects and gradients

All styles are defined in `app/globals.css` and `tailwind.config.ts`.

## Component Documentation

### GamePage
Main page component that renders the game interface for a specific sport.

### Scoreboard
Displays team names and current scores. Team names are editable.

### ActionPanel
Allows adding players and recording actions/stats.

### NewGameModal
Modal for starting a new game with sport and team selection.

## Next Steps

- Add player statistics visualization
- Implement game history
- Add authentication for multi-user support
- Deploy to Vercel
- Add PWA capabilities for offline support

## Backup

Original files have been backed up in `/Desktop/scoretracker_backup_old/`
