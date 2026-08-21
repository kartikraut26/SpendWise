# SpendWise Authentication

## Technology

- Keycloak
- JWT
- Vue.js 3
- Node.js + Express.js

## Authentication Flow

```text
User
  |
  v
Vue.js
  |
  v
Keycloak
  |
  | Successful authentication
  v
JWT / Access Token
  |
  v
Vue.js
  |
  | Authorization: Bearer <token>
  v
Express.js
  |
  | Verify token
  v
Protected API
```

## Responsibilities

### Keycloak

- User authentication
- Login/logout
- User identity
- Roles/authorization configuration

### Vue.js

- Start the login flow
- Maintain authentication state
- Attach the access token to API requests
- Protect frontend routes

### Express.js

- Validate the JWT
- Protect API routes
- Identify the authenticated user
- Restrict data access to the authenticated user

## Important Rule

The backend is the security boundary. Frontend route protection alone is not sufficient.

## Configuration

Secrets and environment-specific configuration must remain outside Git. Use `.env` locally and provide `.env.example` with placeholder values.
