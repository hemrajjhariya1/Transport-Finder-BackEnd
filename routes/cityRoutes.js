import express from 'express';
import {
  getCities,
  addCity,
  updateCity,
  deleteCity,
} from '../controllers/cityController.js';
import { requireAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getCities);
router.post('/', requireAdmin, addCity);
router.put('/:id', requireAdmin, updateCity);
router.delete('/:id', requireAdmin, deleteCity);

export default router;
