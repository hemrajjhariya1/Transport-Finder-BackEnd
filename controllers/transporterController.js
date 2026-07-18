import XLSX from 'xlsx';
import {
  bulkCreateTransporters,
  fetchAllTransporters,
  fetchTransporterById,
  searchTransporters,
  createTransporter,
  updateTransporter,
  deleteTransporter,
  getPopularRoutes,
  getPublicStats,
  updateFeaturedStatus,
  getFeaturedTransporters as fetchFeaturedTransporters,
} from '../services/transporterService.js';

export async function getTransporters(req, res, next) {
  try {
    const transporters = await fetchAllTransporters();
    res.json(transporters);
  } catch (error) {
    next(error);
  }
}

export async function getFeaturedTransporters(req, res, next) {
  try {
    const transporters = await fetchFeaturedTransporters();
    res.json(transporters);
  } catch (error) {
    next(error);
  }
}

export async function getTransporterStats(req, res, next) {
  try {
    const stats = await getPublicStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
}

export async function getPopularRoutesController(req, res, next) {
  try {
    const routes = await getPopularRoutes(Number(req.query.limit) || 6);
    res.json(routes);
  } catch (error) {
    next(error);
  }
}

export async function searchTransportersController(req, res, next) {
  try {
    const { from, to, city } = req.query;
    const results = await searchTransporters({ from, to, city });
    res.json(results);
  } catch (error) {
    next(error);
  }
}

export async function getTransporterById(req, res, next) {
  try {
    const transporter = await fetchTransporterById(req.params.id);
    if (!transporter) {
      return res.status(404).json({ error: 'Transporter not found.' });
    }
    res.json(transporter);
  } catch (error) {
    next(error);
  }
}

export async function createTransporterController(req, res, next) {
  try {
    const transporter = await createTransporter(req.body, {
      allowDuplicatePhone: Boolean(req.body.allowDuplicatePhone),
    });
    res.status(201).json(transporter);
  } catch (error) {
    next(error);
  }
}

export async function bulkImportTransportersController(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a transporter file.' });
    }

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });
    const result = await bulkCreateTransporters(rows);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function updateTransporterController(req, res, next) {
  try {
    const transporter = await updateTransporter(req.params.id, req.body);
    if (!transporter) {
      return res.status(404).json({ error: 'Transporter not found.' });
    }
    res.json(transporter);
  } catch (error) {
    next(error);
  }
}

export async function deleteTransporterController(req, res, next) {
  try {
    const deleted = await deleteTransporter(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Transporter not found.' });
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

export async function toggleFeatured(req, res, next) {
  try {
    const updated = await updateFeaturedStatus(req.params.id, req.body.featured);
    if (!updated) {
      return res.status(404).json({ error: 'Transporter not found.' });
    }
    res.json(updated);
  } catch (error) {
    next(error);
  }
}
