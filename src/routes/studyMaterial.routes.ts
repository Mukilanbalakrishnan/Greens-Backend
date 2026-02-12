// routes/studyMaterial.routes.ts
import { Router } from "express";
import {
  getStudyMaterials,
  createStudyMaterial,
  updateStudyMaterial,
  deleteStudyMaterial,
  getAllStudyMaterialsForAdmin,
  getStudyMaterialById
} from "../controllers/studyMaterial.controller";
import { uploadStudyMaterial } from "../middlewares/upload.middleware";
import { authenticateAdmin } from "../middlewares/auth.middleware";

const router = Router();

/* ---------- PUBLIC ROUTES ---------- */
router.get("/", getStudyMaterials); // GET /api/study-materials - public active materials

// --- Updated Routes ---

router.get("/admin/all", authenticateAdmin, getAllStudyMaterialsForAdmin);
router.get("/:id", authenticateAdmin, getStudyMaterialById);

// Use .fields to accept both 'file' and 'image' keys from the frontend FormData
router.post(
  "/", 
  authenticateAdmin, 
  uploadStudyMaterial.fields([
    { name: 'file', maxCount: 1 }, 
    { name: 'image', maxCount: 1 }
  ]), 
  createStudyMaterial
);

router.put(
  "/:id", 
  authenticateAdmin, 
  uploadStudyMaterial.fields([
    { name: 'file', maxCount: 1 }, 
    { name: 'image', maxCount: 1 }
  ]), 
  updateStudyMaterial
);

router.delete("/:id", authenticateAdmin, deleteStudyMaterial);
export default router;