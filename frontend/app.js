const API_BASE = (localStorage.getItem('API_BASE') || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/+$/, '');
document.getElementById('apiBase').textContent = `(API: ${API_BASE})`;

async function getJson(path) {
  // console.log(`Fetching from: ${API_BASE}${path}`);
  try {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) {
      console.error(`Request failed with status: ${res.status}`);
      throw new Error(`Request failed: ${res.status}`);
    }
    const data = await res.json();
    // console.log(`Response from ${path}:`, data);
    return data;
  } catch (error) {
    console.error(`Error fetching ${path}:`, error);
    throw error;
  }
}

function esc(s) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(s ?? '').replace(/[&<>"']/g, ch => map[ch]);
}
function normalizeUrl(url) {
  if (!url) return '';
  let s = String(url).trim();
  s = s.replace(/^`+|`+$/g, '').trim();
  s = s.replace(/^['"+|]+|['"+|]+$/g, '').trim();
  if (!s) return '';
  if (/^https?:\/\//i.test(s)) return s;
  return `https://${s}`;
}

async function loadAllData() {
  await loadProfile();
  await loadSkills();
  await loadProjects();
}

async function loadSkills() {
  try {
    const skills = await getJson('/skills');
    const skillsList = document.getElementById('skillsList');
    if (!skillsList) {
      const skillsSection = document.querySelector('section:nth-child(2)');
      const skillsListEl = document.createElement('div');
      skillsListEl.id = 'skillsList';
      skillsListEl.className = 'skills-list';
      skillsSection.appendChild(skillsListEl);
    }
    
    const list = document.getElementById('skillsList');
    list.innerHTML = '<h3>My Skills</h3>';
    
    if (skills.length === 0) {
      list.innerHTML += '<p>No skills found</p>';
      return;
    }
    
    const skillsHtml = skills.map(skill => 
      `<div class="skill-item">${esc(skill.name)}</div>`
    ).join('');
    
    list.innerHTML += skillsHtml;
  } catch (e) {
    console.error('Error loading skills:', e);
  }
}

async function loadProjects() {
  try {
    const projects = await getJson('/projects');
    const projectsList = document.getElementById('allProjects');
    if (!projectsList) {
      const main = document.querySelector('main');
      const projectsSection = document.createElement('section');
      projectsSection.innerHTML = '<h2>All Projects</h2>';
      const projectsListEl = document.createElement('ul');
      projectsListEl.id = 'allProjects';
      projectsSection.appendChild(projectsListEl);
      main.appendChild(projectsSection);
    }
    
    const list = document.getElementById('allProjects');
    list.innerHTML = '';
    
    if (projects.length === 0) {
      list.innerHTML = '<li>No projects found</li>';
      return;
    }
    
    projects.forEach(p => {
      const li = document.createElement('li');
      li.textContent = `${p.title} — ${p.description || ''}`;
      list.appendChild(li);
    });
  } catch (e) {
    console.error('Error loading projects:', e);
  }
}

async function loadProfile() {
  try {
    const p = await getJson('/profile');

    const gh = normalizeUrl(p.github);
    const li = normalizeUrl(p.linkedin);
    const pf = normalizeUrl(p.portfolio);

    let educationHtml = '';
    if (p.education && Array.isArray(p.education)) {
      educationHtml = p.education.map(edu => {
        let details = `${esc(edu.institution)}: ${esc(edu.degree)}, ${esc(edu.period)}`;
        if (edu.cgpa) details += `, CGPA: ${esc(edu.cgpa)}`;
        if (edu.percentage) details += `, Percentage: ${esc(edu.percentage)}%`;
        return `<div class="education-item">${details}</div>`;
      }).join('');
    } else {
      educationHtml = esc(p.education || '');
    }

    const html = `
      <div class="profile-grid">
        <div><strong>Name</strong></div><div>${esc(p.name)}</div>
        <div><strong>Email</strong></div><div><a href="mailto:${esc(p.email)}">${esc(p.email)}</a></div>
        <div><strong>Education</strong></div><div>${educationHtml}</div>
        <div><strong>GitHub</strong></div><div>${gh ? `<a href="${esc(gh)}" target="_blank" rel="noopener">Open</a>` : '-'}</div>
        <div><strong>LinkedIn</strong></div><div>${li ? `<a href="${esc(li)}" target="_blank" rel="noopener">Open</a>` : '-'}</div>
        <div><strong>Portfolio</strong></div><div>${pf ? `<a href="${esc(pf)}" target="_blank" rel="noopener">Open</a>` : '-'}</div>
      </div>
    `;
    const box = document.getElementById('profileBox');
    box.classList.add('profile-card');
    box.innerHTML = html;
  } catch (e) {
    console.error('Error loading profile:', e);
    document.getElementById('profileBox').textContent = `Error loading profile: ${e.message}`;
  }
}

async function searchBySkill() {
  const skill = document.getElementById('skillInput').value.trim();
  const list = document.getElementById('projList');
  list.innerHTML = '';
  if (!skill) {
    list.innerHTML = '<li>Please enter a skill to search</li>';
    return;
  }

  try {
    console.log(`Searching for projects with skill: ${skill}`);
    const projects = await getJson(`/projects?skill=${encodeURIComponent(skill)}`);
    
    if (projects.length === 0) {
      list.innerHTML = '<li>No projects found with this skill</li>';
      return;
    }
    
    projects.forEach(p => {
      const li = document.createElement('li');
      li.textContent = `${p.title} — ${p.description || ''}`;
      list.appendChild(li);
    });
  } catch (e) {
    console.error('Error searching by skill:', e);
    list.innerHTML = `<li>Error: ${e.message}</li>`;
  }
}

async function freeTextSearch() {
  const q = document.getElementById('qInput').value.trim();
  const sp = document.getElementById('searchProj');
  const ss = document.getElementById('searchSkills');
  sp.innerHTML = ''; ss.innerHTML = '';
  
  if (!q) {
    sp.innerHTML = '<li>Please enter a search term</li>';
    return;
  }

  try {
    console.log(`Performing free text search for: ${q}`);
    const results = await getJson(`/search?q=${encodeURIComponent(q)}`);
    
    if (results.projects.length === 0) {
      sp.innerHTML = '<li>No projects found</li>';
    } else {
      results.projects.forEach(p => {
        const li = document.createElement('li');
        const skillsHtml = p.skills
          ? `<br>Skills: ${p.skills.map(s => `${s.name}`).join(', ')}`
          : '';
        li.innerHTML = `${esc(p.title)} — ${esc(p.description || '')}${skillsHtml}`;
        sp.appendChild(li);
      });
    }
    
    if (results.skills.length === 0) {
      ss.innerHTML = '<li>No skills found</li>';
    } else {
      results.skills.forEach(s => {
        const li = document.createElement('li');
        const projectsHtml = s.projects && s.projects.length
          ? `<br>Related Projects: ${s.projects.map(p => p.title).join(', ')}`
          : '';
        li.innerHTML = `${esc(s.name)}${projectsHtml}`;
        ss.appendChild(li);
      });
    }
  } catch (e) {
    console.error('Error in free text search:', e);
    sp.innerHTML = `<li>Error: ${e.message}</li>`;
    ss.innerHTML = `<li>Error: ${e.message}</li>`;
  }
}

document.getElementById('skillBtn').addEventListener('click', searchBySkill);
document.getElementById('qBtn').addEventListener('click', freeTextSearch);

document.getElementById('skillInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') searchBySkill();
});

document.getElementById('qInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') freeTextSearch();
});

loadAllData();