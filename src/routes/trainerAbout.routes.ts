import { Router } from "express";
import {
  getTrainerAbout,
  createTrainerAbout,
  updateTrainerAbout,
  deleteTrainerAbout,
  getAllTrainerAboutsForAdmin,
  getTrainerAboutById,
  // REMOVED: updateSortOrder
} from "../controllers/trainerAbout.controller";
import { authenticateAdmin } from "../middlewares/auth.middleware";
import { uploadTrainerAboutImages } from "../middlewares/upload.middleware";

const router = Router();

/* ---------- PUBLIC ROUTES ---------- */
router.get("/", getTrainerAbout); // GET /api/trainer-about - public active section

/* ---------- ADMIN ROUTES ---------- */
router.get("/admin/all", authenticateAdmin, getAllTrainerAboutsForAdmin); // GET /api/trainer-about/admin/all
router.get("/:id", authenticateAdmin, getTrainerAboutById); // GET /api/trainer-about/:id

router.post(
  "/",
  authenticateAdmin,
  uploadTrainerAboutImages.fields([{ name: "mainImage", maxCount: 1 }]),
  createTrainerAbout
);

router.put(
  "/:id",
  authenticateAdmin,
  uploadTrainerAboutImages.fields([{ name: "mainImage", maxCount: 1 }]),
  updateTrainerAbout
);
router.delete("/:id", authenticateAdmin, deleteTrainerAbout);

// REMOVED: sort order update route
// router.put("/sort/update", authenticateAdmin, updateSortOrder);

export default router;