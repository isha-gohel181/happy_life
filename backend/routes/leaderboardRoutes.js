import express from 'express';
import {
  saveLeaderboardSettings,
  getLeaderboardSettings,
  updateLeaderboardEntry,
  getGlobalLeaderboardAPI,
  getUserLeaderboardAPI,
  getUserHistoryAPI
} from '../controllers/leaderboardController.js';
import accessTokenAutoRefresh from '../middlewares/accessTokenAutoRefresh.js';
import passport from 'passport';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();

// Admin APIs
router.post('/admin/leaderboard/settings', accessTokenAutoRefresh, passport.authenticate('jwt', { session: false }), isAdmin, saveLeaderboardSettings);
router.get('/admin/leaderboard/settings', accessTokenAutoRefresh, passport.authenticate('jwt', { session: false }), isAdmin, getLeaderboardSettings);

// User APIs
router.post('/leaderboard/update', accessTokenAutoRefresh, passport.authenticate('jwt', { session: false }), updateLeaderboardEntry);
router.get('/leaderboard/global', getGlobalLeaderboardAPI);
router.get('/leaderboard/user/:userId', getUserLeaderboardAPI);
router.get('/leaderboard/history/:userId', getUserHistoryAPI);

export default router;
