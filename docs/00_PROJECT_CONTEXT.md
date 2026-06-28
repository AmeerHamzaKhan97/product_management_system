# Product Management System

# Project Context

## Project Overview

This project is a technical assessment to demonstrate the ability to design and develop a production-ready full-stack application using modern software engineering principles.

The objective is not only to complete the functional requirements but also to demonstrate clean architecture, scalability, maintainability, performance optimization, and professional coding standards.

The application should be written as if it were intended for production deployment.

---

# Assignment Requirements

Develop a Product Management System using the following technologies.

Frontend

- Angular
- Angular Material

Backend

- Node.js
- Express
- TypeScript

Database

- PostgreSQL

The application must support

- User Authentication
- User CRUD
- Category CRUD
- Product CRUD
- Bulk Product Upload
- Product Report Generation

---

# Project Goals

The completed application should demonstrate

- Clean Architecture
- Separation of Concerns
- SOLID Principles
- Reusable Components
- Modular Design
- Scalable Codebase
- Secure Authentication
- Efficient Database Design
- Background Job Processing
- Proper Error Handling
- Good User Experience

The final code should be suitable for a technical interview code review.

---

# Technology Stack

Frontend

- Angular
- Angular Material
- RxJS

Backend

- Node.js
- Express
- TypeScript

Database

- PostgreSQL
- Sequelize ORM

Authentication

- JWT
- bcrypt

Queue

- BullMQ

Queue Storage

- Redis

File Upload

- Multer

CSV Processing

- Stream-based CSV Parser

Validation

- express-validator

Environment Configuration

- dotenv

---

# Architecture Decisions (Locked)

The following decisions are final.

Claude must not change these decisions without approval.

## Backend

Node.js

Express

TypeScript

---

## Frontend

Angular

Angular Material

---

## Database

PostgreSQL

Sequelize ORM

---

## Authentication

JWT Authentication

Password hashing using bcrypt.

---

## Queue

BullMQ

Redis

All long-running tasks must execute through BullMQ.

---

## Upload Format

Only CSV files are supported.

Excel (.xlsx) files are intentionally not supported.

Reason

CSV files

- are lightweight
- can be streamed
- require less memory
- are ideal for bulk imports

---

## Report Format

Product reports should be generated as CSV files.

---

# Bulk Upload Strategy

The application must never process large CSV uploads inside the HTTP request.

Instead

Upload Request

↓

Store CSV

↓

Create Import Job

↓

Return HTTP 202 Accepted

↓

BullMQ Worker

↓

Validate CSV

↓

Insert Data

This prevents HTTP timeout errors.

---

# Database Strategy

The application should follow an All-or-Nothing import strategy.

Workflow

1. Read CSV using streaming.

2. Validate every row.

3. If validation fails

- Stop processing.
- Generate Error CSV.
- Mark Job Failed.
- Do not insert any records.

4. If validation succeeds

- Open a database transaction.
- Insert products using batch inserts.
- Commit transaction.

5. If insertion fails

Rollback the complete transaction.

No partial product import is allowed.

---

# Batch Processing

Database inserts should be performed in batches.

Recommended batch size

500 records

Reason

- Better performance
- Lower memory usage
- Reduced database overhead

---

# Background Jobs

BullMQ should be used for

- Product Import
- Product Report Generation

Each job should support

- Pending
- Processing
- Completed
- Failed

Progress tracking should be available.

---

# CSV Import Format

Uploaded CSV should contain exactly four columns.

| Column |
|----------|
| Product Name |
| Category |
| Price |
| Image URL |

Column order is mandatory.

Header names are mandatory.

Additional columns are not allowed.

Missing columns are not allowed.

---

# CSV Template

The backend should contain a sample CSV template.

The frontend should provide a button

Download Sample Template

Clicking the button downloads the sample CSV.

The sample CSV should contain only the headers.

Example

Product Name,Category,Price,Image URL

---

# Error CSV

If validation fails

Generate an Error CSV.

The Error CSV should contain

| Column |
|----------|
| Row Number |
| Product Name |
| Category |
| Price |
| Image URL |
| Product Name Error |
| Category Error |
| Price Error |
| Image URL Error |

Example

| Row | Product Name | Category | Price | Image URL | Product Name Error | Category Error | Price Error | Image URL Error |
|------|--------------|-----------|-------|-----------|-------------------|----------------|-------------|----------------|
|1|1-!@#|123|abc|123|Special characters are not allowed|Category does not exist|Price must be a valid number|Image URL must be a valid URL|

Each field should contain only its own validation message.

If a field is valid

Leave its error column empty.

---

# Product Report

The user should be able to download a product report.

The generated report must respect the current filters.

Examples

If user searches

Bag

The report should contain only matching products.

If user filters by category

Electronics

The report should contain only Electronics.

If user sorts by Price Ascending

The generated report should also be sorted in ascending order.

Pagination should NOT affect report generation.

The report should contain every matching record.

---

# UI Expectations

The application should look modern and professional.

Use Angular Material components wherever appropriate.

Avoid a basic assignment-style UI.

The application should include

- Professional Login Screen
- Responsive Layout
- Material Table
- Material Dialog
- Material Icons
- Material Tooltip
- Material Snackbar
- Loading Indicators
- Empty States
- Confirmation Dialogs

The UI should provide a good user experience.

---

# Project Deliverables

The completed project should include

- Angular Application
- Node.js Backend
- PostgreSQL Database
- Postman Collection
- README
- Sample CSV Template
- Complete Source Code

---

# Expected Documentation

Before implementation begins

Claude should generate

- USER_STORIES.md
- IMPLEMENTATION_PLAN.md

Implementation should only begin after these documents are approved.

---

# Success Criteria

The project will be considered complete when

- All assignment requirements are implemented.
- The application is production-ready.
- Code follows clean architecture.
- Long-running operations use BullMQ.
- CSV imports support validation and rollback.
- Reports are generated in the background.
- APIs follow REST standards.
- The UI is responsive and professional.
- The project is easy to understand during a technical interview.

---

# AI Instructions

Claude must treat this document as the primary source of truth.

If any future instruction conflicts with this document

Stop and ask for clarification.

Do not assume requirements.

Do not implement additional features unless requested.

Generate clean, modular, production-quality code suitable for a Senior Software Developer technical interview.