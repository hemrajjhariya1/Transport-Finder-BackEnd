import {
  fetchCities,
  createCity,
  updateCityById,
  deleteCityById,
} from '../services/cityService.js';

export async function getCities(req, res, next) {
  try {
    const cities = await fetchCities();
    res.json(cities);
  } catch (error) {
    next(error);
  }
}

export async function addCity(req, res, next) {
  try {
    const city = await createCity(req.body);
    res.status(201).json(city);
  } catch (error) {
    next(error);
  }
}

export async function updateCity(req, res, next) {
  try {
    const city = await updateCityById(req.params.id, req.body);
    if (!city) {
      return res.status(404).json({ error: 'City not found.' });
    }
    res.json(city);
  } catch (error) {
    next(error);
  }
}

export async function deleteCity(req, res, next) {
  try {
    const deleted = await deleteCityById(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'City not found.' });
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
