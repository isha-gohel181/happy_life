import express from 'express';
import {
  createPage,
  getAllPages,
  getPageById,
  updatePage,
  deletePage
} from '../controllers/pageController.js';
import accessTokenAutoRefresh from '../middlewares/accessTokenAutoRefresh.js';
import passport from 'passport';
import { isAdmin } from '../middlewares/isAdmin.js';

const pageRouter = express.Router();

// Create page (admin only)
pageRouter.post(
  '/',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  createPage
);

// Get all pages (public — needed for frontend rendering)
pageRouter.get('/', getAllPages);

// Get single page (public)
pageRouter.get('/:id', getPageById);

// Update page (admin only)
pageRouter.put(
  '/:id',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  updatePage
);

// Delete page (admin only)
pageRouter.delete(
  '/:id',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  deletePage
);

export default pageRouter;
