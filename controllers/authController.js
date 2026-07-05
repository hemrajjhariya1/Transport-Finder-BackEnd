import { loginAdmin } from '../services/authService.js';

export async function login(req, res, next) {
  try {
    const username = req.body.username || req.body.email;
    const { password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const result = await loginAdmin(username, password);
    if (!result) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
}
