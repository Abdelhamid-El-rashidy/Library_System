# AGENTS.md - Bookify Library System

## Project Overview
Static frontend library management system ("Bookify"). Pure client-side HTML/CSS/JS with localStorage persistence. No build tools, no package manager, no test suite.

## Tech Stack
- **HTML5** - Static pages, no SPA router
- **CSS3** - Single shared stylesheet (`css/admin.css`)
- **Vanilla JS (ES6)** - Global scope, no modules, no bundler
- **Python 3** - `scripts/update_stats.py` for README contributor stats
- **GitHub Actions** - CI: auto-updates README stats on push to `main`

## Directory Structure
```
├── admin/               # Admin pages (books, book-add, book-edit, book-management)
├── user/                # User pages (index, books, search, borrowed, login, signup)
│   └── books/           # Individual book detail pages (book1.html - book7.html)
├── backend/             # Future Django backend
├── css/admin.css        # Shared stylesheet (305 lines)
├── js/admin.js          # Admin JS (229 lines) - duplicated logic from user.js
├── js/user.js           # User JS (327 lines) - CRUD, auth, search, borrow
├── scripts/             # Utility scripts
│   └── update_stats.py  # Python script for contributor chart
└── .github/workflows/   # CI workflow
```

## Key Patterns & Conventions

### CSS
- Single file: `css/admin.css`
- BEM-like naming: `.nav-cell`, `.nav-cell--active`, `.action-link--danger`
- Color palette: dark header `#111827`, amber accent `#f59e0b`/`#d97706`, danger `#dc2626`
- Organized sections: Reset, Header, Tabs, Cards, Forms, Buttons, Tables, Footer

### JavaScript
- Scripts loaded at bottom of `<body>` via `<script src="...">`
- Init: `document.addEventListener('DOMContentLoaded', ...)`
- Data stored in `localStorage` as JSON (`libBooks`, `libUsers`, `currentUser`)
- Functions: camelCase naming
- Event binding: mixed `onsubmit`, inline `onclick`, and `addEventListener`
- Error handling: `alert()` dialogs only

### Data Model
- Books: `{ id, title, author, isbn, publisher, year, category, language, pages, copies, available, description, coverUrl }`
- Users: `{ id, username, password, email, isAdmin, borrowedBooks[] }`
- Seed data: 7 books, 1 default user (`user1` / `pass1`)

### Auth (client-side only)
- Passwords stored in plaintext in localStorage
- Admin flag set via checkbox on signup
- Session check: `getCurrentUser()` -> redirect if missing

### HTML
- `<!doctype html>` (inconsistent casing across pages)
- Semantic tags: `<header>`, `<nav>`, `<main>`, `<footer>`
- Navigation uses `<table>` inside `<nav>` (not `<ul>`)
- Form elements wrapped in `<p>` tags (older pages) or inline (newer)

## Commands
- No build, lint, test, or typecheck commands exist
- `python scripts/update_stats.py` - Update contributor stats in README

## Git Conventions
- **Branch**: `main` (primary), `origin/backend-integration` (Django backend planned)
- **Commits**: Mix of conventional (`Feat:`, `Fix:`, `Refactor:`, `Docs:`) and informal
- CI auto-commits README updates via GitHub Actions bot with `[skip ci]`

## Known Issues / Tech Debt
- Heavy code duplication between `js/admin.js` and `js/user.js` (identical init/auth functions)
- No linting or formatting standards
- No test coverage
- Client-side auth only; no real security
- Inconsistent indentation (2-space vs 4-space) and DOCTYPE casing across HTML files
