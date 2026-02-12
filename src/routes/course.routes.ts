// routes/course.routes.ts
import { Router } from "express";
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCoursesForAdmin
} from "../controllers/course.controller";
import { uploadCourseImage } from "../middlewares/upload.middleware";
import { authenticateAdmin } from "../middlewares/auth.middleware";

const router = Router();

/* ---------- PUBLIC ROUTES ---------- */
router.get("/", getCourses); // GET /api/courses - public active courses

/* ---------- ADMIN ROUTES ---------- */
router.get("/admin/all", authenticateAdmin, getAllCoursesForAdmin); // GET /api/courses/admin/all
router.post("/", authenticateAdmin, uploadCourseImage.single("image"), createCourse);
router.put("/:id", authenticateAdmin, uploadCourseImage.single("image"), updateCourse);
router.delete("/:id", authenticateAdmin, deleteCourse);

export default router;