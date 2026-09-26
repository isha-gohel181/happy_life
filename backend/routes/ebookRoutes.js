import express from 'express';
import {
  getEbooks,
  getEbookById,
  createEbook,
  updateEbook,
  deleteEbook,
  ebookCheckoutInit,
  ebookCheckoutVerify
} from '../controllers/ebookController.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import passport from 'passport';

const router = express.Router();

// Public/App routes
router.get('/', getEbooks);
router.get('/:id', getEbookById);

// Checkout routes
router.post('/checkout/init', passport.authenticate('jwt', { session: false }), ebookCheckoutInit);
router.post('/checkout/verify', passport.authenticate('jwt', { session: false }), ebookCheckoutVerify);

// Admin routes
router.post('/', passport.authenticate('jwt', { session: false }), isAdmin, createEbook);
router.put('/:id', passport.authenticate('jwt', { session: false }), isAdmin, updateEbook);
router.delete('/:id', passport.authenticate('jwt', { session: false }), isAdmin, deleteEbook);

export default router;
