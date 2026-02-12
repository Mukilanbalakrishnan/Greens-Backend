// routes/techStack.routes.ts
import { Router } from "express";
import {
  getTechStack,
  createTechStack,
  updateTechStack,
  deleteTechStack,
  getAllTechStackForAdmin,
  getTechStackById
} from "../controllers/techStack.controller";
import { uploadTechStackImage } from "../middlewares/upload.middleware";
import { authenticateAdmin } from "../middlewares/auth.middleware";

const router = Router();

/* ---------- PUBLIC ROUTES ---------- */
router.get("/", getTechStack); // GET /api/tech-stack - public active tech stack

/* ---------- ADMIN ROUTES ---------- */
router.get("/admin/all", authenticateAdmin, getAllTechStackForAdmin); // GET /api/tech-stack/admin/all
router.get("/:id", authenticateAdmin, getTechStackById); // GET /api/tech-stack/:id
router.post("/", authenticateAdmin, uploadTechStackImage.single("image"), createTechStack);
router.put("/:id", authenticateAdmin, uploadTechStackImage.single("image"), updateTechStack);
router.delete("/:id", authenticateAdmin, deleteTechStack);

export default router;