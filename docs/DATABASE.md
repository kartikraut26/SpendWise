# SpendWise Database Design

## Database

MongoDB

## Planned Collections

### users / user references

Application data should be associated with the authenticated Keycloak user identifier.

### transactions

Planned fields:

```text
_id
userId
type
amount
description
categoryId
date
createdAt
updatedAt
```

`type` will represent income or expense.

### categories

```text
_id
userId
name
type
createdAt
updatedAt
```

`type` will distinguish income and expense categories.

### budgets

```text
_id
userId
categoryId
amount
month
year
createdAt
updatedAt
```

### subscriptions

```text
_id
userId
name
amount
category
billingCycle
startDate
nextPaymentDate
status
createdAt
updatedAt
```

## Data Ownership

Every user-specific record must be associated with the authenticated user's identity. Backend APIs must not trust a user ID supplied freely by the frontend when determining ownership.
