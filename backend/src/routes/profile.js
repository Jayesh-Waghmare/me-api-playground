import express from 'express';
import Profile from '../models/Profile.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const profile = await Profile.findOne().lean();
    res.json(profile || {});
  } catch (e) { next(e); }
});

router.put('/', async (req, res, next) => {
  try {
    const { name, email, education, github, linkedin, portfolio } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'name and email are required' });

    const updated = await Profile.findOneAndUpdate(
      {},
      { name, email, education, github, linkedin, portfolio },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();
    res.json(updated);
  } catch (e) { next(e); }
});

export default router;