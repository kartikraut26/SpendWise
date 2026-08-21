# SpendWise Development Guide

## Development Principles

1. Follow the approved project architecture.
2. Keep frontend and backend responsibilities separate.
3. Reuse existing components and services.
4. Avoid adding libraries without team agreement.
5. Protect all user-specific backend resources.
6. Keep API and database naming consistent.
7. Update documentation when behavior or architecture changes.
8. Test a feature before opening a pull request.

## Environment Variables

Never commit real secrets.

Use:

```text
.env
```

locally and maintain:

```text
.env.example
```

with placeholders.

## AI-Assisted Development

AI tools may be used for implementation, debugging, refactoring, and documentation.

AI-generated code must still be:

- Reviewed by the developer
- Tested locally
- Consistent with the existing architecture
- Free from hardcoded secrets
- Limited to the requested feature

AI tools must not rewrite unrelated modules without approval.
