import express from 'express';
import { checkUnlockConditions, bulkCheckUnlockConditions } from '../controllers/unlockConditionChecker.js';
import accessTokenAutoRefresh from '../middlewares/accessTokenAutoRefresh.js';
import passport from 'passport';

const Unlockrouter = express.Router();

// POST /api/drip/check-unlock-conditions
Unlockrouter.post('/check-unlock-conditions', accessTokenAutoRefresh, passport.authenticate('jwt', { session: false }), checkUnlockConditions);

// POST /api/drip/bulk-check-unlock
Unlockrouter.post('/bulk-check-unlock', accessTokenAutoRefresh, passport.authenticate('jwt', { session: false }), bulkCheckUnlockConditions);

export default Unlockrouter;