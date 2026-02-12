import { Router } from "express";
import {
  getModules,
  getAllModulesForAdmin,
  getModuleById,
  createModule,
  updateModule,
  deleteModule,
  getAllTopicsForAdmin,
  addModuleTopic,
  updateModuleTopic,
  deleteModuleTopic,
  updateModuleOrders
} from "../controllers/module.controller";
import { authenticateAdmin } from "../middlewares/auth.middleware";

const router = Router();

/* ---------- PUBLIC ROUTES ---------- */
router.get("/", getModules); // GET /api/modules?domainId=1&courseId=2

/* ---------- ADMIN ROUTES ---------- */
router.get("/admin/all", authenticateAdmin, getAllModulesForAdmin); // GET /api/modules/admin/all
router.get("/admin/topics", authenticateAdmin, getAllTopicsForAdmin); // GET /api/modules/admin/topics
router.get("/:id", authenticateAdmin, getModuleById); // GET /api/modules/:id

router.post("/", authenticateAdmin, createModule); // POST /api/modules
router.put("/:id", authenticateAdmin, updateModule); // PUT /api/modules/:id
router.delete("/:id", authenticateAdmin, deleteModule); // DELETE /api/modules/:id

// Topic Routes
router.post("/topic", authenticateAdmin, addModuleTopic); // POST /api/modules/topic
router.put("/topic/:id", authenticateAdmin, updateModuleTopic); // PUT /api/modules/topic/:id
router.delete("/topic/:id", authenticateAdmin, deleteModuleTopic); // DELETE /api/modules/topic/:id

// Order Management
router.put("/orders/update", authenticateAdmin, updateModuleOrders); // PUT /api/modules/orders/update

export default router;