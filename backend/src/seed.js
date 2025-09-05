import 'dotenv/config';
import { initDb } from './db.js';
import Profile from './models/Profile.js';
import Skill from './models/Skill.js';
import Project from './models/Project.js';

await initDb();

await Profile.findOneAndUpdate(
  {},
  {
    name: 'Jayesh Waghmare',
    email: 'jayeshwaghmare597@gmail.com',
    education: [
      {
        institution: 'National Institute of Technology, Goa',
        degree: 'B.Tech Computer Science & Engineering',
        period: 'Aug 2023 - May 2027',
        cgpa: 8.95
      },
      {
        institution: 'R. P. Jr College of Arts, Commerce and Science, Vasai',
        degree: 'HSC',
        period: 'Aug 2021 - May 2023',
        percentage: 76.33
      }
    ],
    github: 'https://github.com/Jayesh-Waghmare',
    linkedin: 'https://www.linkedin.com/in/jayesh-waghmare-56b702288/',
    portfolio: 'https://jayeshwaghmare.com'
  },
  { upsert: true, new: true, setDefaultsOnInsert: true }
);

const seedSkills = [
  { name: 'javascript' },
  { name: 'typescript' },
  { name: 'react.js' },
  { name: 'next.js' },
  { name: 'node.js' },
  { name: 'express.js' },
  { name: 'mongodb' },
  { name: 'mysql' },
  { name: 'postgresql' },
  { name: 'c++' },
  { name: 'c' },
  { name: 'langchain' },
  { name: 'openai' },
  { name: 'docker' },
  { name: 'aws' },
  { name: 'stripe' },
  { name: 'clerk' },
  { name: 'socket.io' },
  { name: 'tanstack query' }
];
for (const s of seedSkills) {
  await Skill.updateOne({ name: s.name }, s, { upsert: true });
}

await Project.deleteMany({});
await Project.create([
  {
    title: 'Full-stack AI SaaS Platform',
    description: 'A full-stack AI SaaS product that provides AI-powered article generation and image editing features.',
    links: [
      { type: 'github', url: 'github repo link (on resume)' },
      { type: 'url', url: 'live demo link (on resume)' }
    ],
    skills: ['postgresql', 'react.js', 'node.js', 'clerk', 'openai', 'langchain']
  },
  {
    title: 'Learning Management System (LMS)',
    description: 'A Learning Management System supporting course creation, enrollments and payments.',
    links: [
      { type: 'github', url: 'github repo link (on resume)' },
      { type: 'url', url: 'live demo link (on resume)' }
    ],
    skills: ['react.js', 'node.js', 'mongodb', 'stripe', 'clerk']
  },
  {
    title: 'Real-Time Chat Application',
    description: 'Real-time chat application enabling live messaging and media sharing.',
    links: [
      { type: 'github', url: 'github repo link (on resume)' },
      { type: 'url', url: 'live demo link (on resume)' }
    ],
    skills: ['react.js', 'node.js', 'socket.io', 'mongodb']
  },
  {
    title: 'URL Shortener Service with Analytics',
    description: 'A URL shortening service that creates short aliases and tracks click analytics.',
    links: [
      { type: 'github', url: 'github repo link (on resume)' },
      { type: 'url', url: 'live demo link (on resume)' }
    ],
    skills: ['react.js', 'node.js', 'express.js', 'mongodb', 'tanstack query']
  }
]);

console.log('Mongo seed complete.');
process.exit(0);