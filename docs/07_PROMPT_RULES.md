# Claude Code Implementation Rules

## Overview

This document defines the mandatory rules Claude Code must follow throughout the implementation of this project.

These rules exist to ensure the generated code is consistent, maintainable, production-ready, and follows the project architecture.

If any instruction conflicts with another document, stop implementation and request clarification instead of making assumptions.

---

# Implementation Workflow

Claude must follow the implementation workflow below.

1. Read every document inside the `docs` directory.
2. Generate `USER_STORIES.md`.
3. Wait for approval.
4. Generate `IMPLEMENTATION_PLAN.md`.
5. Wait for approval.
6. Implement one phase at a time.
7. Wait for approval before moving to the next phase.

Never skip any phase.

---

# Before Writing Code

Before implementing any feature

- Read the relevant documentation.
- Understand dependencies.
- Verify business rules.
- Verify API standards.
- Verify UI requirements.

Do not start coding immediately.

---

# Architecture Rules

Do not change

- Technology Stack
- Folder Structure
- API Response Format
- Database Strategy
- Transaction Strategy
- BullMQ Architecture
- Authentication Strategy

without approval.

---

# Code Generation Rules

Generate production-quality code.

Avoid

- Placeholder methods
- TODO comments
- Dummy implementations
- Mock services unless explicitly requested

Every generated file should be complete.

---

# Incremental Development

Implement only the approved phase.

Do not implement future phases.

Example

If the current phase is Authentication

Do not generate Product CRUD.

Do not generate Category CRUD.

Do not generate CSV Upload.

---

# Clean Code Rules

Every implementation should

- Follow SOLID principles
- Avoid duplicate logic
- Use meaningful naming
- Keep methods focused
- Keep classes focused

Business logic must never exist inside controllers.

---

# Backend Rules

Controllers

- Receive requests
- Validate flow
- Call services
- Return responses

Services

- Business logic
- Transactions
- Queue interaction

Repositories

- Database operations only

Workers

- Background jobs only

---

# Frontend Rules

Components should

- Be small
- Be reusable
- Use Reactive Forms
- Avoid duplicated code

Business logic should live inside services whenever appropriate.

---

# Database Rules

Always

- Use Sequelize
- Use transactions
- Use bulkCreate for imports
- Use eager loading where appropriate

Never

- Perform unnecessary queries
- Create long-running transactions
- Load entire CSV files into memory

---

# CSV Import Rules

CSV processing must

- Use streaming
- Validate every row
- Generate Error CSV when validation fails
- Roll back the entire transaction if insertion fails

Never perform partial imports.

---

# BullMQ Rules

BullMQ must be used for

- Product Import
- Product Report Generation

Never process long-running tasks inside HTTP requests.

---

# Validation Rules

Always validate

- Request body
- Request params
- Query params
- Uploaded files

Never trust frontend validation.

---

# Error Handling Rules

Use centralized error handling.

Return consistent API responses.

Never expose

- Stack traces
- Database errors
- Internal implementation details

---

# Logging Rules

Log

- Application startup
- Login attempts
- Import started
- Import completed
- Import failed
- Unexpected exceptions

Never log

- Passwords
- JWT tokens
- Sensitive information

---

# Security Rules

Always

- Hash passwords using bcrypt
- Validate JWT
- Validate uploaded files
- Sanitize user input

Never

- Store plaintext passwords
- Return sensitive data
- Commit secrets to Git

---

# UI Rules

The application should look like a professional admin dashboard.

Use Angular Material components.

Include

- Loading indicators
- Tooltips
- Snackbars
- Confirmation dialogs
- Responsive layout
- Empty states

Avoid a basic CRUD assignment appearance.

---

# Git Rules

Write code that can be committed after every completed phase.

Each phase should leave the application in a working state.

Avoid breaking the project between phases.

---

# Documentation Rules

Whenever a significant architectural or setup change is made

Update

- README.md
- API documentation
- Environment variable documentation

Do not leave documentation outdated.

---

# Quality Checklist

Before marking any phase as complete

Verify

- Project builds successfully
- No TypeScript errors
- No ESLint errors
- No duplicate code
- Validation works
- Error handling works
- API responses follow standards
- UI matches the specification
- Business rules are satisfied

---

# Definition of Complete

A phase is considered complete only if

- All acceptance criteria are implemented.
- Code builds successfully.
- Code follows project architecture.
- Documentation is updated if necessary.
- No placeholder code remains.
- The application is ready for review.

Do not proceed to the next phase until the current phase is complete and approved.