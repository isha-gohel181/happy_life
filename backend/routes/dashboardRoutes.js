import express from 'express';
import passport from 'passport';
import accessTokenAutoRefresh from '../middlewares/accessTokenAutoRefresh.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import DashboardController from '../controllers/dashboardController.js';

const router = express.Router();

// GET /api/v1/dashboard/ - admin dashboard overview (admin only)
router.get(
  '/',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  DashboardController.getDashboard
);

export default router;
