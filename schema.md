# Schema (MongoDB)
    - profile (singleton id=1)
    - name, email, education, github, linkedin, portfolio
    - skills
    - name (unique)
    - projects
    - title, description
    - project_links
    - type, url
    - project_skills
    - skill_id (FK)
    - work
    - company, role, start_date, end_date, description

Indexes
- skills(name), projects(title), projects(description)