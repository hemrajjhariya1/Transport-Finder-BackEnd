import mongoose from 'mongoose';
import City from '../models/City.js';

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export function findCities(query = {}) {
  return City.find(query).sort({ name: 1 }).lean();
}

export function createCityRecord(data) {
  return City.create(data);
}

export function updateCityRecord(id, data) {
  if (!isValidObjectId(id)) return null;
  return City.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
}

export async function deleteCityRecord(id) {
  if (!isValidObjectId(id)) return false;
  const deleted = await City.findByIdAndDelete(id).lean();
  return Boolean(deleted);
}

export function countCities(filter = {}) {
  return City.countDocuments(filter);
}
