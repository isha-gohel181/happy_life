import express from 'express';
import {
  createBanner,
  getBanners,
  getBanner,
  updateBanner,
  deleteBanner
} from '../controllers/bannerController.js';
import { upload } from '../middlewares/upload-middleware.js';
import accessTokenAutoRefresh from '../middlewares/accessTokenAutoRefresh.js';
import passport from 'passport';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();

// Create banner (admin only)
router.post(
  '/',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  upload.fields([{ name: 'image' }, { name: 'mobileImage' }]),
  createBanner
);

// Get all banners (public — needed for frontend display)
router.get('/', getBanners);

// Get single banner (public)
router.get('/:id', getBanner);

// Update banner (admin only)
router.put(
  '/:id',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  upload.fields([{ name: 'image' }, { name: 'mobileImage' }]),
  updateBanner
);

// Delete banner (admin only)
router.delete(
  '/:id',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  deleteBanner
);

export default router;
