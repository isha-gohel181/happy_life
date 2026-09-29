import express from "express";
import { upload } from "../middlewares/upload-middleware.js";
import passport from "passport";
import accessTokenAutoRefresh from "../middlewares/accessTokenAutoRefresh.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import {
  submitFeedback,
  getMyFeedback,
  getAllFeedbacks
} from "../controllers/CourseFeedbackController.js";

const router = express.Router();

// Submit or edit feedback
router.post(
  "/submit",
  accessTokenAutoRefresh,
  passport.authenticate("jwt", { session: false }),
  upload.single("attachment"),
  submitFeedback
);

// Get my feedback for a specific course
router.get(
  "/my/:courseId",
  accessTokenAutoRefresh,
  passport.authenticate("jwt", { session: false }),
  getMyFeedback
);

// Get all feedbacks (Admin only)
router.get(
  "/admin/all",
  accessTokenAutoRefresh,
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  getAllFeedbacks
);

export default router;
