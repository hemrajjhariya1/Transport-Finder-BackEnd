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
  findTransporterByPhone,
  findTransportersByRoute,
  updateTransporterRecord,
} from '../repositories/transporterRepository.js';
import { buildTransporterPayload } from '../utils/transporterImport.js';

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

function normalizePhone(value) {
  return String(value ?? '')
    .split(',')
    .map((part) => part.replace(/\D/g, '').trim())
    .filter(Boolean)
    .join(',');
}

function normalizePayload(data) {
  const phone = normalizePhone(data.phone || data.mobile || data.phoneNumber || '');
  const whatsapp = normalizePhone(data.whatsapp || data.whatsApp || data.whatsappNumber || phone);

  return {
    ...data,
    phone,
    whatsapp,
  };
}

export async function createTransporter(data, { allowDuplicatePhone = false } = {}) {
  const payload = normalizePayload(data);

  if (payload.phone && !allowDuplicatePhone) {
    const existingTransporter = await findTransporterByPhone(payload.phone);
    if (existingTransporter) {
      const error = new Error('Mobile number already exists. Choose to add again if you want to proceed.');
      error.statusCode = 409;
      throw error;
    }
  }

  return normalizeTransporter((await createTransporterRecord(payload)).toObject());
}

export async function bulkCreateTransporters(rows = []) {
  const created = [];
  const duplicates = [];
  const seenPhones = new Set();

  for (const [index, row] of rows.entries()) {
    const payload = buildTransporterPayload(row);
    const phone = payload.phone;
    const phoneTokens = String(phone || '')
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean);
    const duplicatePhone = Boolean(
      phoneTokens.length &&
        (phoneTokens.some((token) => seenPhones.has(token)) || (await Promise.all(phoneTokens.map((token) => findTransporterByPhone(token)))).some(Boolean))
    );

    if (duplicatePhone) {
      duplicates.push({
        rowNumber: index + 2,
        companyName: payload.companyName || `Row ${index + 2}`,
        phone,
      });
      continue;
    }

    if (phone) {
      phoneTokens.forEach((token) => seenPhones.add(token));
    }

    const createdTransporter = await createTransporter(payload, { allowDuplicatePhone: true });
    created.push(createdTransporter);
  }

  return {
    createdCount: created.length,
    duplicateCount: duplicates.length,
    created,
    duplicates,
  };
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
