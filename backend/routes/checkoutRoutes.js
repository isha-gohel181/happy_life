import express from 'express';
import { checkout, getMyEnrollments, buyNow, getMyPurchases, checkOrder, importStudents, checkCoupon } from '../controllers/checkoutController.js';
import accessTokenAutoRefresh from '../middlewares/accessTokenAutoRefresh.js';
import passport from 'passport';
import isUserBanned from '../middlewares/isUserBanned.js';
import { upload } from '../middlewares/upload-middleware.js';

import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();
router.post('/', accessTokenAutoRefresh, passport.authenticate('jwt', { session: false }), checkout);
// router.post('/webhook', webhookHandler); // Uncomment if you have a webhook handler
// router.get('/success', successHandler); // Uncomment if you have a success handler
// router.get('/cancel', cancelHandler); // Uncomment if you have a cancel handler
//getMyEnrollments
router.get('/my-enrollments', accessTokenAutoRefresh, passport.authenticate('jwt', { session: false }), isUserBanned, getMyEnrollments); // Uncomment if you have a handler for getting user enrollments
router.get('/my-purchases', accessTokenAutoRefresh, passport.authenticate('jwt', { session: false }), isUserBanned, getMyPurchases); // Uncomment if you have a handler for getting user enrollments

// Buy Now (guest checkout) route
router.post('/buy-now', buyNow);
router.post('/check-order', checkOrder);
router.post('/validate-coupon', checkCoupon);
router.post('/import-students', accessTokenAutoRefresh, passport.authenticate('jwt', { session: false }), isAdmin, upload.single('file'), importStudents);



export default router;