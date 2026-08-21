# SpendWise Architecture

## High-Level Architecture

```text
User
  |
  v
Vue.js 3 + Tailwind CSS + Glassmorphism
  |
  | REST API + JWT
  v
Node.js + Express.js
  |
  +----> MongoDB
  |
  +----> Authentication/Authorization through Keycloak
```

## Frontend

Vue.js 3 handles:

- User interface
- Routing
- Forms
- API communication
- Authentication state
- Dashboard and reports
- Chart.js visualizations

## Backend

Node.js + Express.js handles:

- REST API endpoints
- Business logic
- Validation
- Authentication middleware
- Database operations
- Error handling

## Database

MongoDB stores application data such as:

- Transactions
- Categories
- Budgets
- Subscriptions
- Application-specific user references

Passwords/authentication credentials are handled by Keycloak rather than being stored by the SpendWise application.

## Authentication

Keycloak handles authentication and authorization. After successful authentication, the client uses the JWT/access token when communicating with protected backend APIs.

## Module Ownership

- Member 1: Core architecture + Authentication
- Member 2: Transactions + Categories
- Member 3: Budget + Subscriptions
- Member 4: Dashboard + Reports
