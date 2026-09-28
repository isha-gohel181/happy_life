import express from 'express';
import {
  getTestSeriesList,
  getTestSeriesById,
  createTestSeries,
  updateTestSeries,
  deleteTestSeries,
  startTestSeries,
  submitTestSeries,
  getSubmittedTestSeries,
  testSeriesCheckoutInit,
  testSeriesCheckoutVerify
} from '../controllers/testSeriesController.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import passport from 'passport';
import { upload } from '../middlewares/upload-middleware.js';

const router = express.Router();

// Public/App routes
router.get('/', getTestSeriesList);
router.get('/:id', getTestSeriesById);

// Playback and Submission routes (Protected)
router.post('/:id/start', passport.authenticate('jwt', { session: false }), startTestSeries);
router.post('/:id/submit', passport.authenticate('jwt', { session: false }), submitTestSeries);
router.get('/submission/:submissionId', passport.authenticate('jwt', { session: false }), getSubmittedTestSeries);

// Checkout routes
router.post('/checkout/init', passport.authenticate('jwt', { session: false }), testSeriesCheckoutInit);
router.post('/checkout/verify', passport.authenticate('jwt', { session: false }), testSeriesCheckoutVerify);

// Admin routes
router.post('/', passport.authenticate('jwt', { session: false }), isAdmin, upload.fields([{ name: 'coverImage', maxCount: 1 }]), createTestSeries);
router.put('/:id', passport.authenticate('jwt', { session: false }), isAdmin, upload.fields([{ name: 'coverImage', maxCount: 1 }]), updateTestSeries);
router.delete('/:id', passport.authenticate('jwt', { session: false }), isAdmin, deleteTestSeries);

export default router;
