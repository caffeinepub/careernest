// Utility functions for localStorage operations

export interface SharedNote {
  id: string;
  uploaderId: string; // Principal toString()
  uploaderName: string;
  educationLevel: string;
  board: string;
  className: string;
  subject: string;
  topic: string;
  content: string;
  imageData?: string; // base64 if image uploaded
  timestamp: number;
  likes: string[]; // array of Principal IDs who liked
  reports: string[]; // array of Principal IDs who reported
  isHidden: boolean;
}

export interface GameScore {
  userId: string;
  gameName: string;
  score: number;
  timestamp: number;
  duration: number; // seconds
  details?: any; // game-specific details (accuracy, reaction times, etc.)
}

export interface GameStats {
  gamesPlayed: number;
  totalTimeSpent: number;
  highScores: Record<string, number>; // gameName -> best score
}

// Shared Notes Storage
const SHARED_NOTES_KEY = "careernest_shared_notes";

export const getSharedNotes = (): SharedNote[] => {
  try {
    const data = localStorage.getItem(SHARED_NOTES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading shared notes:", error);
    return [];
  }
};

export const addSharedNote = (
  note: Omit<SharedNote, "id" | "timestamp" | "likes" | "reports" | "isHidden">,
): SharedNote => {
  const notes = getSharedNotes();
  const newNote: SharedNote = {
    ...note,
    id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    likes: [],
    reports: [],
    isHidden: false,
  };
  notes.push(newNote);
  localStorage.setItem(SHARED_NOTES_KEY, JSON.stringify(notes));
  return newNote;
};

export const deleteSharedNote = (noteId: string): void => {
  const notes = getSharedNotes();
  const filtered = notes.filter((note) => note.id !== noteId);
  localStorage.setItem(SHARED_NOTES_KEY, JSON.stringify(filtered));
};

export const toggleNoteLike = (noteId: string, userId: string): void => {
  const notes = getSharedNotes();
  const note = notes.find((n) => n.id === noteId);
  if (note) {
    const likeIndex = note.likes.indexOf(userId);
    if (likeIndex > -1) {
      note.likes.splice(likeIndex, 1);
    } else {
      note.likes.push(userId);
    }
    localStorage.setItem(SHARED_NOTES_KEY, JSON.stringify(notes));
  }
};

export const reportNote = (noteId: string, userId: string): void => {
  const notes = getSharedNotes();
  const note = notes.find((n) => n.id === noteId);
  if (note && !note.reports.includes(userId)) {
    note.reports.push(userId);
    // Auto-hide if reported by 3+ users
    if (note.reports.length >= 3) {
      note.isHidden = true;
    }
    localStorage.setItem(SHARED_NOTES_KEY, JSON.stringify(notes));
  }
};

export const getUserSharedNotes = (userId: string): SharedNote[] => {
  return getSharedNotes().filter(
    (note) => note.uploaderId === userId && !note.isHidden,
  );
};

export const filterSharedNotes = (filters: {
  educationLevel?: string;
  board?: string;
  className?: string;
  subject?: string;
  topic?: string;
  searchQuery?: string;
}): SharedNote[] => {
  let notes = getSharedNotes().filter((note) => !note.isHidden);

  if (filters.educationLevel && filters.educationLevel !== "all") {
    notes = notes.filter(
      (note) => note.educationLevel === filters.educationLevel,
    );
  }
  if (filters.board && filters.board !== "all") {
    notes = notes.filter((note) => note.board === filters.board);
  }
  if (filters.className && filters.className !== "all") {
    notes = notes.filter((note) => note.className === filters.className);
  }
  if (filters.subject && filters.subject !== "all") {
    const subjectQuery = filters.subject.toLowerCase();
    notes = notes.filter((note) =>
      note.subject.toLowerCase().includes(subjectQuery),
    );
  }
  if (filters.topic && filters.topic !== "all") {
    const topicQuery = filters.topic.toLowerCase();
    notes = notes.filter((note) =>
      note.topic.toLowerCase().includes(topicQuery),
    );
  }
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    notes = notes.filter(
      (note) =>
        note.topic.toLowerCase().includes(query) ||
        note.subject.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query),
    );
  }

  return notes.sort((a, b) => b.timestamp - a.timestamp);
};

// Game Scores Storage
const GAME_SCORES_KEY = "careernest_game_scores";
const GAME_STATS_KEY = "careernest_game_stats";

export const saveGameScore = (
  score: Omit<GameScore, "timestamp">,
): GameScore => {
  const scores = getGameScores();
  const newScore: GameScore = {
    ...score,
    timestamp: Date.now(),
  };
  scores.push(newScore);
  localStorage.setItem(GAME_SCORES_KEY, JSON.stringify(scores));

  // Update stats
  updateGameStats(score.gameName, score.score, score.duration);

  return newScore;
};

export const getGameScores = (): GameScore[] => {
  try {
    const data = localStorage.getItem(GAME_SCORES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading game scores:", error);
    return [];
  }
};

export const getUserGameScores = (
  userId: string,
  gameName?: string,
): GameScore[] => {
  let scores = getGameScores().filter((score) => score.userId === userId);
  if (gameName) {
    scores = scores.filter((score) => score.gameName === gameName);
  }
  return scores.sort((a, b) => b.timestamp - a.timestamp);
};

export const getHighScore = (userId: string, gameName: string): number => {
  const scores = getUserGameScores(userId, gameName);
  return scores.length > 0 ? Math.max(...scores.map((s) => s.score)) : 0;
};

export const getGameStats = (userId: string): GameStats => {
  try {
    const key = `${GAME_STATS_KEY}_${userId}`;
    const data = localStorage.getItem(key);
    return data
      ? JSON.parse(data)
      : { gamesPlayed: 0, totalTimeSpent: 0, highScores: {} };
  } catch (error) {
    console.error("Error reading game stats:", error);
    return { gamesPlayed: 0, totalTimeSpent: 0, highScores: {} };
  }
};

const updateGameStats = (
  gameName: string,
  score: number,
  duration: number,
): void => {
  // Note: This assumes we have access to userId in context
  // For now, we'll use a generic key and update it properly when integrated
  const userId = "current_user"; // This should come from useInternetIdentity
  const key = `${GAME_STATS_KEY}_${userId}`;
  const stats = getGameStats(userId);

  stats.gamesPlayed += 1;
  stats.totalTimeSpent += duration;

  if (!stats.highScores[gameName] || score > stats.highScores[gameName]) {
    stats.highScores[gameName] = score;
  }

  localStorage.setItem(key, JSON.stringify(stats));
};

export const getLeaderboard = (gameName: string, limit = 10): GameScore[] => {
  const scores = getGameScores().filter((score) => score.gameName === gameName);
  return scores.sort((a, b) => b.score - a.score).slice(0, limit);
};
