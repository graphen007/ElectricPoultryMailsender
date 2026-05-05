import { Router, Request, Response } from 'express';
import User from '../models/User';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

// GET /api/users  — list all users
router.get('/', async (_req: Request, res: Response) => {
  const users = await User.find().select('-password').sort({ createdAt: 1 });
  res.json(users);
});

// POST /api/users  — create user
router.post('/', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Username and password required' });
  try {
    const user = await User.create({ username, password });
    res.status(201).json({ _id: user._id, username: user.username, createdAt: user.createdAt });
  } catch (err: any) {
    if (err.code === 11000)
      return res.status(409).json({ error: 'Username already taken' });
    res.status(400).json({ error: 'Failed to create user' });
  }
});

// PUT /api/users/:id/password  — change password
router.put('/:id/password', async (req: Request, res: Response) => {
  const { password } = req.body;
  if (!password)
    return res.status(400).json({ error: 'Password required' });
  const user = await User.findByIdAndUpdate(req.params.id, { password }, { new: true });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ message: 'Password updated' });
});

// DELETE /api/users/:id
router.delete('/:id', async (req: Request, res: Response) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});

export default router;
