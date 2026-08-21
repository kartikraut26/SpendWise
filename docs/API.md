# SpendWise REST API

## API Convention

Base path:

```text
/api
```

## Authentication

Protected requests use the access token issued through Keycloak.

```text
Authorization: Bearer <JWT>
```

## Planned Endpoints

### Transactions

```text
GET    /api/transactions
POST   /api/transactions
PUT    /api/transactions/:id
DELETE /api/transactions/:id
```

### Categories

```text
GET    /api/categories
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id
```

### Budgets

```text
GET    /api/budgets
POST   /api/budgets
PUT    /api/budgets/:id
DELETE /api/budgets/:id
```

### Subscriptions

```text
GET    /api/subscriptions
POST   /api/subscriptions
PUT    /api/subscriptions/:id
DELETE /api/subscriptions/:id
```

### Dashboard / Reports

```text
GET /api/dashboard/summary
GET /api/reports/expenses
GET /api/reports/monthly
```

## API Rules

- Validate request data.
- Authenticate protected requests.
- Return consistent HTTP status codes.
- Never expose sensitive authentication information.
- Ensure users can access only their own application data.
