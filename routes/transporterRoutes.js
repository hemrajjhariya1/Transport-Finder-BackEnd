import express from 'express';
import multer from 'multer';
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
  bulkImportTransportersController,
} from '../controllers/transporterController.js';
import { requireAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/', getTransporters);
router.get('/search', searchTransportersController);
router.get('/featured', getFeaturedTransporters);
router.get('/popular-routes', getPopularRoutesController);
router.get('/stats', getTransporterStats);
router.post('/bulk-import', requireAdmin, upload.single('file'), bulkImportTransportersController);
router.get('/:id', getTransporterById);
router.post('/', requireAdmin, createTransporterController);
router.put('/:id', requireAdmin, updateTransporterController);
router.delete('/:id', requireAdmin, deleteTransporterController);
router.patch('/:id/featured', requireAdmin, toggleFeatured);

export default router;
