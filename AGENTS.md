# AGENTS.md - Bookify Library System

## Project Overview
Static frontend library management system ("Bookify"). Pure client-side HTML/CSS/JS with localStorage persistence. No build tools, no package manager, no test suite.


## To push to the remote repository:
use CommitsIns.md guidelines for commit messages.

## Tech Stack
- **HTML5** - Static pages, no SPA router
- **CSS3** - Single shared stylesheet (`css/style.css`)
- **Vanilla JS (ES6)** - Global scope, no modules, no bundler
- **Python 3** - `scripts/update_stats.py` for README contributor stats
- **GitHub Actions** - CI: auto-updates README stats on push to `main`

## Directory Structure
```
├── admin/               # Admin pages (catalog, book-add, book-edit, manage)
├── user/                # User pages (dashboard, catalog, search, borrowed, login, signup)
│   └── books/           # Individual book detail pages (book1.html - book7.html)
├── backend/             # Django backend (from backend-integration merge)
├── css/style.css        # Shared stylesheet
├── js/admin.js          # Admin JS - CRUD, auth
├── js/user.js           # User JS - CRUD, auth, search, borrow, dashboard
├── scripts/             # Utility scripts
│   └── update_stats.py
└── .github/workflows/   # CI workflow
```

## Key Patterns & Conventions

### Navigation
- **Island-style nav bar**: pill-shaped, glass/blur effect, gradient active state
- **User nav**: Home, Borrowed, Search, Logout (login/signup are standalone pages)
- **Admin nav**: Books (catalog), Edit, Add, Manage tabs (all link to separate pages)
- Nav items use `.nav-item` + `.active` classes inside `.nav-island`
- Logout handled via `#logout-link` click handler
- **admin/manage.html** is a self-contained tabbed page with its own inline CRUD (add/edit/delete) wired to localStorage — not dependent on admin.js for CRUD

### CSS
- Single file: `css/style.css` (~100 lines)
- CSS custom properties for theming: `--header`, `--accent`, `--danger`, etc.
- Card grid for dashboard: `.book-grid` + `.book-card`
- Standalone pages (login/signup): `.standalone-page` class on body
- Responsive breakpoint at 768px

### JavaScript
- `loadDashboard()` renders borrowed + available book grids on dashboard.html
- `loadBooks()` renders full book table on catalog.html
- `loadBorrowedBooks()` renders borrowed table on borrowed.html
- `borrowBook()` sets `dueDate` (14 days from borrow date) on the book object
- Seed data includes `coverUrl` for each book and `dueDate` for borrowed ones
- Protected pages (dashboard.html, borrowed.html) redirect to login if unauthenticated
- **admin.js**: `loadAdminBooks()` renders book table with Edit/Delete actions; `loadEditBookData()` populates edit form from query param `?id=`; `deleteBook(id)` removes from localStorage
- **manage.html** (self-contained): `loadMgmtBooks()`, `mgmtAddBook()`, `mgmtEditBook(id)`, `mgmtUpdateBook()`, `mgmtDeleteBook(id)` all operate on localStorage directly

### Data Model
- Books: `{ id, title, author, category, price, available, borrowedBy, dueDate, coverUrl, description }`
- Users: `{ id, username, password, email, isAdmin, borrowedBooks[] }`
- Seed: 7 books with placeholder cover images, 2 default accounts (`admin` / `admin123`, `user1` / `pass1`)

### UX Flow
1. User lands on root landing page or standalone **login** / **signup** page
2. After login, redirected to **dashboard** (dashboard.html) or **admin catalog** (catalog.html)
3. Dashboard shows borrowed books (with cover, due date) and available books to borrow
4. Users can borrow from dashboard or catalog listing page
5. Logout returns to login page

## Commands
- No build, lint, test, or typecheck commands exist
- `python scripts/update_stats.py` - Update contributor stats in README

## Git Conventions
- **Branch**: `main` (primary), `origin/backend-integration` (merged)
- **Commits**: Mix of conventional (`Feat:`, `Fix:`, `Refactor:`, `Docs:`) and informal

## Known Issues / Tech Debt
- Heavy code duplication between `js/admin.js` and `js/user.js` (identical init/auth functions)
- No linting or formatting standards
- No test coverage
- Client-side auth only; no real security
- placehold.co URLs used for book covers (not real covers)
