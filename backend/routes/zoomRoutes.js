import express from "express";
import {
    createMeeting,
    getMeetings,
    getMeetingById,
    deleteMeeting,
    getMeetingParticipants,
    getPastMeetingsReport,
    generateSignature,
} from "../controllers/zoomController.js";
import { isAdmin } from '../middlewares/isAdmin.js';
import passport from "passport";
import accessTokenAutoRefresh from "../middlewares/accessTokenAutoRefresh.js";

const router = express.Router();

// Any authenticated user (including students), used for listing classes and
// generating a join-only (role=0) SDK signature.
const auth = [accessTokenAutoRefresh, passport.authenticate("jwt", { session: false })];

// Admin/instructor only: meeting lifecycle + participant data + host URLs + reports.
// Only the admin panel consumes these — students must not reach host start URLs.
const adminOnly = [...auth, isAdmin];

// Admin/instructor only routes
router.post("/meetings", ...adminOnly, createMeeting);
router.delete("/meetings/:id", ...adminOnly, deleteMeeting);
// getMeetingById proxies Zoom API response which includes host start_url
router.get("/meetings/:id", ...adminOnly, getMeetingById);
router.get("/meetings/:id/participants", ...adminOnly, getMeetingParticipants);
router.get("/reports/meetings", ...adminOnly, getPastMeetingsReport);

// Any authenticated user: students list upcoming classes (controller should
// scope students to their enrollments). generateSignature clamps role to 0
// for non-admin/instructor callers so students cannot become hosts.
router.get("/meetings", ...auth, getMeetings);
router.post("/signature", ...auth, generateSignature);

export default router;
