# Bookify

A full-featured library management system with role-based access control, cover uploads, smart search, and API-first architecture. Static frontend with Django REST API backend and localStorage fallback.

## Features

- **Role-based access** — Regular users, admins, and superusers with distinct permissions
- **Book CRUD** — Full create, read, update, delete for books with cover photo uploads (base64)
- **Admin management** — Superusers can create/remove admin accounts
- **Smart search** — Filter by title, author, category, or all fields; filter by availability
- **Borrow system** — 14-day borrowing with automatic due date tracking; users return own books, admins return any
- **Cover thumbnails** — Upload custom covers, displayed across catalog, search, dashboard, and detail pages
- **Custom modals** — Polished alert/confirm modals replacing native browser dialogs
- **Pagination** — Configurable page size with numbered page controls
- **Island navigation** — Glassmorphism pill-shaped nav bar with blur effect and scroll-aware transparency
- **Responsive design** — Adapts from desktop to mobile
- **Semantic skeleton states** — Placeholder shimmer while content loads
- **API-first with localStorage fallback** — Writes go to API then sync to localStorage; reads from localStorage (synchronous); falls back to localStorage-only when the API is unreachable

## Tech Stack

| Layer              | Technology                                           |
| ------------------ | ---------------------------------------------------- |
| Frontend           | HTML5, CSS3, Vanilla JS (ES6)                        |
| Styling            | CSS custom properties, glassmorphism, flexbox/grid   |
| CSS Architecture   | Base → Layout → Components → Utilities               |
| JS Architecture    | Shared core + domain modules: auth, books, search   |
| Backend            | Django REST Framework + JWT auth (simplejwt)         |
| Persistence        | localStorage (client-side fallback)                  |
| CI                 | GitHub Actions (README stats auto-update)            |

## Getting Started

### Frontend (standalone)

```
git clone https://github.com/Abdelhamid-El-rashidy/Library_System.git
cd Library_System
open index.html
```

No build tools, no package manager needed — pure static files.

### Backend (optional, for API mode)

```
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data
python manage.py runserver 8000
```

The frontend will automatically use the API at `http://localhost:8000/api`. If the API is unavailable, it falls back to localStorage.

### Default Accounts

| Role         | Username | Password   |
| ------------ | -------- | ---------- |
| Superuser    | `admin`  | `admin123` |
| Regular User | `user1`  | `pass1`    |

> **Note:** User data is stored in `localStorage`. Clearing browser storage resets to seed data. The default superuser is re-created automatically if missing.

## Project Structure

```
├── admin/                       # Admin panel pages
│   ├── catalog.html             # Book grid with edit/delete
│   ├── book-add.html            # Add new book form
│   ├── book-edit.html           # Edit book form (prefilled from ?id=)
│   ├── borrowed.html            # Borrowed books with Mark Returned
│   └── admins.html              # Admin account management (superuser only)
├── user/                        # User-facing pages
│   ├── dashboard.html           # Borrowed + available books grid with Return buttons
│   ├── catalog.html             # Full book table with covers
│   ├── search.html              # Search with filters and availability toggle
│   ├── borrowed.html            # User's borrowed books with Return buttons
│   ├── detail.html              # Generic book detail page (?id=N)
│   ├── login.html               # Standalone login page
│   ├── signup.html              # Standalone signup page with is_admin flag
│   └── books/                   # Individual static book detail pages (legacy)
├── css/
│   ├── base.css                 # Reset, custom properties, typography
│   ├── layout.css               # Grid, nav, page structure
│   ├── components.css           # Cards, modals, forms, buttons, pagination
│   └── utilities.css            # Helpers, responsive overrides
├── js/
│   ├── shared.js                # Core: API client, JWT, pagination, modals, data sync
│   ├── admin-ui.js              # Admin auth check + nav setup
│   ├── admin-books.js           # Admin book CRUD
│   ├── admin-borrowed.js        # Admin borrowed books management
│   ├── user-auth.js             # Login, signup, session checks
│   ├── user-books.js            # Browse, borrow, return, dashboard
│   └── user-search.js           # Search with filters
├── backend/                     # Django REST API (DRF + JWT)
│   ├── api/
│   │   ├── models.py            # Book model (title, author, category, available, cover_url, borrowed_by, due_date)
│   │   ├── serializers.py       # Book, User, Signup serializers
│   │   ├── views.py             # BookViewSet, UserViewSet, auth endpoints
│   │   └── management/commands/ # seed_data.py for initial data
│   └── bookify/settings.py      # DRF, simplejwt, CORS config
├── scripts/
│   └── update_stats.py          # Contributor stats chart for README
├── .github/workflows/           # CI workflow config
└── index.html                   # Root landing page
```

## Role-Based Access

| Permission                | User | Admin | Superuser |
| ------------------------- | ---- | ----- | --------- |
| Browse & search books     | ✓    | ✓     | ✓         |
| Borrow books              | ✓    | ✓     | ✓         |
| Return own borrowed books | ✓    | ✓     | ✓         |
| Return any borrowed book  | —    | ✓     | ✓         |
| Add / Edit / Delete books | —    | ✓     | ✓         |
| View all borrowed books   | —    | ✓     | ✓         |
| Manage admin accounts     | —    | —     | ✓         |

- **Signup** creates a regular user by default, or an admin when `is_admin` is set
- Only a **superuser** can manage admin accounts via the **Admins** tab
- The default `admin` account is the sole superuser

## Key Design Decisions

- **Static-first with API layer** — Pure HTML/CSS/JS that works standalone, with an optional Django REST backend for persistence
- **API-first, localStorage fallback** — Writes go through `apiFetch()` to the API then sync to localStorage; reads always from localStorage for synchronous performance
- **JWT authentication** — Access + refresh token rotation via `djangorestframework-simplejwt`
- **Data normalization** — API snake_case (`cover_url`) auto-converted to camelCase (`coverUrl`) on sync
- **Custom modals** — `showAlert()` and `showConfirm()` replace native `alert()`/`confirm()` for a polished UX
- **Simple Book model** — No quantity or multi-copy: `available` boolean + `borrowed_by` FK + `due_date`
- **No price field** — Public library platform
- **Cover upload via base64** — Images stored in localStorage for full self-containment
- **Pagination** — Configurable `ITEMS_PER_PAGE` with numbered controls and page jump
- **Island nav** — Pill-shaped, glass/blur effect with scroll-aware transparency transition
- **CSS architecture** — Modular cascade: base variables → layout → components → utilities
- **JS architecture** — `shared.js` core + domain-specific files (auth, books, search, admin)
- **Seed data** — 7 books with placeholder covers, 2 default accounts — available on first load

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit following [Conventional Commits](https://www.conventionalcommits.org/)
4. Push and open a pull request

## License

MIT
