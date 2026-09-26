import express from 'express';
import {
  createFreeContent,
  getAllFreeContent,
  getFreeContentById,
  updateFreeContent,
  deleteFreeContent,
  startFreeQuiz,
  submitFreeQuiz,
  getFreeQuizHistory
} from '../controllers/freeContentController.js';
import accessTokenAutoRefresh from '../middlewares/accessTokenAutoRefresh.js';
import passport from 'passport';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();

// Public / User Routes
router.get('/', getAllFreeContent);
router.get('/:id', getFreeContentById);

// Free Quiz Execution Routes (Requires Auth)
router.post('/quiz/start', accessTokenAutoRefresh, passport.authenticate('jwt', { session: false }), startFreeQuiz);
router.post('/quiz/:freeQuizId/submit', accessTokenAutoRefresh, passport.authenticate('jwt', { session: false }), submitFreeQuiz);
router.get('/quiz/:freeQuizId/history', accessTokenAutoRefresh, passport.authenticate('jwt', { session: false }), getFreeQuizHistory);

import { upload } from '../middlewares/upload-middleware.js';

// Admin Routes
router.post('/', accessTokenAutoRefresh, passport.authenticate('jwt', { session: false }), isAdmin, upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'pdfFile', maxCount: 1 }]), createFreeContent);
router.put('/:id', accessTokenAutoRefresh, passport.authenticate('jwt', { session: false }), isAdmin, upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'pdfFile', maxCount: 1 }]), updateFreeContent);
router.delete('/:id', accessTokenAutoRefresh, passport.authenticate('jwt', { session: false }), isAdmin, deleteFreeContent);

export default router;
