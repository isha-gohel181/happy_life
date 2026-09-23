import express from 'express';
import { saveAdminLogs } from '../controllers/AdminActivityLogController.js';
import accessTokenAutoRefresh from '../middlewares/accessTokenAutoRefresh.js';
import passport from 'passport';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();

router.post('/', accessTokenAutoRefresh, passport.authenticate('jwt', { session: false }), isAdmin, saveAdminLogs);
router.post('/beacon', accessTokenAutoRefresh, passport.authenticate('jwt', { session: false }), isAdmin, saveAdminLogs);

export default router;
