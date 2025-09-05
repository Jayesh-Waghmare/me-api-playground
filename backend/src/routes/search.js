import express from 'express';
import Project from '../models/Project.js';
import Skill from '../models/Skill.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const q = String(req.query.q || '').trim().toLowerCase();
    if (!q) return res.json({ projects: [], skills: [] });

    const regex = new RegExp(q, 'i');
    
    const projects = await Project.find({
      $or: [
        { title: regex },
        { description: regex },
        { skills: regex }
      ]
    }).select('title description skills').sort({ _id: -1 }).lean();

    const skills = await Skill.find({ name: regex })
      .sort({ name: 1 })
      .lean();

    const projectsWithSkills = await Promise.all(projects.map(async project => {
      const relatedSkills = await Skill.find({
        name: { $in: project.skills }
      }).lean();
      return { ...project, skills: relatedSkills };
    }));

    const skillsWithProjects = await Promise.all(skills.map(async skill => {
      const relatedProjects = await Project.find({
        skills: skill.name
      }).select('title description').lean();
      return { ...skill, projects: relatedProjects };
    }));

    res.json({
      projects: projectsWithSkills,
      skills: skillsWithProjects
    });
  } catch (e) { next(e); }
});

export default router;