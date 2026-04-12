# Quick Reference

## Started Development Server ✅

- **URL**: http://localhost:3000
- **Network**: http://192.168.1.5:3000

## Project Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## File Locations

| Purpose | Path |
|---------|------|
| Basketball | `app/page.tsx` |
| Volleyball | `app/volleyball/page.tsx` |
| Badminton | `app/badminton/page.tsx` |
| Tennis | `app/tennis/page.tsx` |
| Styles | `app/globals.css` |
| Firebase | `lib/firebase.ts` |
| State | `lib/game-context.tsx` |
| Sports Config | `lib/sports-config.ts` |

## Component Map

```
GamePage (Main)
├── Header
├── Navigation (Sport Selector)
├── Scoreboard
│   ├── Home Team Score
│   └── Guest Team Score
└── ActionPanel
    ├── Player Input
    └── Action Buttons
```

## Key Features

- 🏀 Multi-sport tracking
- 🔥 Real-time Firebase updates
- 💾 LocalStorage persistence
- 📱 Mobile responsive
- ✨ Art-deco theme

## Firebase Structure

```
games/
├── {gameId}
│   ├── scoreboard/totals -> { home, guest }
│   └── players/
│       └── {team_jersey} -> { name, stats... }
```

## Environment

- Node.js compatible
- Next.js 16.2.2
- React 19
- TypeScript 5
- Tailwind CSS 4
- Firebase 11

## Useful Links

- Next.js Docs: https://nextjs.org/docs
- Firebase Docs: https://firebase.google.com/docs
- Tailwind CSS: https://tailwindcss.com/docs
- React: https://react.dev

## Quick Tips

1. **Change Sport**: Click sport buttons in navbar
2. **Edit Team Names**: Click and type in scoreboard
3. **Add Player**: Enter name + jersey + team + click "Add Player"
4. **Record Stat**: Select player info then click action button
5. **End Game**: Click "End Game" button

## Common Issues

| Issue | Solution |
|-------|----------|
| Port 3000 in use | `npm run dev -- -p 3001` |
| Styles not loading | Restart dev server |
| Firebase error | Check internet & project |
| Build failing | Run `npm run lint --fix` |

---

**Development server is running! 🚀**
