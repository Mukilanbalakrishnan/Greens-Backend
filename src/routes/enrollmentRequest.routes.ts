import { Router } from "express";
import {
  createEnrollmentRequest,
  getAllEnrollmentRequests,
  deleteEnrollmentRequest,
} from "../controllers/enrollmentRequest.controller";
import { authenticateAdmin } from "../middlewares/auth.middleware";

const router = Router();

/* Frontend */
router.post("/request", createEnrollmentRequest);

/* Admin */
router.get("/", authenticateAdmin, getAllEnrollmentRequests);
router.delete("/:id", authenticateAdmin, deleteEnrollmentRequest);

export default router;
