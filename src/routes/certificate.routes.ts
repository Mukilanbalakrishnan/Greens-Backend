// routes/certificate.routes.ts
import { Router } from "express";
import {
  getCertificate,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  getAllCertificatesForAdmin,
  getCertificateById
} from "../controllers/certificate.controller";
import { uploadCertificateImage } from "../middlewares/upload.middleware";
import { authenticateAdmin } from "../middlewares/auth.middleware";

const router = Router();

/* ---------- PUBLIC ROUTES ---------- */
router.get("/", getCertificate); // GET /api/certificates - public active certificate

/* ---------- ADMIN ROUTES ---------- */
router.get("/admin/all", authenticateAdmin, getAllCertificatesForAdmin); // GET /api/certificates/admin/all
router.get("/:id", authenticateAdmin, getCertificateById); // GET /api/certificates/:id
router.post("/", authenticateAdmin, uploadCertificateImage.single("certificateImage"), createCertificate);
router.put("/:id", authenticateAdmin, uploadCertificateImage.single("certificateImage"), updateCertificate);
router.delete("/:id", authenticateAdmin, deleteCertificate);

export default router;