import express from 'express';
import {
  getTransporters,
  searchTransportersController,
  getTransporterById,
  createTransporterController,
  updateTransporterController,
  deleteTransporterController,
  toggleFeatured,
  getFeaturedTransporters,
  getPopularRoutesController,
  getTransporterStats,
} from '../controllers/transporterController.js';
import { requireAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getTransporters);
router.get('/search', searchTransportersController);
router.get('/featured', getFeaturedTransporters);
router.get('/popular-routes', getPopularRoutesController);
router.get('/stats', getTransporterStats);
router.get('/:id', getTransporterById);
router.post('/', requireAdmin, createTransporterController);
router.put('/:id', requireAdmin, updateTransporterController);
router.delete('/:id', requireAdmin, deleteTransporterController);
router.patch('/:id/featured', requireAdmin, toggleFeatured);

export default router;
