import { countTransporters } from '../repositories/transporterRepository.js';
import { countCities } from '../repositories/cityRepository.js';
import { getRecentTransporters } from './transporterService.js';

export async function getAdminStats() {
  const [totalTransporters, activeListings, totalCities, recentAdded] = await Promise.all([
    countTransporters(),
    countTransporters({ status: 'active' }),
    countCities(),
    getRecentTransporters(5),
  ]);

  return {
    totalTransporters,
    activeListings,
    totalCities,
    recentAdded,
  };
}
