import { Router } from "express";
import {
  getEnrollCards,
  createEnrollCard,
  updateEnrollCard,
  deleteEnrollCard,
  getAllEnrollCardsForAdmin,
  hardDeleteEnrollCard,
  restoreEnrollCard
} from "../controllers/enrollCard.controller";
import { 
  uploadEnrollCardImage,
  handleUploadError 
} from "../middlewares/upload.middleware";
import { authenticateAdmin } from "../middlewares/auth.middleware";

const router = Router();

// Public route (for frontend)
router.get("/", getEnrollCards);

// Admin routes
router.get("/admin/all", authenticateAdmin, getAllEnrollCardsForAdmin);
router.post(
  "/", 
  authenticateAdmin,
  uploadEnrollCardImage.single("image"),
  handleUploadError,
  createEnrollCard
);
router.put(
  "/:id", 
  authenticateAdmin,
  uploadEnrollCardImage.single("image"),
  handleUploadError,
  updateEnrollCard
);
router.delete("/:id", authenticateAdmin, deleteEnrollCard); // Soft delete
router.delete("/:id/hard", authenticateAdmin, hardDeleteEnrollCard); // Hard delete
router.put("/:id/restore", authenticateAdmin, restoreEnrollCard); // Restore

export default router;