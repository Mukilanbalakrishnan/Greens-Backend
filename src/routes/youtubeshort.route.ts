import { Router } from "express";
import {
  getYouTubeShortsVideos,
  getAllYouTubeShortsVideosForAdmin,
  getYouTubeShortsVideoById,
  createYouTubeShortsVideo,
  updateYouTubeShortsVideo,
  deleteYouTubeShortsVideo,
} from "../controllers/youtubeshort.controller";

import { uploadYouTubeShortsThumbnail } from "../middlewares/upload.middleware";
import { authenticateAdmin } from "../middlewares/auth.middleware";

const router = Router();

/* ---------- PUBLIC ---------- */
router.get("/", getYouTubeShortsVideos);

/* ---------- ADMIN ---------- */
router.get("/admin/all", authenticateAdmin, getAllYouTubeShortsVideosForAdmin);
router.get("/:id", authenticateAdmin, getYouTubeShortsVideoById);
router.post(
  "/",
  authenticateAdmin,
  uploadYouTubeShortsThumbnail.single("image"),
  createYouTubeShortsVideo
);
router.put(
  "/:id",
  authenticateAdmin,
  uploadYouTubeShortsThumbnail.single("image"),
  updateYouTubeShortsVideo
);
router.delete("/:id", authenticateAdmin, deleteYouTubeShortsVideo);

export default router;