# Learning Notes - 2026-05-31

## Today

Practiced the Git and GitHub feature branch workflow with the Personal Data Engineering Learning Tracker.

## Workflow Practiced

1. Started from a clean `main` branch.
2. Created feature branches for small changes.
3. Implemented one feature per branch.
4. Checked local changes with Git.
5. Committed each feature.
6. Pushed feature branches to GitHub.
7. Opened Pull Requests on GitHub.
8. Confirmed there were no merge conflicts.
9. Merged Pull Requests into `main`.
10. Deleted completed feature branches.
11. Pulled the latest `main` back to local.

## Features Practiced

- Status filter
- Category filter
- Edit task
- Export JSON
- App JavaScript refactor
- UI polish

## Git Commands Used

```bash
git status --short --branch
git switch -c feature/status-filter
git add .
git commit -m "feat: filter tasks by status"
git push -u origin feature/status-filter
```

```bash
git switch main
git pull
git branch -d feature/status-filter
```

```bash
git switch -c feature/category-filter
git add .
git commit -m "feat: filter tasks by category"
git push -u origin feature/category-filter
```

```bash
git switch main
git pull
git branch -d feature/category-filter
```

```bash
git switch -c feature/edit-task
git add .
git commit -m "feat: edit learning tasks"
git push -u origin feature/edit-task
```

```bash
git switch main
git pull
git branch -d feature/edit-task
```

## Useful Lesson

Uncommitted changes can follow you when switching branches. Commit, stash, or discard changes before changing branches if you want a clean branch switch.

Useful command:

```bash
git stash push -m "message"
git stash pop
```

## Next Plan

1. Review the refactored `app.js` and make sure the function groups are understandable.
2. Test the polished UI on desktop and a narrow browser width.
3. Continue practicing small feature branches when adding new ideas.
4. Later, deploy the project with GitHub Pages.
