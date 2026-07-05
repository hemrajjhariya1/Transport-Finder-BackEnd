import {
  countCities,
  createCityRecord,
  deleteCityRecord,
  findCities,
  updateCityRecord,
} from '../repositories/cityRepository.js';

function normalizeCity(city) {
  if (!city) return null;
  const id = city.id || city._id?.toString();
  const normalized = { ...city, id };
  delete normalized._id;
  delete normalized.__v;
  return normalized;
}

export async function fetchCities() {
  return (await findCities()).map(normalizeCity);
}

export async function createCity(data) {
  return normalizeCity((await createCityRecord(data)).toObject());
}

export async function updateCityById(id, data) {
  return normalizeCity(await updateCityRecord(id, data));
}

export async function deleteCityById(id) {
  return deleteCityRecord(id);
}

export async function getCityCount() {
  return countCities();
}
