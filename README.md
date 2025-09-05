# Me‑API Playground (Track A)

Small API + minimal UI that stores my profile (name, email, education, skills[], projects[], work[], links{github, linkedin, portfolio}) in a real database and exposes query endpoints.

## Live URLs
- Backend API: https://me-api-playground-navy.vercel.app
- Frontend UI: https://me-api-playground-frontend-ten.vercel.app
- Public GitHub Repo: https://github.com/Jayesh-Waghmare

## Resume
- Link: https://drive.google.com/file/d/1lRzLFT7_oZVXPv77IqL2OsNR43gBxMR8/view?usp=drivesdk

## Architecture
- Backend: Node.js + Express
- Database: MongoDB
- Minimal Frontend: Plain HTML + JS

## Schema (MongoDB)

### Collections
1. Profile (Singleton, id=1)
   - name
   - email
   - education
   - github
   - linkedin
   - portfolio

2. Skills
   - name (unique)

3. Projects
   - title
   - description
   - project_links
     - type
     - url
   - project_skills
     - skill_id (FK)

### Indexes
- skills(name)
- projects(title)
- projects(description)

## Endpoints
- GET /health → 200 OK
- Profile: GET /profile, PUT /profile
- Skills: GET /skills, GET /skills/top?limit=5, POST/PUT/DELETE /skills
- Projects: GET /projects[?skill=python], GET /projects/:id, POST/PUT/DELETE /projects
- Search: GET /search?q=...

See Postman collection in ./postman/MeAPI.postman_collection.json for detailed examples.

## Local Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local instance or Atlas connection string)
- Web browser (Chrome/Firefox recommended)

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Copy environment file and configure:
   ```bash
   copy .env.example .env
   ```
   Update the following in .env:
   - PORT (default: 4000)
   - MONGODB_URI (your MongoDB connection string)
   - CORS_ORIGINS (e.g., http://localhost:3000)

3. Install dependencies:
   ```bash
   npm install
   ```

4. Seed the database:
   ```bash
   npm run seed
   ```

5. Start development server:
   ```bash
   npm run dev
   ```
   Server will run at http://localhost:4000

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Copy environment file and configure:
   ```bash
   copy .env.example .env
   ```
   Set NEXT_PUBLIC_API_URL to your backend URL (e.g., http://localhost:4000)

3. Serve the frontend:
   ```bash
   npx serve
   ```
   Frontend will be available at http://localhost:3000

## Production Setup

### Backend Deployment (Vercel)
1. Fork/clone repository to your GitHub account
2. Create new project in Vercel dashboard
3. Connect to your GitHub repository
4. Configure build settings:
   - Framework Preset: Other
   - Root Directory: backend
   - Build Command: npm install
   - Output Directory: src
5. Add environment variables:
   - MONGODB_URI (production database URL)
   - CORS_ORIGINS (comma-separated frontend URLs)

### Frontend Deployment (Vercel)
1. Create new project in Vercel dashboard
2. Connect to same GitHub repository
3. Configure build settings:
   - Framework Preset: Other
   - Root Directory: frontend
   - Build Command: none (static deployment)
4. Add environment variables:
   - NEXT_PUBLIC_API_URL (production backend URL)

## Remarks
- The API uses a singleton pattern for profile data (only one profile document with id=1)
- Skills are unique and referenced by projects using foreign keys
- Search endpoint performs full-text search across project titles and descriptions
- Frontend is intentionally minimal, focusing on API functionality
- CORS is configured to allow requests only from specified origins
- Environment variables must be properly set for both local and production environments

## Sample curl Commands

### Health Check
```bash
curl http://localhost:4000/health
```

### Profile Operations
```bash
# Read profile
curl http://localhost:4000/profile

# Update profile
curl -X PUT http://localhost:4000/profile ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Your name\",\"email\":\"your-email\"}"
```

### Project Operations
```bash
# Get projects by skill
curl "http://localhost:4000/projects?skill=javascript"
```

### Search
```bash
# Search across projects
curl "http://localhost:4000/search?q=api"
```