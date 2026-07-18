import mongoose from 'mongoose';
import Transporter from '../models/Transporter.js';

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export function findAllTransporters() {
  return Transporter.find().sort({ companyName: 1 }).lean();
}

export function findTransporterById(id) {
  if (!isValidObjectId(id)) return null;
  return Transporter.findById(id).lean();
}

export function findFeaturedTransporters(limit = 6) {
  return Transporter.find().sort({ featured: -1, createdAt: -1 }).limit(limit).lean();
}

export function findTransportersByRoute({ from, to, city }) {
  const filters = {};

  if (city) {
    filters.city = new RegExp(`^${escapeRegex(city.trim())}$`, 'i');
  }

  if (from || to) {
    const elemMatch = {};
    if (from) elemMatch.from = new RegExp(`^${escapeRegex(from.trim())}$`, 'i');
    if (to) elemMatch.to = new RegExp(`^${escapeRegex(to.trim())}$`, 'i');
    filters.routes = { $elemMatch: elemMatch };
  }

  return Transporter.find(filters).sort({ featured: -1, verified: -1, rating: -1 }).lean();
}

export function createTransporterRecord(data) {
  return Transporter.create(data);
}

export function findTransporterByPhone(phone) {
  if (!phone) return null;

  const tokens = String(phone)
    .split(',')
    .map((part) => part.replace(/\D/g, '').trim())
    .filter(Boolean);

  if (!tokens.length) return null;

  return Transporter.findOne({
    $or: tokens.map((token) => ({ phone: { $regex: new RegExp(`(^|,)${escapeRegex(token)}(,|$)`) } })),
  }).lean();
}

export function updateTransporterRecord(id, data) {
  if (!isValidObjectId(id)) return null;
  return Transporter.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
}

export async function deleteTransporterRecord(id) {
  if (!isValidObjectId(id)) return false;
  const deleted = await Transporter.findByIdAndDelete(id).lean();
  return Boolean(deleted);
}

export function countTransporters(filter = {}) {
  return Transporter.countDocuments(filter);
}

export function findRecentTransporters(limit = 5) {
  return Transporter.find().sort({ createdAt: -1 }).limit(limit).lean();
}

export function aggregatePopularRoutes(limit = 6) {
  return Transporter.aggregate([
    { $unwind: '$routes' },
    {
      $group: {
        _id: { from: '$routes.from', to: '$routes.to' },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1, '_id.from': 1, '_id.to': 1 } },
    { $limit: limit },
    {
      $project: {
        _id: 0,
        from: '$_id.from',
        to: '$_id.to',
        count: 1,
      },
    },
  ]);
}

export function aggregateRouteCount() {
  return Transporter.aggregate([
    { $unwind: '$routes' },
    {
      $group: {
        _id: {
          from: { $toLower: '$routes.from' },
          to: { $toLower: '$routes.to' },
        },
      },
    },
    { $count: 'total' },
  ]);
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
