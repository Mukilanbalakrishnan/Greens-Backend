// routes/about.routes.js
import { Router } from "express";
import {
  getAboutData,
  createAbout,
  updateAbout,
  deleteAbout,
  getAllAbouts
} from "../controllers/about.controller";
import { authenticateAdmin } from "../middlewares/auth.middleware";
import { uploadAboutImages } from "../middlewares/upload.middleware";

const router = Router();

/* ---------- PUBLIC ---------- */
router.get("/", getAboutData); // GET /api/about?domainId=1&courseId=0

/* ---------- ADMIN ---------- */
router.get("/all", authenticateAdmin, getAllAbouts); // GET /api/about/all
router.post(
  "/",
  authenticateAdmin,
  uploadAboutImages.fields([
    { name: "mainImages", maxCount: 5 },
    { name: "smallImages", maxCount: 5 },
  ]),
  createAbout
);

router.put(
  "/:id",
  authenticateAdmin,
  uploadAboutImages.fields([
    { name: "mainImages", maxCount: 5 },
    { name: "smallImages", maxCount: 5 },
  ]),
  updateAbout
);

router.delete("/:id", authenticateAdmin, deleteAbout);

export default router;