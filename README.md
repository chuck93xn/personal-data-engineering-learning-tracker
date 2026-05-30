# Personal Data Engineering Learning Tracker

A beginner-friendly learning tracker built with only HTML, CSS, and JavaScript.

The goal is to practice a complete small project workflow while learning data engineering topics and tools:

- Git
- GitHub
- Codex Desktop
- Codex CLI
- Cursor with Codex

## Features

- Add a learning task with topic, category, status, and notes.
- Show all learning tasks in a list.
- Change each task status between Not Started, In Progress, and Done.
- Delete tasks.
- Save tasks in the browser with `localStorage`.
- Show a simple progress summary.

## How to Run

Open `index.html` in your browser.

No install step is required. This project does not use npm, React, Vite, Tailwind, a backend, or a database.

## Suggested Git Practice

Use small commits while building or changing the project:

```bash
git status
git add .
git commit -m "feat: describe the change"
```

Suggested commit rhythm:

1. `chore: initialize project structure`
2. `feat: add static tracker layout`
3. `style: add basic responsive styling`
4. `feat: render learning tasks from JavaScript`
5. `feat: add new learning task form`
6. `feat: persist tasks in localStorage`
7. `feat: update and delete tasks`
8. `feat: add learning progress summary`
9. `docs: document project usage and learning goals`
10. `refactor: organize tracker JavaScript functions`

## Suggested Learning Tasks

Try adding tasks like:

- Git basics
- GitHub repository setup
- SQL joins
- Python file reading
- Airflow concepts
- dbt models
- Build a tiny CSV cleaning script

## Next Ideas

Keep these for later, after the first version works:

- Filter by category
- Filter by status
- Edit existing tasks
- Export tasks as JSON
- Import tasks from JSON
- Deploy with GitHub Pages
