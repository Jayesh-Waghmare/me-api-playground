# Me‑API Playground (Track A)

Small API + minimal UI that stores my profile (name, email, education, skills[], projects[], work[], links{github, linkedin, portfolio}) in a real database and exposes query endpoints.

Live URLs
- Backend API: 
- Frontend UI: 
- Public GitHub Repo: https://github.com/Jayesh-Waghmare

Resume
- Link: https://drive.google.com/file/d/1lRzLFT7_oZVXPv77IqL2OsNR43gBxMR8/view?usp=drivesdk

## Architecture
- Backend: Node.js + Express
- Database: MongoDB
- Minimal Frontend: Plain HTML + JS

## Endpoints
- GET /health → 200 OK
- Profile: GET /profile, PUT /profile
- Skills: GET /skills, GET /skills/top?limit=5, POST/PUT/DELETE /skills
- Projects: GET /projects[?skill=python], GET /projects/:id, POST/PUT/DELETE /projects
- Search: GET /search?q=...

See Postman collection in ./postman/MeAPI.postman_collection.json.

## Setup (Local)
1) Prereqs:
   - Node.js
2) Backend
   - Copy backend/.env.example to backend/.env and adjust values
   - Install dependencies:
     - Windows PowerShell/cmd:
       npm install
     - Run from backend directory
   - Seed the DB:
       npm run seed
   - Start the server:
       npm run dev
   - API will run at http://localhost:4000 (GET /health returns 200)
3) Frontend
   - Open ./frontend/index.html in the browser
   - It expects API at http://localhost:4000
   
## Setup (Production / Hosting)
- Backend: Deploy to Vercel, Set env vars from .env.example.
- Frontend: Deploy static files (frontend/) to Vercel.

## Sample curl
- Health:
  curl http://localhost:4000/health
- Profile read:
  curl http://localhost:4000/profile
- Profile update:
  curl -X PUT http://localhost:4000/profile ^
    -H "Content-Type: application/json" ^
    -d "{\"name\":\"Your name\",\"email\":\"your-email\"}"
- Projects by skill:
  curl "http://localhost:4000/projects?skill=javascript"
- Search:
  curl "http://localhost:4000/search?q=api"