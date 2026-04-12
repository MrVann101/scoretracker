export const SPORTS = {
  basketball: {
    title: 'Basketball Points Tracker',
    defaultStats: { points: 0, assists: 0, rebounds: 0, steals: 0, blocks: 0 },
    records: [
      { key: "points", label: "PTS (Points)" },
      { key: "assists", label: "AST (Assists)" },
      { key: "rebounds", label: "REB (Rebounds)" },
      { key: "steals", label: "STL (Steals)" },
      { key: "blocks", label: "BLK (Blocks)" },
    ],
    actions: [
      { id: "p1", label: "+1", pointsInc: 1, statIncrements: { points: 1 } },
      { id: "p2", label: "+2", pointsInc: 2, statIncrements: { points: 2 } },
      { id: "p3", label: "+3", pointsInc: 3, statIncrements: { points: 3 } },
      { id: "assist", label: "+Assist", pointsInc: 0, statIncrements: { assists: 1 } },
      { id: "rebound", label: "+Rebound", pointsInc: 0, statIncrements: { rebounds: 1 } },
      { id: "steal", label: "+Steal", pointsInc: 0, statIncrements: { steals: 1 } },
      { id: "block", label: "+Block", pointsInc: 0, statIncrements: { blocks: 1 } },
    ],
  },
  volleyball: {
    title: 'Volleyball Points Tracker',
    defaultStats: {
      kills: 0,
      aces: 0,
      blocks: 0,
      digs: 0,
      assists: 0,
    },
    records: [
      { key: "kills", label: "Kills" },
      { key: "aces", label: "Aces" },
      { key: "blocks", label: "Blocks" },
      { key: "digs", label: "Digs" },
      { key: "assists", label: "Assists" },
    ],
    actions: [
      { id: "kill", label: "+Kill", pointsInc: 1, statIncrements: { kills: 1 } },
      { id: "block", label: "+Block", pointsInc: 1, statIncrements: { blocks: 1 } },
      { id: "ace", label: "+Ace", pointsInc: 1, statIncrements: { aces: 1 } },
      { id: "assist", label: "+Assist", pointsInc: 0, statIncrements: { assists: 1 } },
      { id: "dig", label: "+Dig", pointsInc: 0, statIncrements: { digs: 1 } },
    ],
  },
  badminton: {
    title: 'Badminton Points Tracker',
    defaultStats: {
      smashWinners: 0,
      netWinners: 0,
      serviceAces: 0,
      unforcedErrors: 0,
      pointsOnService: 0,
    },
    records: [
      { key: "smashWinners", label: "Smash Winners" },
      { key: "netWinners", label: "Net Winners" },
      { key: "serviceAces", label: "Service Aces" },
      { key: "unforcedErrors", label: "Unforced Errors" },
      { key: "pointsOnService", label: "Points on Service" },
    ],
    actions: [
      { id: "smash", label: "+Smash Winner", pointsInc: 1, statIncrements: { smashWinners: 1 } },
      { id: "net", label: "+Net Winner", pointsInc: 1, statIncrements: { netWinners: 1 } },
      { id: "ace", label: "+Service Ace", pointsInc: 1, statIncrements: { serviceAces: 1 } },
      { id: "error", label: "+Unforced Error", pointsInc: 0, statIncrements: { unforcedErrors: 1 } },
      { id: "servicePoint", label: "+Point on Service", pointsInc: 0, statIncrements: { pointsOnService: 1 } },
    ],
  },
  tennis: {
    title: 'Tennis Points Tracker',
    defaultStats: {
      aces: 0,
      winners: 0,
      unforcedErrors: 0,
      firstServePercentage: 0,
      breakPointsWon: 0,
      doubleFaults: 0,
    },
    records: [
      { key: "aces", label: "Aces" },
      { key: "winners", label: "Winners" },
      { key: "unforcedErrors", label: "Unforced Errors" },
      { key: "firstServePercentage", label: "1st Serve %" },
      { key: "breakPointsWon", label: "Break Points Won" },
      { key: "doubleFaults", label: "Double Faults" },
    ],
    actions: [
      { id: "ace", label: "+Ace", pointsInc: 1, statIncrements: { aces: 1 } },
      { id: "winner", label: "+Winner", pointsInc: 1, statIncrements: { winners: 1 } },
      { id: "error", label: "+Unforced Error", pointsInc: 0, statIncrements: { unforcedErrors: 1 } },
      { id: "serve", label: "+1st Serve Made", pointsInc: 0, statIncrements: { firstServePercentage: 1 } },
      { id: "breakPoint", label: "+Break Point Won", pointsInc: 0, statIncrements: { breakPointsWon: 1 } },
      { id: "doubleFault", label: "+Double Fault", pointsInc: 0, statIncrements: { doubleFaults: 1 } },
    ],
  },
} as const;

export type SportKey = keyof typeof SPORTS;
