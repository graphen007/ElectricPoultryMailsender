import { Router, Request, Response } from 'express';
import Gig from '../models/Gig';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const gigs = await Gig.find().sort({ date: 1 });
    res.json(gigs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch gigs' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ error: 'Gig not found' });
    res.json(gig);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch gig' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const gig = new Gig(req.body);
    await gig.save();
    res.status(201).json(gig);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create gig', details: err });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const gig = await Gig.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!gig) return res.status(404).json({ error: 'Gig not found' });
    res.json(gig);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update gig', details: err });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const gig = await Gig.findByIdAndDelete(req.params.id);
    if (!gig) return res.status(404).json({ error: 'Gig not found' });
    res.json({ message: 'Gig deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete gig' });
  }
});

export default router;
