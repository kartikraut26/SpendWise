# SpendWise — Team Module Ownership

## Kartik

### Core Architecture + Authentication + Dashboard

Responsible for:

- Vue.js foundation
- Tailwind CSS
- Glassmorphism design system
- Vue Router
- Node.js + Express
- MongoDB connection
- REST API architecture
- Environment configuration
- Common components/layout
- Git/GitHub structure
- Documentation
- Keycloak
- Keycloak realm/client configuration
- JWT authentication
- Protected routes
- Authentication middleware
- Login/logout
- User Profile
- Settings
- Dashboard

---

## Pranay

### Transactions + Categories

Responsible for:

### Transactions

- Create transaction
- Edit transaction
- Delete transaction
- Income/Expense
- Category assignment
- Search
- Filter
- Sort by date

### Categories

- Create category
- Edit category
- Delete category
- Income categories
- Expense categories

Authentication/security integration may be handled with Kartik where required.

---

## Prithvi

### Budget + Subscriptions

Responsible for:

### Budget

- Create monthly budget
- Edit/delete budget
- Track budget usage
- Allocated budget
- Remaining budget
- Budget alerts

### Subscriptions

- Add subscription
- Edit/delete subscription
- Monthly/yearly billing
- Next payment date
- Monthly cost
- Annual cost

---

## Soham

### Reports + Analytics

Responsible for:

- Expense by category
- Income vs expense
- Monthly expense breakdown
- Charts
- Graphs

Analytics should consume appropriate application data rather than implementing duplicate transaction systems.

---

# Integration Rule

All modules must work with:

- Keycloak authentication
- JWT-protected APIs
- authenticated user identity
- user-specific MongoDB data

A module must never expose another user's financial information.

---

# Shared Development Rule

Do not replace another member's completed module without discussion.

Prefer small integration changes.

If authentication middleware needs to be added to another member's route, that is an integration/security change and should not require rewriting the module's business logic.