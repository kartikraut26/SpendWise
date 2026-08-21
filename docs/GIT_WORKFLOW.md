# SpendWise Git Workflow

## Branch Strategy

```text
main
  |
develop
  |
  +-- feature/auth
  +-- feature/transactions
  +-- feature/budget-subscriptions
  +-- feature/dashboard-reports
```

## Workflow

```text
Create/update feature branch
        |
        v
Develop and test locally
        |
        v
Commit changes
        |
        v
Push branch
        |
        v
Pull Request
        |
        v
Review + integration test
        |
        v
Merge into develop
        |
        v
Stable release -> main
```

## Rules

- Do not force-push shared branches.
- Do not commit `.env` files or secrets.
- Pull/rebase the latest integration changes before major merges.
- Keep commits focused.
- Avoid committing generated dependencies such as `node_modules`.
- Resolve conflicts carefully and test after resolving them.
