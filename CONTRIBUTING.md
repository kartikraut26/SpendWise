# Contributing to SpendWise

## Team Rule

Each member works on an assigned feature branch. Do not directly modify another member's module unless the change is required for integration and has been discussed with the team.

## Branches

Use:

- `main` – stable/project submission version
- `develop` – integration branch
- `feature/auth`
- `feature/transactions`
- `feature/budget-subscriptions`
- `feature/dashboard-reports`

## Commit Format

Use clear commit messages:

```text
feat: add transaction creation API
feat: add Keycloak authentication
fix: resolve budget calculation issue
style: update glassmorphism card
docs: update API documentation
refactor: simplify transaction service
```

## Pull Requests

Before merging:

1. Test the feature locally.
2. Check that existing functionality still works.
3. Keep the change limited to the assigned feature.
4. Update documentation when the API or architecture changes.
5. Explain what was changed in the pull request.

## Integration Rule

If a feature requires a change to another member's module, discuss it before modifying that module.
