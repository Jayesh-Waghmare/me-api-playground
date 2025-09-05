import express from 'express';
import Project from '../models/Project.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { skill } = req.query;
    let filter = {};
    
    if (skill) {
      const skillLower = String(skill).toLowerCase();
      
      filter = {
        $or: [
          { skills: skillLower },
          { skills: { $regex: new RegExp(skillLower, 'i') } }
        ]
      };
    }
    
    const rows = await Project.find(filter).sort({ _id: -1 }).select('title description').lean();
    res.json(rows);
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).lean();
    if (!project) return res.status(404).json({ error: 'project not found' });
    res.json(project);
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, description, links = [], skills = [] } = req.body;
    if (!title) return res.status(400).json({ error: 'title is required' });
    const created = await Project.create({
      title,
      description: description ?? null,
      links: Array.isArray(links) ? links : [],
      skills: Array.isArray(skills) ? skills.map(String) : []
    });
    res.status(201).json(created);
  } catch (e) { next(e); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { title, description, links, skills } = req.body;
    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      {
        ...(title !== undefined ? { title } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(Array.isArray(links) ? { links } : {}),
        ...(Array.isArray(skills) ? { skills: skills.map(String) } : {})
      },
      { new: true }
    ).lean();
    if (!updated) return res.status(404).json({ error: 'project not found' });
    res.json(updated);
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (e) { next(e); }
});

export default router;