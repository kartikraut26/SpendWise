# SpendWise — System Architecture

## High-Level Architecture

```text
                    ┌──────────────────────┐
                    │      Browser         │
                    │   Vue 3 + Vite       │
                    └──────────┬───────────┘
                               │
                               │ HTTPS / HTTP
                               ▼
                    ┌──────────────────────┐
                    │      Keycloak        │
                    │ Authentication       │
                    │ JWT / Google IdP     │
                    └──────────┬───────────┘
                               │
                               │ JWT
                               ▼
                    ┌──────────────────────┐
                    │  Express Backend     │
                    │ Authentication       │
                    │ Middleware           │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Controllers/Services │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ MongoDB / Mongoose   │
                    └──────────────────────┘


frontend/src/
│
├── assets/
├── components/
│   ├── layout/
│   └── ui/
│
├── router/
│   └── index.js
│
├── services/
│   ├── api.js
│   └── keycloak.js
│
├── stores/
│   ├── auth.js
│   ├── finance.js
│   └── theme.js
│
└── views/
    ├── Login.vue
    ├── Dashboard.vue
    ├── Transactions.vue
    ├── Categories.vue
    ├── Budget.vue
    ├── Subscriptions.vue
    ├── Reports.vue
    ├── Profile.vue
    └── Settings.vue


backend/
│
├── config/
│   └── database.js
│
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── utils/
│
└── server.js


Authenrtication Flow

Login.vue
   ↓
auth.login()
   ↓
Keycloak
   ↓
JWT
   ↓
Frontend
   ↓
Axios interceptor
   ↓
Authorization: Bearer JWT
   ↓
Express
   ↓
Authentication middleware
   ↓
req.user


User Data Flow

JWT
 ↓
req.user.id
 ↓
MongoDB query
 ↓
userId
 ↓
Only authenticated user's documents


Dahsboard Data Flow

Dashboard.vue
      ↓
finance store
      ↓
API
      ↓
JWT
      ↓
Backend
      ↓
Authenticated user
      ↓
MongoDB
      ↓
User-specific financial data
      ↓
Dashboard