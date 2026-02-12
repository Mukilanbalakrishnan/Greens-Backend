import { Router } from "express";
import {
  getHeroData,
  createHero,
  updateHero,
  deleteHero,
  getAllHeroesForAdmin,
  getHeroByIdForAdmin
} from "../controllers/hero.controller";
import { uploadHeroImages } from "../middlewares/upload.middleware";
import { authenticateAdmin } from "../middlewares/auth.middleware";
const router = Router();

/* ---------- PUBLIC ---------- */
router.get("/", getHeroData);

/* ---------- ADMIN ROUTES ---------- */
router.get("/all", authenticateAdmin, getAllHeroesForAdmin); // GET /api/hero/all
router.get("/:id", authenticateAdmin, getHeroByIdForAdmin); // GET /api/hero/:id
router.post("/", authenticateAdmin, uploadHeroImages.array("images", 5), createHero); // POST /api/hero/
router.put("/:id", authenticateAdmin, uploadHeroImages.array("images", 5), updateHero); // PUT /api/hero/:id
router.delete("/:id", authenticateAdmin, deleteHero); // DELETE /api/hero/:id

export default router;
