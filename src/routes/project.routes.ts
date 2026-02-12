// routes/project.routes.ts
import { Router } from "express";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  addProjectTech,
  getAllProjectsForAdmin,
  getProjectById
} from "../controllers/project.controller";
import { authenticateAdmin } from "../middlewares/auth.middleware";
import { uploadProjectThumbnail } from "../middlewares/upload.middleware";

const router = Router();

/* ---------- PUBLIC ROUTES ---------- */
router.get("/", getProjects); // GET /api/projects - public active projects

/* ---------- ADMIN ROUTES ---------- */
router.get("/admin/all", authenticateAdmin, getAllProjectsForAdmin); // GET /api/projects/admin/all
router.get("/:id", authenticateAdmin, getProjectById); // GET /api/projects/:id
router.post("/", authenticateAdmin, uploadProjectThumbnail.single("image"), createProject);
router.put("/:id", authenticateAdmin, uploadProjectThumbnail.single("image"), updateProject);
router.delete("/:id", authenticateAdmin, deleteProject);

/* ---------- TECH ROUTES ---------- */
router.post("/tech", authenticateAdmin, addProjectTech);

export default router;