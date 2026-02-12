import { Router } from "express";
import {
  getFaqByStep,
  createFaqBulk,
  getAllFaqs,
  updateFaq,
  deleteFaq,
} from "../controllers/faq.controller";

const router = Router();

/* ---------- CHATBOT ---------- */
router.get("/", getFaqByStep); // /api/faq-chat?step=0

/* ---------- ADMIN ---------- */
router.post("/bulk", createFaqBulk); // 👈 ARRAY CREATE
router.get("/admin/all", getAllFaqs);
router.put("/:id", updateFaq);
router.delete("/:id", deleteFaq);

export default router;
