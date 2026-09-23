import express from "express";
import {
  createFile,
  getFiles,
  getFileById,
  updateFile,
  deleteFile,
} from "../controllers/fileController.js";
import { upload } from "../middlewares/upload-middleware.js";
import { isAdmin } from '../middlewares/isAdmin.js';
import accessTokenAutoRefresh from "../middlewares/accessTokenAutoRefresh.js";
import passport from "passport";

const fileRouter = express.Router();

// CRUD Routes
fileRouter.post("/", accessTokenAutoRefresh, passport.authenticate('jwt', { session: false }), isAdmin, upload.single("file"), createFile); // Create
fileRouter.get("/", getFiles); // Read all
fileRouter.get("/:id", getFileById); // Read one
fileRouter.put("/:id", accessTokenAutoRefresh, passport.authenticate('jwt', { session: false }), isAdmin, upload.any(), updateFile); // Update
fileRouter.delete("/:id", accessTokenAutoRefresh, passport.authenticate('jwt', { session: false }), isAdmin, deleteFile); // Delete

export default fileRouter;
