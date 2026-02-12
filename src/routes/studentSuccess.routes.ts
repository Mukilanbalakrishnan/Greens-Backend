import { Router } from "express";
import {
  getStudentSuccess,
  createStudentSuccess,
  updateStudentSuccess,
  deleteStudentSuccess,
  getAllStudentSuccessForAdmin,
  getStudentSuccessById,
  updateSortOrder
} from "../controllers/studentSuccess.controller";
import { authenticateAdmin } from "../middlewares/auth.middleware";
import { uploadStudentSuccessImage } from "../middlewares/upload.middleware";

const router = Router();

/* ---------- PUBLIC ROUTES ---------- */
router.get("/", getStudentSuccess); // GET /api/student-success - public active stories

/* ---------- ADMIN ROUTES ---------- */
router.get("/admin/all", authenticateAdmin, getAllStudentSuccessForAdmin); // GET /api/student-success/admin/all
router.get("/:id", authenticateAdmin, getStudentSuccessById); // GET /api/student-success/:id

router.post(
  "/",
  authenticateAdmin,
  uploadStudentSuccessImage.single("image"),
  createStudentSuccess
);

router.put(
  "/:id",
  authenticateAdmin,
  uploadStudentSuccessImage.single("image"),
  updateStudentSuccess
);

router.delete("/:id", authenticateAdmin, deleteStudentSuccess);
router.put("/sort/update", authenticateAdmin, updateSortOrder); // Bulk sort order update

export default router;