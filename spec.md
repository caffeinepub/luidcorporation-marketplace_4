# LuidCorporation Marketplace

## Current State
New project, no existing application code.

## Requested Changes (Diff)

### Add
- Public landing page with hero section and product grid
- User registration/login with persistent sessions
- First registered user auto-assigned Admin role
- Client dashboard for purchased scripts and downloads
- Admin panel (/admin) for managing scripts, users
- Script catalog with categories and search/filter
- Product detail page with purchase flow
- Download unlock after purchase confirmation
- Fully responsive UI (mobile-first)

### Modify
N/A (new project)

### Remove
N/A

## Implementation Plan

### Backend (Motoko)
1. Users canister: id, name, email, passwordHash, role (Admin|Client), createdAt
2. Scripts canister: id, title, description, category (Discord Bots|Web Scraping|Automation), price, version, downloadUrl, language tag, createdAt
3. Sales/Purchases canister: id, userId, scriptId, purchasedAt, downloadToken
4. First user registration auto-assigns Admin role
5. Auth: session token stored in stable memory, login/logout
6. Admin-gated functions (add/edit/delete scripts, manage users)
7. Purchase validation: only buyers can get download link

### Frontend (React + Tailwind)
1. Public routes: /, /product/:id, /login, /register
2. Protected routes: /dashboard (client), /admin (admin only)
3. Hero section with search bar
4. Product grid with category filter tabs
5. Product detail page
6. Purchase flow modal/page
7. Client dashboard: purchased scripts with Download ZIP button
8. Admin panel: add/edit/delete scripts, user management list
9. Design: white snow (#FFFFFF) background, neon green (#39FF14) accents
