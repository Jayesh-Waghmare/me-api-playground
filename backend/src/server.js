import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { initDb } from './db.js';
import { authWrite } from './middleware/auth.js';
import { errorHandler, notFound } from './middleware/errors.js';

await initDb();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan('dev'));

app.use(
  rateLimit({
    windowMs: 60 * 1000,
    limit: 120,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.use(express.json({ limit: '256kb' }));

app.use(['/profile', '/skills', '/projects'], (req, res, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    return authWrite(req, res, next);
  }
  return next();
});

import healthRouter from './routes/health.js';
import profileRouter from './routes/profile.js';
import skillsRouter from './routes/skills.js';
import projectsRouter from './routes/projects.js';
import searchRouter from './routes/search.js';

app.use('/health', healthRouter);
app.use('/profile', profileRouter);
app.use('/skills', skillsRouter);
app.use('/projects', projectsRouter);
app.use('/search', searchRouter);

app.get('/', (req, res) => {
  res.status(200).json({
    service: 'Me-API Playground',
    status: 'ok',
    endpoints: {
      health: '/health',
      profile: '/profile',
      skills: '/skills',
      projects: '/projects',
      search: '/search'
    }
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});