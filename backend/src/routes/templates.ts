import { Router, Request, Response } from 'express';
import Template from '../models/Template';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  const templates = await Template.find().sort({ language: 1, name: 1 });
  res.json(templates);
});

router.get('/:id', async (req: Request, res: Response) => {
  const t = await Template.findById(req.params.id);
  if (!t) return res.status(404).json({ error: 'Template not found' });
  res.json(t);
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const t = await Template.create(req.body);
    res.status(201).json(t);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const t = await Template.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!t) return res.status(404).json({ error: 'Template not found' });
    res.json(t);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  await Template.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

export default router;
