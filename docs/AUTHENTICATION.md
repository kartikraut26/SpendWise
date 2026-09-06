# SpendWise — Authentication Guide

## Authentication Provider

SpendWise uses Keycloak.

Realm:

    spendwise

Frontend client:

    spendwise-frontend

Backend API client/audience:

    spendwise-api

---

# Frontend Authentication

The frontend uses `keycloak-js`.

Main files:

    frontend/src/services/keycloak.js
    frontend/src/stores/auth.js

---

# Login

Normal login:

```js
auth.login()