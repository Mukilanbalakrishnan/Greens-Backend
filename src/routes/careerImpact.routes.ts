// routes/careerImpact.routes.ts
import { Router } from "express";
import {
  getCareerImpact,
  createCareerImpact,
  updateCareerImpact,
  deleteCareerImpact,
  getAllCareerImpactsForAdmin,
  getCareerImpactById
} from "../controllers/careerImpact.controller";
import { authenticateAdmin } from "../middlewares/auth.middleware";

const router = Router();

/* ---------- PUBLIC ROUTES ---------- */
router.get("/", getCareerImpact); // GET /api/career-impact - public active career impact

/* ---------- ADMIN ROUTES ---------- */
router.get("/admin/all", authenticateAdmin, getAllCareerImpactsForAdmin); // GET /api/career-impact/admin/all
router.get("/:id", authenticateAdmin, getCareerImpactById); // GET /api/career-impact/:id
router.post("/", authenticateAdmin, createCareerImpact);
router.put("/:id", authenticateAdmin, updateCareerImpact);
router.delete("/:id", authenticateAdmin, deleteCareerImpact);

export default router;