import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'electric-poultry-secret';

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Username and password required' });

  const user = await User.findOne({ username });
  if (!user || user.password !== password)
    return res.status(401).json({ error: 'Invalid username or password' });

  const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, {
    expiresIn: '7d',
  });
  res.json({ token, username: user.username });
});

// GET /api/auth/me  — validate token, return user info
router.get('/me', async (req: Request, res: Response) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer '))
    return res.status(401).json({ error: 'No token' });
  try {
    const payload = jwt.verify(auth.slice(7), JWT_SECRET) as { userId: string; username: string };
    res.json({ username: payload.username });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
