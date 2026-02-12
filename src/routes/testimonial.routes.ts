// routes/testimonial.routes.ts
import { Router } from "express";
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getAllTestimonialsForAdmin,
  getTestimonialById
} from "../controllers/testimonial.controller";
import { uploadTestimonialImage } from "../middlewares/upload.middleware";
import { authenticateAdmin } from "../middlewares/auth.middleware";

const router = Router();

/* ---------- PUBLIC ROUTES ---------- */
router.get("/", getTestimonials); // GET /api/testimonials - public active testimonials

/* ---------- ADMIN ROUTES ---------- */
router.get("/admin/all", authenticateAdmin, getAllTestimonialsForAdmin); // GET /api/testimonials/admin/all
router.get("/:id", authenticateAdmin, getTestimonialById); // GET /api/testimonials/:id
router.post("/", authenticateAdmin, uploadTestimonialImage.single("image"), createTestimonial);
router.put("/:id", authenticateAdmin, uploadTestimonialImage.single("image"), updateTestimonial);
router.delete("/:id", authenticateAdmin, deleteTestimonial);

export default router;