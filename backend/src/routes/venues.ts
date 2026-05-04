import { Router, Request, Response } from 'express';
import Venue from '../models/Venue';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const venues = await Venue.find().sort({ createdAt: -1 });
    res.json(venues);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch venues' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) return res.status(404).json({ error: 'Venue not found' });
    res.json(venue);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch venue' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const venue = new Venue(req.body);
    await venue.save();
    res.status(201).json(venue);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create venue', details: err });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const venue = await Venue.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!venue) return res.status(404).json({ error: 'Venue not found' });
    res.json(venue);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update venue', details: err });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const venue = await Venue.findByIdAndDelete(req.params.id);
    if (!venue) return res.status(404).json({ error: 'Venue not found' });
    res.json({ message: 'Venue deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete venue' });
  }
});

export default router;
