# SpendWise — Project Context & AI Continuity Guide

> This document is the primary context file for developers and AI coding assistants working on SpendWise.
>
> Before modifying the project, read this document and the relevant module documentation.

---

# 1. Project Overview

SpendWise is a full-stack personal finance management application.

The application allows authenticated users to manage and visualize their personal financial information.

The project uses:

- Vue.js 3
- Vite
- Tailwind CSS
- Pinia
- Vue Router
- Axios
- Node.js
- Express.js
- MongoDB / Mongoose
- Keycloak
- JWT authentication

---

# 2. Current Project Status

## Core Architecture

Status: COMPLETE

The basic frontend/backend architecture, routing, API structure, MongoDB connection, common layout and development environment are established.

## Authentication

Status: COMPLETE

Keycloak authentication is implemented.

Current authentication architecture:

    Browser
       ↓
    SpendWise Frontend
       ↓
    Keycloak
       ↓
    Authentication
       ↓
    JWT Access Token
       ↓
    SpendWise Backend
       ↓
    JWT Verification
       ↓
    Authenticated User
       ↓
    MongoDB user-specific data

Google authentication is configured through Keycloak Identity Brokering.

---

# 3. Important Architectural Rule

SpendWise is a multi-user application.

Every authenticated account must access only its own personal data.

NEVER use a global/shared user ID for real application data.

Do not use:

    development-user

as a fallback for authenticated production/application requests.

The authenticated Keycloak subject (`sub`) is the primary identity used to associate application data with a user.

---

# 4. Authentication Identity

Keycloak provides the authenticated user's identity.

The JWT contains the user's Keycloak subject:

    sub

The backend authentication middleware verifies the JWT and exposes the authenticated user through:

    req.user

The application user identifier should normally be:

    req.user.id

which maps to the Keycloak subject.

Frontend authentication state is managed through the Pinia auth store.

Do not create a second independent authentication system.

---

# 5. Frontend Architecture

Main frontend location:

    frontend/src/

Important directories:

    components/
    services/
    stores/
    views/
    router/
    assets/

---

# 6. Important Frontend Files

## main.js

Application bootstrap.

Responsible for:

- creating Vue application
- creating Pinia
- initializing authentication
- initializing router
- mounting application

Do not bypass authentication initialization.

---

## router/index.js

Central application routing.

Contains:

- Login route
- Dashboard
- Transactions
- Categories
- Budget
- Subscriptions
- Reports
- Profile
- Settings

Protected application routes require authentication.

Do not remove route protection when adding new authenticated modules.

---

## services/keycloak.js

Central Keycloak client instance.

Do not create multiple Keycloak instances.

---

## stores/auth.js

Central frontend authentication state.

Responsible for:

- authentication state
- current user
- Keycloak initialization
- login
- Google login
- logout
- token refresh

Other components should use the auth store rather than implementing their own login logic.

---

## services/api.js

Central Axios API client.

Responsible for:

- backend base URL
- attaching JWT access token
- token refresh
- handling unauthorized responses

Authenticated API requests should use this API client.

Do not create separate Axios instances for normal application API calls unless there is a specific architectural reason.

---

## stores/theme.js

Central application theme state.

Responsible for:

- light/dark mode
- persistent theme
- applying `data-theme`
- synchronizing theme across Dashboard, Navbar and Settings

Do not create independent theme state inside individual pages.

---

## stores/finance.js

Frontend finance state.

Currently handles transaction-related frontend state and communication with the backend.

Other members may extend this store when implementing their assigned finance functionality.

Do not remove existing transaction functionality while modifying unrelated modules.

---

# 7. Dashboard Stability Rule

Dashboard UI is considered a finalized design.

File:

    frontend/src/views/Dashboard.vue

The Dashboard contains a large amount of finalized UI and styling.

When modifying Dashboard:

DO:

- make minimal changes
- preserve existing layout
- preserve existing glassmorphism styling
- preserve existing transaction UI
- preserve existing responsive behavior
- add only required data/functionality

DO NOT:

- rewrite the entire Dashboard
- replace it with a simplified component
- remove existing sections
- remove transaction functionality
- redesign the page
- replace the existing CSS with a shorter implementation

If an AI assistant proposes reducing the Dashboard from its existing large implementation to a much smaller file, STOP and review the change.

---

# 8. Authentication UI

Login is handled through Keycloak.

The frontend supports:

- normal Keycloak login
- Google login through Keycloak Identity Provider

The frontend should not directly implement Google's authentication API.

Expected architecture:

    SpendWise
       ↓
    Keycloak
       ↓
    Google Identity Provider
       ↓
    Keycloak
       ↓
    SpendWise

---

# 9. User Profile

Profile is part of the core authenticated user system.

Profile must represent the currently authenticated user.

It must never allow one authenticated user to edit another user's profile by simply changing a user ID in the frontend.

Profile data should be resolved using the authenticated identity.

---

# 10. Settings

Settings is a user/application preference area.

Theme state is global.

Use:

    useThemeStore()

Do not create a separate light/dark mode state inside Settings.vue.

Theme must remain consistent when navigating:

    Dashboard
       ↓
    Settings
       ↓
    Profile
       ↓
    Dashboard

---

# 11. Logout

Logout is handled through the authentication store and Keycloak.

Expected flow:

    User clicks Logout
       ↓
    auth.logout()
       ↓
    Keycloak session logout
       ↓
    Redirect to /login
       ↓
    Protected routes unavailable
       ↓
    User must authenticate again

Do not implement logout by only deleting frontend state.

---

# 12. Backend Architecture

Main backend location:

    backend/

Important directories:

    config/
    controllers/
    middleware/
    models/
    routes/
    services/
    utils/

---

# 13. Backend Request Flow

Normal authenticated request:

    Frontend
       ↓
    Axios API client
       ↓
    Authorization: Bearer <JWT>
       ↓
    Express
       ↓
    Authentication middleware
       ↓
    Route
       ↓
    Controller
       ↓
    Service
       ↓
    Mongoose Model
       ↓
    MongoDB

Keep this separation when adding functionality.

---

# 14. Authentication Middleware

The authentication middleware is responsible for:

- reading Bearer token
- validating JWT
- validating issuer
- validating signing key
- validating audience
- attaching authenticated user to `req.user`

Protected routes must use this middleware.

Do not trust a user ID supplied directly by the frontend for ownership/security decisions.

---

# 15. User-Specific Database Access

Every user-owned document must be associated with the authenticated user.

Example:

    {
      userId: req.user.id,
      ...
    }

Queries must filter by authenticated user:

    Model.find({
      userId: req.user.id
    })

Do not do:

    Model.find({})

for user-owned financial data.

Do not do:

    Model.find({
      userId: req.body.userId
    })

for ownership/security decisions.

---

# 16. Controllers

Controllers should remain thin.

Typical flow:

    Controller
       ↓
    Validate request
       ↓
    Get authenticated user
       ↓
    Call service
       ↓
    Return response

Do not put large business logic directly into route definitions.

---

# 17. Services

Services contain reusable business logic.

Services should receive required IDs/data explicitly.

For example:

    getDashboardSummary(userId)

rather than internally assuming a particular user.

---

# 18. Routes

Routes define API endpoints and middleware.

Example:

    router.get(
      '/',
      requireAuth,
      asyncHandler(controller)
    )

Protected financial endpoints must require authentication.

---

# 19. Error Handling

Backend errors should flow through the central error handler.

Async controllers should use:

    asyncHandler()

Do not silently swallow backend errors.

Frontend API errors should also preserve useful backend messages where possible.

---

# 20. Environment Variables

Frontend environment variables use the VITE_ prefix.

Expected frontend variables include:

    VITE_API_URL
    VITE_KEYCLOAK_URL
    VITE_KEYCLOAK_REALM
    VITE_KEYCLOAK_CLIENT_ID
    VITE_KEYCLOAK_GOOGLE_IDP

Backend environment variables include:

    PORT
    MONGODB_URI
    FRONTEND_URL
    KEYCLOAK_URL
    KEYCLOAK_REALM
    KEYCLOAK_API_CLIENT_ID

Actual secrets must NEVER be committed to Git.

---

# 21. Never Commit Secrets

Never commit:

    .env
    .env.local
    Keycloak client secrets
    Google client secrets
    MongoDB passwords
    API keys
    access tokens
    refresh tokens

Use `.env.example` files containing placeholder values.

---

# 22. Team Ownership

Kartik:

- Core Architecture
- Authentication
- Keycloak/JWT
- Dashboard
- Profile
- Settings
- Common project foundation

Pranay:

- Transactions
- Categories

Prithvi:

- Budget
- Subscriptions

Soham:

- Reports
- Analytics
- Charts
- Graphs

Do not take over another member's business module unless the team explicitly agrees.

Cross-cutting authentication/security fixes are allowed when required for integration.

---

# 23. Module Ownership Rule

When modifying another member's module:

Prefer integration changes instead of rewriting their business logic.

Example:

Allowed:

    Add JWT protection to transaction route.

Not automatically allowed:

    Rewrite transaction CRUD logic.

---

# 24. AI Coding Rules

Any AI coding assistant working on SpendWise MUST follow these rules:

1. Read this document before modifying code.

2. Inspect the existing file before replacing it.

3. Preserve existing working functionality.

4. Make the smallest necessary change.

5. Do not rewrite large files merely to simplify them.

6. Do not remove existing UI functionality.

7. Do not create duplicate authentication systems.

8. Do not create duplicate theme systems.

9. Do not use shared/mock user IDs for authenticated user data.

10. Do not trust frontend-supplied user IDs for ownership.

11. Preserve Keycloak authentication.

12. Preserve user-specific MongoDB filtering.

13. Respect team module ownership.

14. Explain which files are being changed before making large modifications.

15. After modifying code, verify that existing functionality still works.

---

# 25. Before Making Changes

An AI assistant should first determine:

- What file currently implements the feature?
- Is the feature already working?
- Which team member owns it?
- Does the change affect authentication?
- Does the change affect user data isolation?
- Does the change affect Dashboard UI?
- Can the change be made without rewriting existing code?

---

# 26. Safe Development Principle

SpendWise is being developed incrementally.

Existing working functionality is more important than code simplification.

Prefer:

    Existing code
       +
    Minimal required change

over:

    Existing code
       ↓
    Complete rewrite

---

# 27. Current Completion Status

Kartik's assigned modules:

Core architecture       COMPLETE
Authentication           COMPLETE
Keycloak/JWT             COMPLETE
Protected routes         COMPLETE
Login                    COMPLETE
Google login             COMPLETE
Logout                   COMPLETE
Dashboard                COMPLETE
Profile                  COMPLETE
Settings                 COMPLETE

Remaining project work belongs primarily to the other module owners:

Transactions/Categories
Budget/Subscriptions
Reports/Analytics

---

# 28. Continuity Requirement

Before starting future work, preserve the existing architecture.

If a new feature requires architectural changes:

1. Explain why the change is required.
2. Identify affected files.
3. Preserve authentication.
4. Preserve user isolation.
5. Preserve existing UI.
6. Preserve other team members' modules.
7. Make the smallest safe change.