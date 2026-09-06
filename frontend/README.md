
---

# Part 7 — Create `README.md`

Keep the README shorter because the detailed documentation is now inside `docs/`.

```md
# SpendWise

SpendWise is a full-stack personal finance management application built by a four-member team.

It provides authenticated, user-specific financial management with a modern glassmorphism interface.

---

## Tech Stack

### Frontend

- Vue.js 3
- Vite
- Tailwind CSS
- Pinia
- Vue Router
- Axios
- Lucide Icons

### Backend

- Node.js
- Express.js
- Mongoose

### Database

- MongoDB Atlas

### Authentication

- Keycloak
- JWT
- Google Identity Provider through Keycloak

---

# Architecture

```text
Vue Frontend
     ↓
Keycloak
     ↓
JWT
     ↓
Express Backend
     ↓
Authentication Middleware
     ↓
Controllers / Services
     ↓
MongoDB