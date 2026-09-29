import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import Note from '../models/Note';
import Venue from '../models/Venue';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 }).populate('venue', 'name');
    res.json(notes);
  } catch {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';
    const content = typeof req.body.content === 'string' ? req.body.content : '';
    const venue = typeof req.body.venue === 'string' ? req.body.venue.trim() : '';

    if (!title) return res.status(400).json({ error: 'Note title is required' });
    if (venue) {
      if (!mongoose.isValidObjectId(venue)) return res.status(400).json({ error: 'Invalid venue' });
      if (!await Venue.exists({ _id: venue })) return res.status(404).json({ error: 'Venue not found' });
    }

    const note = await Note.create({ title, content, ...(venue ? { venue } : {}) });
    await note.populate('venue', 'name');
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create note', details: err });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';
    const content = typeof req.body.content === 'string' ? req.body.content : '';
    const venue = typeof req.body.venue === 'string' ? req.body.venue.trim() : '';

    if (!title) return res.status(400).json({ error: 'Note title is required' });
    if (venue) {
      if (!mongoose.isValidObjectId(venue)) return res.status(400).json({ error: 'Invalid venue' });
      if (!await Venue.exists({ _id: venue })) return res.status(404).json({ error: 'Venue not found' });
    }

    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content, venue: venue || undefined },
      { new: true, runValidators: true }
    ).populate('venue', 'name');
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update note', details: err });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json({ message: 'Note deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

export default router;
