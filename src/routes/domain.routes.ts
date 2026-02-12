import { Router } from "express";
import {
  getDomains,
  getDomainById,
  createDomain,
  updateDomain,
  deleteDomain,
  getAllDomainsForAdmin,
} from "../controllers/domain.controller";
import { uploadDomainThumbnail } from "../middlewares/upload.middleware";
import { authenticateAdmin } from "../middlewares/auth.middleware";

const router = Router();

/* ---------- PUBLIC ---------- */
router.get("/", getDomains);
router.get("/:id", getDomainById);

/* ---------- ADMIN ---------- */
router.get("/admin/all", authenticateAdmin, getAllDomainsForAdmin);

router.post(
  "/",
  authenticateAdmin,
  uploadDomainThumbnail.single("thumbnail"),
  createDomain
);

router.put(
  "/:id",
  authenticateAdmin,
  uploadDomainThumbnail.single("thumbnail"),
  updateDomain
);

router.delete("/:id", authenticateAdmin, deleteDomain);

export default router;