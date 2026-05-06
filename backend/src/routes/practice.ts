import { Router, Request, Response } from 'express';
import Practice from '../models/Practice';
import PracticeDay from '../models/PracticeDay';

const router = Router();

// GET /api/practice?year=2026&month=5  — all availability for a given month (or all)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { year, month } = req.query;
    let filter: Record<string, unknown> = {};

    if (year && month) {
      const y = parseInt(year as string, 10);
      const m = parseInt(month as string, 10) - 1;
      const from = new Date(y, m, 1);
      const to = new Date(y, m + 1, 0, 23, 59, 59, 999);
      filter = { date: { $gte: from, $lte: to } };
    }

    const entries = await Practice.find(filter).sort({ date: 1 });
    res.json(entries);
  } catch {
    res.status(500).json({ error: 'Failed to fetch practice availability' });
  }
});

// POST /api/practice/toggle  — toggle the current user's availability for a date
router.post('/toggle', async (req: Request, res: Response) => {
  try {
    const { date } = req.body;
    if (!date) return res.status(400).json({ error: 'date is required' });

    const { userId, username } = req.user!;

    const day = new Date(date);
    day.setUTCHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setUTCHours(23, 59, 59, 999);

    const existing = await Practice.findOne({ date: { $gte: day, $lte: dayEnd }, userId });

    if (existing) {
      await existing.deleteOne();
      return res.json({ action: 'removed', date: day });
    }

    const entry = await Practice.create({ date: day, username, userId });
    res.status(201).json({ action: 'added', entry });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to toggle availability', details: err.message });
  }
});

// GET /api/practice/days?year=&month=  — all confirmed practice days for a month
router.get('/days', async (req: Request, res: Response) => {
  try {
    const { year, month } = req.query;
    let filter: Record<string, unknown> = {};

    if (year && month) {
      const y = parseInt(year as string, 10);
      const m = parseInt(month as string, 10) - 1;
      const from = new Date(y, m, 1);
      const to = new Date(y, m + 1, 0, 23, 59, 59, 999);
      filter = { date: { $gte: from, $lte: to } };
    }

    const days = await PracticeDay.find(filter).sort({ date: 1 });
    res.json(days);
  } catch {
    res.status(500).json({ error: 'Failed to fetch practice days' });
  }
});

// POST /api/practice/days  — schedule a practice day
router.post('/days', async (req: Request, res: Response) => {
  try {
    const { date, notes } = req.body;
    if (!date) return res.status(400).json({ error: 'date is required' });

    const { username } = req.user!;

    const day = new Date(date);
    day.setUTCHours(0, 0, 0, 0);

    // Upsert so re-scheduling the same date just updates notes
    const practiceDay = await PracticeDay.findOneAndUpdate(
      { date: day },
      { notes, createdBy: username },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(practiceDay);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to schedule practice day', details: err.message });
  }
});

// DELETE /api/practice/days/:id  — remove a scheduled practice day
router.delete('/days/:id', async (req: Request, res: Response) => {
  try {
    const day = await PracticeDay.findByIdAndDelete(req.params.id);
    if (!day) return res.status(404).json({ error: 'Practice day not found' });
    res.json({ message: 'Practice day removed' });
  } catch {
    res.status(500).json({ error: 'Failed to remove practice day' });
  }
});

export default router;

