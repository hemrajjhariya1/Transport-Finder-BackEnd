import {
  aggregatePopularRoutes,
  aggregateRouteCount,
  countTransporters,
  createTransporterRecord,
  deleteTransporterRecord,
  findAllTransporters,
  findFeaturedTransporters,
  findRecentTransporters,
  findTransporterById,
  findTransportersByRoute,
  updateTransporterRecord,
} from '../repositories/transporterRepository.js';

function normalizeTransporter(transporter) {
  if (!transporter) return null;
  const id = transporter.id || transporter._id?.toString();
  const normalized = { ...transporter, id };
  delete normalized._id;
  delete normalized.__v;
  return normalized;
}

function normalizeTransporters(transporters) {
  return transporters.map(normalizeTransporter);
}

export async function fetchAllTransporters() {
  return normalizeTransporters(await findAllTransporters());
}

export async function fetchTransporterById(id) {
  return normalizeTransporter(await findTransporterById(id));
}

export async function searchTransporters({ from, to, city }) {
  return normalizeTransporters(await findTransportersByRoute({ from, to, city }));
}

export async function getFeaturedTransporters() {
  return normalizeTransporters(await findFeaturedTransporters());
}

export async function createTransporter(data) {
  return normalizeTransporter((await createTransporterRecord(data)).toObject());
}

export async function updateTransporter(id, data) {
  return normalizeTransporter(await updateTransporterRecord(id, data));
}

export async function deleteTransporter(id) {
  return deleteTransporterRecord(id);
}

export async function updateFeaturedStatus(id, featured) {
  return normalizeTransporter(await updateTransporterRecord(id, { featured }));
}

export async function getPopularRoutes(limit = 6) {
  return aggregatePopularRoutes(limit);
}

export async function getPublicStats() {
  const [totalTransporters, activeListings, routeCountResult] = await Promise.all([
    countTransporters({ verified: true }),
    countTransporters({ status: 'active' }),
    aggregateRouteCount(),
  ]);

  return {
    totalTransporters,
    activeListings,
    routesMatched: routeCountResult[0]?.total || 0,
  };
}

export async function getRecentTransporters(limit = 5) {
  return normalizeTransporters(await findRecentTransporters(limit));
}
