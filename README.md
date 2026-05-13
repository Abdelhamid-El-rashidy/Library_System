# Bookify

A modern, full-featured library management system with role-based access control, cover uploads, and smart search. Built as a static frontend with localStorage persistence — no server required.

![Bookify Landing](https://placehold.co/800x400/0b1120/f59e0b?text=Bookify)

## Features

- **Role-based access** — Regular users, admins, and superusers with distinct permissions
- **Book management** — Full CRUD for books with cover photo uploads (base64)
- **Admin management** — Superusers can promote/demote admin accounts
- **Smart search** — Filter by title, author, category, or all fields combined; filter by availability
- **Borrow system** — 14-day borrowing with automatic due date tracking
- **Cover thumbnails** — Upload custom covers, displayed across catalog, search, and detail pages
- **Island navigation** — Glassmorphism pill-shaped nav bar with blur effect
- **Responsive design** — Adapts seamlessly from desktop to mobile
- **Dashboard** — Personalized view of borrowed and available books

## Tech Stack

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JS (ES6) |
| Styling | CSS custom properties, glassmorphism, flexbox/grid |
| Persistence | localStorage (client-side) |
| Backend (inactive) | Django (`backend/` directory) |
| CI | GitHub Actions (README stats auto-update) |

## Getting Started

No build tools, no package manager, no server. Open any page directly in a browser.

```
git clone https://github.com/Abdelhamid-El-rashidy/Library_System.git
cd Library_System
open index.html
```

### Default Accounts

| Role | Username | Password |
|------|----------|----------|
| Superuser | `admin` | `admin123` |
| Regular User | `user1` | `pass1` |

> **Note:** Data is stored in `localStorage`. Clearing browser storage resets the database to seed data. The default admin account is re-created automatically if missing.

## Project Structure

```
├── admin/                      # Admin panel pages
│   ├── catalog.html            # Book list with edit/delete
│   ├── book-add.html           # Add new book form
│   ├── book-edit.html          # Edit book form
│   └── admins.html             # Admin account management (superuser only)
├── user/                       # User-facing pages
│   ├── dashboard.html          # Borrowed + available books grid
│   ├── catalog.html            # Full book table with covers
│   ├── search.html             # Search with filters
│   ├── borrowed.html           # Borrowed books list
│   ├── login.html              # Standalone login page
│   ├── signup.html             # Standalone signup page
│   └── books/                  # Individual book detail pages
├── css/
│   └── style.css               # Single shared stylesheet
├── js/
│   ├── user.js                 # User logic (auth, search, borrow, dashboard)
│   └── admin.js                # Admin logic (CRUD, cover upload)
├── backend/                    # Django backend (from backend-integration)
├── scripts/
│   └── update_stats.py         # Contributor stats chart
├── .github/workflows/          # CI workflow config
└── index.html                  # Root landing page
```

## Role-Based Access

| Permission | User | Admin | Superuser |
|-----------|------|-------|-----------|
| Browse & search books | ✓ | ✓ | ✓ |
| Borrow books | ✓ | ✓ | ✓ |
| Add / Edit / Delete books | — | ✓ | ✓ |
| Manage admin accounts | — | — | ✓ |

- **Signup** always creates a regular user (`isAdmin: false`)
- Only a **superuser** can create admin accounts via the **Admins** tab in the admin panel
- The default `admin` account is the sole superuser

## Key Design Decisions

- **Static-first** — No build step, no frameworks. Pure HTML/CSS/JS that works in any browser.
- **Island nav** — Pill-shaped, glass/blur navigation inspired by modern design systems.
- **Base64 covers** — Images are stored directly in localStorage, making the app fully self-contained.
- **Seed data** — 7 books with placeholder covers, available immediately after first load.
- **Django backend** — A Django project exists in `backend/` but the active frontend is the static one.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit following [Conventional Commits](https://www.conventionalcommits.org/) (see `CommitsIns.md`)
4. Push and open a pull request

### Commit Guidelines

```
feat: add cover photo upload component
fix: correct due date calculation for borrowed books
refactor: extract reusable table row renderers
style: refine nav glassmorphism and form spacing
docs: update API documentation
```

## Contributors

<!-- STATS_START -->
```
Coming soon...
```
<!-- STATS_END -->

*Contributor chart auto-updates via GitHub Actions on each push to `main`.*

## License

MIT
