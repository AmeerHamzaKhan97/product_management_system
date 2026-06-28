# Product Management System Documentation

Welcome to the Product Management System documentation.

This project is being developed using an AI-assisted workflow. Every document inside this folder has a specific responsibility and should be read in order before implementation begins.

---

# Documentation Order

Read the documents in the following sequence.

1. 00_PROJECT_CONTEXT.md
2. 01_ARCHITECTURE.md
3. 02_FUNCTIONAL_REQUIREMENTS.md
4. 03_UI_UX_SPECIFICATION.md
5. 04_BULK_UPLOAD_SPECIFICATION.md
6. 05_API_STANDARDS.md
7. 06_DEVELOPMENT_GUIDELINES.md
8. 07_PROMPT_RULES.md

---

# Purpose of Each Document

## 00_PROJECT_CONTEXT.md

Provides the overall project context, assignment requirements, technology stack, objectives, and fixed architectural decisions.

This is the primary source of truth for the project.

---

## 01_ARCHITECTURE.md

Describes the complete technical architecture including backend, frontend, database, authentication, BullMQ workflow, Redis integration, storage strategy, and design principles.

---

## 02_FUNCTIONAL_REQUIREMENTS.md

Defines all functional requirements including authentication, CRUD operations, product listing, bulk upload, report generation, and business rules.

---

## 03_UI_UX_SPECIFICATION.md

Defines every screen, component, dialog, table, button, tooltip, loading state, and user interaction expected in the application.

---

## 04_BULK_UPLOAD_SPECIFICATION.md

Contains the detailed CSV import specification including:

- CSV structure
- Validation rules
- Error CSV format
- BullMQ workflow
- Transaction strategy
- Batch processing
- Import history
- Progress tracking

---

## 05_API_STANDARDS.md

Defines REST API conventions including:

- Response format
- Error responses
- HTTP status codes
- Pagination
- Sorting
- Searching
- Authentication

---

## 06_DEVELOPMENT_GUIDELINES.md

Defines coding standards, clean architecture principles, naming conventions, repository pattern, logging strategy, and best practices.

---

## 07_PROMPT_RULES.md

Contains AI-specific instructions for Claude Code.

Claude must follow these instructions throughout the project implementation.

---

# AI Workflow

Before writing any implementation code:

1. Read every document in this folder.
2. Generate USER_STORIES.md.
3. Wait for approval.
4. Generate IMPLEMENTATION_PLAN.md.
5. Wait for approval.
6. Implement one phase at a time.
7. Never change architecture decisions without approval.

---

# Goal

The objective is to build an interview-quality, production-ready Product Management System that demonstrates clean architecture, scalability, maintainability, and modern software engineering practices.