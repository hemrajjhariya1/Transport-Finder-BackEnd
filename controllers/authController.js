import { loginAdmin, verifyToken } from '../services/authService.js';

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

export function me(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Admin authorization required.' });
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload || payload.role !== 'admin') {
    return res.status(403).json({ error: 'Invalid admin token.' });
  }

  res.json({ valid: true, admin: { username: payload.username } });
}
