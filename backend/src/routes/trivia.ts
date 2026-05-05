import { Router, Request, Response } from 'express';
import Trivia from '../models/Trivia';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const trivia = await Trivia.find().sort({ createdAt: -1 });
    res.json(trivia);
  } catch {
    res.status(500).json({ error: 'Failed to fetch trivia' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const item = new Trivia(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create trivia', details: err });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const item = await Trivia.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ error: 'Trivia not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update trivia', details: err });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const item = await Trivia.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Trivia not found' });
    res.json({ message: 'Trivia deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete trivia' });
  }
});

export default router;
