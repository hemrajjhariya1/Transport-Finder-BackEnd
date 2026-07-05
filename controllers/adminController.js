import { getAdminStats } from '../services/adminService.js';

export async function getDashboardStats(req, res, next) {
  try {
    const stats = await getAdminStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
}
