// routes/videoTestimonial.routes.ts
import { Router } from "express";
import {
  getVideoTestimonials,
  createVideoTestimonial,
  updateVideoTestimonial,
  deleteVideoTestimonial,
  getAllVideoTestimonialsForAdmin,
  getVideoTestimonialById
} from "../controllers/videoTestimonial.controller";
import { uploadVideoThumbnailImage } from "../middlewares/upload.middleware";
import { authenticateAdmin } from "../middlewares/auth.middleware";

const router = Router();

/* ---------- PUBLIC ROUTES ---------- */
router.get("/", getVideoTestimonials); // GET /api/video-testimonials - public active video testimonials

/* ---------- ADMIN ROUTES ---------- */
router.get("/admin/all", authenticateAdmin, getAllVideoTestimonialsForAdmin); // GET /api/video-testimonials/admin/all
router.get("/:id", authenticateAdmin, getVideoTestimonialById); // GET /api/video-testimonials/:id
router.post("/", authenticateAdmin, uploadVideoThumbnailImage.single("image"), createVideoTestimonial);
router.put("/:id", authenticateAdmin, uploadVideoThumbnailImage.single("image"), updateVideoTestimonial);
router.delete("/:id", authenticateAdmin, deleteVideoTestimonial);

export default router;