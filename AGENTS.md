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
├── admin/               # Admin pages (catalog, book-add, book-edit, admins)
├── user/                # User pages (dashboard, catalog, search, borrowed, login, signup)
│   └── books/           # Individual book detail pages (book1.html - book7.html)
├── backend/             # Django backend (from backend-integration merge)
├── css/style.css        # Shared stylesheet
├── js/admin.js          # Admin JS - CRUD, auth, cover upload
├── js/user.js           # User JS - CRUD, auth, search, borrow, dashboard
├── scripts/             # Utility scripts
│   └── update_stats.py
└── .github/workflows/   # CI workflow
```

## Key Patterns & Conventions

### Navigation

- **Island-style nav bar**: pill-shaped, glass/blur effect, gradient active state
- **User nav**: Home, Borrowed, Search, Logout (login/signup are standalone pages)
- **Admin nav**: Books (catalog), Edit, Add, Admins (superuser only)
- Nav items use `.nav-item` + `.active` classes inside `.nav-island`
- `.nav-item--hidden` class hides nav links (used for superuser-only Admins link)
- Logout handled via `#logout-link` click handler

### CSS (~110 lines)

- CSS custom properties for theming: `--header`, `--accent`, `--danger`, etc.
- Card grid for dashboard: `.book-grid` + `.book-card`
- `.form-section` with `.form-section-title` for grouped form fields
- `.form-row` for side-by-side fields (2-col, responsive → 1-col)
- Standalone pages (login/signup): `.standalone-page` class on body
- Responsive breakpoint at 768px

### JavaScript

- `loadDashboard()` renders borrowed + available book grids on dashboard.html
- `loadBooks()` renders book table with cover thumbnails on catalog.html
- `loadBorrowedBooks()` renders borrowed table with covers on borrowed.html
- `borrowBook()` sets `dueDate` (14 days from borrow date) + reloads page
- `performSearch()` supports All/Title/Author/Category search + availability filter
- `displaySearchResults()` renders cover thumbnails + empty state messages
- `loadBookDetails()` populates detail page with cover img, all fields, borrow button
- `renderBookRow()` / `renderCoverThumb()` / `renderEmptyRow()` — reusable table helpers
- Seed data includes `coverUrl` for each book and `dueDate` for borrowed ones
- Protected pages (dashboard.html, borrowed.html) redirect to login if unauthenticated
- **admin.js**: `loadAdminBooks()` renders book table with Edit/Delete; `loadEditBookData()` prefills edit form from `?id=`; `deleteBook(id)` removes from localStorage; `previewCover()` handles file→base64 cover upload
- Catalog page renders all books with Edit/Delete actions via `loadAdminBooks()` and `deleteBook()`

### RBAC (Role-Based Access)

- **User** (`isAdmin: false`): Can browse, search, borrow, view details
- **Admin** (`isAdmin: true, isSuperuser: false`): Full book CRUD, no user management
- **Superuser** (`isAdmin: true, isSuperuser: true`): Same as Admin + can create/remove admin accounts via `admin/admins.html`
- Signup always creates regular users; only superuser can promote to admin

### Data Model

- Books: `{ id, title, author, category, price, available, borrowedBy, dueDate, coverUrl, description }`
- Users: `{ id, username, password, email, isAdmin, isSuperuser, borrowedBooks[] }`
- Seed: 7 books with placeholder cover images, 2 default accounts (`admin` / `admin123`, `user1` / `pass1`)

### UX Flow

1. User lands on root landing page or standalone **login** / **signup** page
2. After login, redirected to **dashboard** (dashboard.html) or **admin catalog** (catalog.html)
3. Dashboard shows borrowed books (with cover, due date) and available books to borrow
4. Users can borrow from dashboard or catalog listing page
5. Catalog and search show cover thumbnails in table rows
6. Logout returns to login page

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
- Book detail pages are static HTML with IDs — new books added via admin won't have a detail page (would need a generic template with query param routing)
- Django templates in `library/templates/` are outdated copies of the frontend
