# Development Guidelines

## Overview

This document defines the coding standards, architectural principles, and development practices that must be followed throughout the project.

The objective is to produce clean, maintainable, scalable, and production-ready code suitable for a Senior Software Developer technical interview.

---

# General Principles

Follow

- SOLID Principles
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple)
- Separation of Concerns
- Clean Architecture

Avoid

- Duplicate code
- Large classes
- Large functions
- Hardcoded values
- Business logic inside controllers

---

# TypeScript

Always use TypeScript.

Do not use

- any
- ts-ignore
- unnecessary type assertions

Prefer

- Interfaces
- Enums
- Utility Types
- Strict typing

Enable strict mode.

---

# Naming Conventions

## Variables

Use camelCase.

Example

productName

categoryId

totalRecords

---

## Functions

Use camelCase.

Examples

createProduct()

updateCategory()

generateReport()

---

## Classes

Use PascalCase.

Examples

ProductService

CategoryRepository

AuthController

---

## Interfaces

Prefix with I.

Examples

IProduct

ICategory

IUser

---

## Constants

Use UPPER_SNAKE_CASE.

Examples

DEFAULT_PAGE_SIZE

MAX_UPLOAD_SIZE

IMPORT_BATCH_SIZE

---

# Folder Responsibilities

## Controllers

Responsibilities

- Handle HTTP requests
- Validate request flow
- Call services
- Return responses

Controllers should never contain business logic.

---

## Services

Responsibilities

- Business logic
- Transactions
- Queue management
- Validation orchestration

Services should not directly access the database.

---

## Repositories

Responsibilities

- Database queries only

Repositories should never contain business logic.

---

## Validators

Responsibilities

- Validate request payloads
- Validate query parameters
- Validate route parameters

---

## Workers

Responsibilities

- Process BullMQ jobs
- Import CSV
- Generate Reports

Workers should reuse existing services whenever possible.

---

## Utilities

Responsibilities

Reusable helper functions.

Examples

- CSV Parser
- URL Validator
- File Helper
- Pagination Helper

Avoid placing business logic inside utilities.

---

# Database Guidelines

Use Sequelize ORM.

Always

- Use transactions where required.
- Use bulkCreate() for batch inserts.
- Use eager loading when appropriate.
- Avoid unnecessary queries.

Never

- Build raw SQL unnecessarily.
- Perform N+1 queries.

---

# Transactions

Transactions should be managed inside the Service layer.

Controllers should never create transactions.

Rules

- Start transaction only after CSV validation.
- Commit only after every batch succeeds.
- Rollback on any failure.

---

# Validation

Validate all incoming data.

Validation should occur before reaching business logic.

Use

- express-validator

Validation should include

- Body
- Params
- Query
- File Uploads

---

# Error Handling

Use centralized error handling middleware.

Do not wrap every controller with repetitive try/catch blocks.

Create reusable custom error classes where appropriate.

Examples

BadRequestError

UnauthorizedError

NotFoundError

ConflictError

InternalServerError

---

# Logging

Log

- Application startup
- API requests
- Authentication failures
- Import started
- Import completed
- Import failed
- Unexpected errors

Never log

- Passwords
- JWT Tokens
- Sensitive information

Use structured and readable log messages.

---

# Environment Variables

Store all configuration in environment variables.

Examples

PORT

DATABASE_URL

JWT_SECRET

REDIS_HOST

REDIS_PORT

UPLOAD_DIRECTORY

Never commit secrets to Git.

Provide a .env.example file.

---

# File Upload

Accept only CSV files.

Validate

- Extension
- MIME Type
- File Size

Store uploaded files in

uploads/imports

Generated reports

uploads/reports

Error CSV

uploads/errors

Sample template

uploads/templates

---

# Code Style

Functions should

- Have a single responsibility.
- Be easy to read.
- Be reusable.

Prefer

Early returns

Instead of deeply nested if statements.

---

# Comments

Write self-explanatory code.

Use comments only when necessary.

Avoid obvious comments.

Bad

// Increment i

i++;

Good

// Roll back the transaction to maintain data consistency.

---

# Async Programming

Always use

async / await

Avoid nested Promise chains.

Always handle async errors properly.

---

# API Responses

Every API should follow the standard response format.

Never return inconsistent JSON structures.

---

# Reusable Components

Frontend components should be reusable whenever possible.

Examples

- Confirmation Dialog
- Loading Spinner
- Search Input
- Pagination Component
- Snackbar Service

Avoid duplicate UI implementations.

---

# Angular Best Practices

Use

- Feature Modules
- Services
- Reactive Forms
- Route Guards
- HTTP Interceptors

Avoid

- Business logic inside components
- Direct HTTP calls inside multiple components

---

# Security

Always

- Hash passwords using bcrypt
- Validate JWT
- Validate uploaded files
- Sanitize input
- Use Sequelize parameterized queries

Never

- Expose stack traces
- Return sensitive data
- Store plaintext passwords

---

# Performance

Prefer

- Server-side pagination
- Streaming CSV
- Batch inserts
- Background jobs
- Efficient database indexing

Avoid

- Loading large files into memory
- Blocking the event loop
- Long-running HTTP requests

---

# Git Guidelines

Use meaningful commit messages.

Examples

feat: implement product CRUD

feat: add BullMQ import worker

feat: implement report generation

fix: validate CSV headers

refactor: move business logic to service layer

Avoid generic commit messages such as

update

changes

fix

---

# README

The project README should include

- Project Overview
- Technology Stack
- Installation Steps
- Environment Variables
- Running the Backend
- Running the Frontend
- Running Redis
- Database Migration
- API Documentation
- Postman Collection
- Project Structure

---

# Code Quality Checklist

Before completing any feature, verify

- No TypeScript errors
- No ESLint errors
- No duplicated code
- Proper validation
- Proper error handling
- Proper logging
- Proper typing
- Proper API responses
- Clean architecture maintained

---

# Final Development Goal

Every piece of code should be written with the mindset that it will be reviewed during a Senior Software Developer technical interview.

The implementation should prioritize

- Readability
- Maintainability
- Scalability
- Testability
- Consistency
- Production readiness

Over writing the shortest or fastest solution.