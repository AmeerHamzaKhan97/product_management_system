# System Architecture

## Overview

The application follows a layered architecture that promotes:

- Separation of Concerns
- Maintainability
- Testability
- Scalability
- Reusability

Business logic must never exist inside controllers.

---

# High Level Architecture

```

Angular Frontend

↓

REST API

↓

Express Application

↓

Middleware

↓

Controllers

↓

Services

↓

Repositories

↓

Sequelize ORM

↓

PostgreSQL

Background Jobs

↓

BullMQ

↓

Redis

```

---

# Architecture Principles

The project should follow

- SOLID Principles
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple)
- Single Responsibility Principle
- Clean Architecture
- Modular Design

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

CSV

- Stream-based parser

Validation

- express-validator

---

# Backend Architecture

```

Client

↓

Routes

↓

Validation Middleware

↓

Authentication Middleware

↓

Controller

↓

Service

↓

Repository

↓

Database

```

Responsibilities

Routes

- Register endpoints

Middleware

- Authentication
- Validation
- Error handling

Controllers

- Receive request
- Call service
- Return response

Services

- Business logic
- Transactions
- Queue handling

Repositories

- Database operations only

Models

- Sequelize models

Workers

- BullMQ processing

Utilities

- Common reusable functions

---

# Backend Folder Structure

```

backend/

src/

config/

controllers/

middlewares/

models/

repositories/

routes/

services/

validators/

queues/

workers/

utils/

types/

constants/

uploads/

templates/

imports/

errors/

reports/

```

---

# Frontend Architecture

Feature-based architecture.

```

frontend/

src/

app/

core/

shared/

features/

authentication/

products/

categories/

dashboard/

import/

report/

layout/

services/

models/

guards/

interceptors/

```

---

# Database Tables

The application should contain the following tables.

---

## Users

Fields

- id
- email
- password
- createdAt
- updatedAt

---

## Categories

Fields

- id
- uniqueId
- name
- createdAt
- updatedAt

Rules

- Category Name must be unique.

---

## Products

Fields

- id
- uniqueId
- name
- imageUrl
- price
- categoryId
- createdAt
- updatedAt

Relationships

Many Products

↓

One Category

---

## Import Jobs

Fields

- id
- jobId
- fileName
- status
- totalRows
- processedRows
- successfulRows
- failedRows
- errorCsvPath
- createdBy
- createdAt
- completedAt

Purpose

Tracks every import operation.

---

# Entity Relationship

```

Category

↓

1

↓

∞

Product

User

↓

1

↓

∞

ImportJob

```

---

# Authentication Flow

```

Login

↓

Validate Email

↓

Compare Password

↓

Generate JWT

↓

Return Token

↓

Frontend Stores Token

↓

Protected APIs

↓

JWT Middleware

↓

Access Granted

```

---

# Authorization

All APIs except Login should require JWT authentication.

Unauthenticated requests should return

401 Unauthorized

---

# Queue Architecture

BullMQ should be responsible for

- Product Import
- Report Generation

```

API

↓

BullMQ Queue

↓

Redis

↓

Worker

↓

Database

```

---

# Import Workflow

```

Upload CSV

↓

Validate File Type

↓

Store File

↓

Create Import Job

↓

Push Job to Queue

↓

Return HTTP 202

↓

Worker

↓

Read CSV Stream

↓

Validate Rows

↓

Validation Passed ?

↓

No

↓

Generate Error CSV
(5-column format: Row Number, Product Name, Category, Price, Image URL;
 failing field cells contain only the error message; passing field cells are empty)

↓

Update Import Job

↓

Completed

↓

Yes

↓

Open Transaction

↓

Batch Insert

↓

Commit

↓

Update Import Job

```

---

# Transaction Strategy

The database transaction should begin only after every CSV row has passed validation.

Reason

Avoid keeping long-running database transactions open.

If any insert fails

Rollback the complete transaction.

Database consistency is mandatory.

---

# Batch Insert Strategy

Insert records in batches.

Recommended batch size

500

Example

Batch 1

Rows 1-500

↓

Insert

↓

Batch 2

Rows 501-1000

↓

Insert

↓

Commit

---

# File Storage

Use the following structure.

```

uploads/

templates/

sample-products.csv

imports/

uploaded-file.csv

errors/

error-report.csv

reports/

products-report.csv

```

Temporary files should be cleaned after processing where appropriate.

---

# Logging Strategy

Log

- Authentication failures
- Import started
- Import completed
- Import failed
- Queue failures
- Unexpected errors

Do not log

- Passwords
- JWT
- Sensitive information

---

# Exception Handling

Centralized error handling middleware should be used.

Every API should return a consistent error format.

---

# Configuration

All configuration should use environment variables.

Examples

- Database URL
- JWT Secret
- Redis URL
- Port
- Upload Path

Never hardcode configuration.

---

# Performance Considerations

Use

- Streaming CSV parsing
- Batch inserts
- Server-side pagination
- Background workers
- Efficient database indexing

Avoid

- Reading the full CSV into memory
- N+1 database queries
- Blocking the event loop
- Long-running HTTP requests

---

# Scalability

The architecture should allow future support for

- Multiple BullMQ workers
- Multiple backend instances
- Cloud storage (AWS S3)
- Docker deployment
- Kubernetes deployment
- Report scheduling

The current implementation does not need these features but should be designed so they can be added with minimal changes.

---

# Future Improvements

The architecture should be flexible enough to support

- Role-Based Access Control (RBAC)
- Audit Logs
- Email Notifications
- Product Image Upload
- Excel Import (.xlsx)
- Multi-Tenant Support

These features are outside the scope of this assignment.

---

# Definition of Good Architecture

The final implementation should demonstrate

- Modular code
- Clear separation of responsibilities
- Reusable components
- Minimal coupling
- High cohesion
- Easy testing
- Easy maintenance
- Production-ready structure