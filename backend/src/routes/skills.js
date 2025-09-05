import express from 'express';
import Skill from '../models/Skill.js';
import Project from '../models/Project.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const rows = await Skill.find({}).sort({ name: 1 }).lean();
    res.json(rows);
  } catch (e) { next(e); }
});

router.get('/top', async (req, res, next) => {
  try {
    const limit = Math.max(1, Math.min(50, Number(req.query.limit) || 5));
    
    const usage = await Project.aggregate([
      { $unwind: '$skills' },
      { $group: { _id: '$skills', used_in_projects: { $sum: 1 } } }
    ]);

    const usageMap = new Map(usage.map(u => [u._id.toLowerCase(), u.used_in_projects]));

    const skills = await Skill.find({}).lean();
    const enriched = skills.map(s => ({
      ...s,
      used_in_projects: usageMap.get(s.name.toLowerCase()) || 0
    }));
    enriched.sort((a, b) =>
       b.used_in_projects - a.used_in_projects || a.name.localeCompare(b.name)
    );

    res.json(enriched.slice(0, limit));
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });
    const created = await Skill.create({ name });
    res.status(201).json(created);
  } catch (e) { next(e); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const updated = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
    if (!updated) return res.status(404).json({ error: 'skill not found' });
    res.json(updated);
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (e) { next(e); }
});

export default router;