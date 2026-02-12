import { Router } from "express";
import {
  handleMailActions,
  getAllContacts,
  deleteContact,
} from "../controllers/mail.controller";
import { authenticateAdmin } from "../middlewares/auth.middleware";
import { mailUpload } from "../middlewares/upload.middleware";

const router = Router();

/* =======================
   ADMIN – DASHBOARD
   ======================= */
router.get("/contacts", authenticateAdmin, getAllContacts);
router.delete("/contacts/:id", authenticateAdmin, deleteContact);

/* =======================
   PUBLIC + ADMIN ACTIONS
   ======================= */
router.post(
  "/process",
  mailUpload.single("attachment"), // ✅ REQUIRED
  handleMailActions
);

router.post(
  "/admin",
  authenticateAdmin,
  mailUpload.single("attachment"), // ✅ REQUIRED
  handleMailActions
);

export default router;
