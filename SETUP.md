# Setup Guide

## Development Environment

Your Next.js Sports Score Tracker is now running!

### Access the Application

- **Local**: http://localhost:3000
- **Network**: http://192.168.1.5:3000

### Default Routes

- `/` - Basketball tracker
- `/volleyball` - Volleyball tracker  
- `/badminton` - Badminton tracker
- `/tennis` - Tennis tracker

## First Time Use

1. Open http://localhost:3000 in your browser
2. Click "New Game" button
3. Select a sport
4. Enter team names (optional)
5. Click "Start Game"
6. Add players and record stats using the action panel

## Features

✅ **Multi-Sport Support**: Basketball, Volleyball, Badminton, Tennis
✅ **Real-Time Updates**: Firebase Firestore integration
✅ **Player Tracking**: Record individual player statistics
✅ **Persistent Storage**: Game state saved in localStorage and Firestore
✅ **Responsive Design**: Works on desktop and mobile
✅ **Modern UI**: Art-deco themed with gold accents

## Firebase Configuration

Your Firebase project is already configured in `lib/firebase.ts`:
- Project ID: `score-tracker-7bfc7`
- Database: Firestore
- Real-time synchronization enabled

## Building for Production

```bash
npm run build
npm run start
```

## Troubleshooting

### Port 3000 already in use?
```bash
npm run dev -- -p 3001
```

### Firebase not connecting?
- Check your internet connection
- Verify your Firebase project is active
- Check browser console for error messages

### Styles not loading?
- Make sure Tailwind CSS is compiled (automatic in dev mode)
- Clear browser cache and restart dev server

## Next Steps

- Deploy to Vercel: `vercel deploy`
- Add player history tracking
- Implement authentication
- Add game statistics dashboard
- Enable PWA for offline support

## Support

For issues or questions:
1. Check the console for error messages (F12)
2. Review the MIGRATION.md file for architecture details
3. Check Firebase console for database issues
