import { Router } from 'express';
import { 
  getActiveNotices, 
  getAllNotices, 
  createNotice, 
  updateNotice, 
  deleteNotice 
} from '../controllers/notice.controller';
import { authenticateAdmin } from "../middlewares/auth.middleware";

const router = Router();

// Frontend Marquee Route
router.get('/', getActiveNotices);

// Admin Routes
router.get('/admin', authenticateAdmin, getAllNotices);
router.post('/', authenticateAdmin, createNotice);
router.put('/:id', authenticateAdmin, updateNotice);
router.delete('/:id', authenticateAdmin, deleteNotice);

export default router;