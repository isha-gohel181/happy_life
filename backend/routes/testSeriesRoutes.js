import express from 'express';
import {
  getTestSeriesList,
  getTestSeriesById,
  createTestSeries,
  updateTestSeries,
  deleteTestSeries
} from '../controllers/testSeriesController.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import passport from 'passport';

const router = express.Router();

// Public/App routes
router.get('/', getTestSeriesList);
router.get('/:id', getTestSeriesById);

// Admin routes
router.post('/', passport.authenticate('jwt', { session: false }), isAdmin, createTestSeries);
router.put('/:id', passport.authenticate('jwt', { session: false }), isAdmin, updateTestSeries);
router.delete('/:id', passport.authenticate('jwt', { session: false }), isAdmin, deleteTestSeries);

export default router;
