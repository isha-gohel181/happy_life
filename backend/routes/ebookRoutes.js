import express from 'express';
import {
  getEbooks,
  getEbookById,
  createEbook,
  updateEbook,
  deleteEbook,
  ebookCheckoutInit,
  ebookCheckoutVerify,
  getMyBookOrders,
  getAllBookOrders,
  updateDeliveryStatus
} from '../controllers/ebookController.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import passport from 'passport';
import { upload } from '../middlewares/upload-middleware.js';

const router = express.Router();

// Public/App routes
router.get('/', getEbooks);
router.get('/:id', getEbookById);

// Checkout routes
router.post('/checkout/init', passport.authenticate('jwt', { session: false }), ebookCheckoutInit);
router.post('/checkout/verify', passport.authenticate('jwt', { session: false }), ebookCheckoutVerify);

// Order routes
router.get('/orders/my-orders', passport.authenticate('jwt', { session: false }), getMyBookOrders);
router.get('/orders/all', passport.authenticate('jwt', { session: false }), isAdmin, getAllBookOrders);
router.put('/orders/:id/status', passport.authenticate('jwt', { session: false }), isAdmin, updateDeliveryStatus);

// Admin routes
router.post('/', passport.authenticate('jwt', { session: false }), isAdmin, upload.single('coverImage'), createEbook);
router.put('/:id', passport.authenticate('jwt', { session: false }), isAdmin, upload.single('coverImage'), updateEbook);
router.delete('/:id', passport.authenticate('jwt', { session: false }), isAdmin, deleteEbook);

export default router;
