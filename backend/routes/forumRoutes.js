import express from 'express';
import {
  createThread,
  getAllThreads,
  getThreadById,
  updateThread,
  deleteThread,
  pinThread,
  likeThread,
  createReply,
  getReplies,
  getAllTags,
  filterThreadsByTags,
  updateReply,
  deleteReply,
  likeReply,
  searchThreads,
  getAllThreadsWithReplies,
  approveThread,
  updateThreadOpenSource,
  getThreadByIdAdmin,
  getMyThreads
} from '../controllers/forumController.js';
import accessTokenAutoRefresh from '../middlewares/accessTokenAutoRefresh.js';
import passport from 'passport';
import { isAdmin } from '../middlewares/isAdmin.js';
import { upload } from '../middlewares/upload-middleware.js';
import isUserBanned from '../middlewares/isUserBanned.js';

const forumRouter = express.Router();

// Get all threads created by the authenticated user
forumRouter.get(
  '/my-threads',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  getMyThreads
);


forumRouter.get('/all-threads-with-replies', (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (user) req.user = user; // Attach user details if authenticated
    next(); // Proceed regardless of authentication status
  })(req, res, next);
}, getAllThreadsWithReplies);


// Thread routes
forumRouter.post(
  '/create',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  isUserBanned,
  upload.any(),
  createThread
);
forumRouter.get('/tags', accessTokenAutoRefresh, passport.authenticate('jwt', { session: false }), getAllTags);
forumRouter.get('/filter/tags', accessTokenAutoRefresh, passport.authenticate('jwt', { session: false }), filterThreadsByTags);
forumRouter.get('/thread/:id', accessTokenAutoRefresh, passport.authenticate('jwt', { session: false }), getThreadById);
forumRouter.get('/search/:courseId', accessTokenAutoRefresh, passport.authenticate('jwt', { session: false }), searchThreads);
forumRouter.get('/:courseId', accessTokenAutoRefresh, passport.authenticate('jwt', { session: false }), getAllThreads);
// Admin-only: get thread by ID
forumRouter.get(
  "/admin/thread/:id",
  accessTokenAutoRefresh,
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  getThreadByIdAdmin
);

// Update thread
forumRouter.put(
  '/thread/:id',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  isUserBanned,
  upload.any(),
  updateThread
);

forumRouter.put(
  '/thread/:id/open-source',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  updateThreadOpenSource
);

//   accessTokenAutoRefresh,
//   passport.authenticate('jwt', { session: false }),
//   isUserBanned,
//   upload.any(),
//   updateThread
// );

forumRouter.delete(
  '/thread/:id',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  isUserBanned,
  deleteThread
);

forumRouter.post(
  '/thread/:id/pin',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  isUserBanned,
  isAdmin,
  pinThread
);

forumRouter.post(
  '/thread/:id/like',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  isUserBanned,
  likeThread
);

forumRouter.patch(
  '/thread/:id/approve',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  isUserBanned,
  isAdmin,
  approveThread
);

// Reply routes
forumRouter.post(
  '/:id/reply',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  isUserBanned,
  upload.any(),
  createReply
);

forumRouter.get('/thread/:id/replies', accessTokenAutoRefresh, passport.authenticate('jwt', { session: false }), getReplies);

forumRouter.put(
  '/reply/:id',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  isUserBanned,
  upload.any(),
  updateReply
);

forumRouter.delete(
  '/reply/:id',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  isUserBanned,
  deleteReply
);

forumRouter.post(
  '/reply/:id/like',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  isUserBanned,
  likeReply
);

export default forumRouter;