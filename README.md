# Product Management System

A production-ready full-stack web application for managing product categories, products, bulk CSV imports, and CSV report generation. Built with Angular 21, Node.js/Express, TypeScript, PostgreSQL, and BullMQ.

---

## Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend | Angular + Angular Material + RxJS | 21 |
| Backend | Node.js + Express + TypeScript | Express 5, TS 6 |
| Database | PostgreSQL + Sequelize ORM | Sequelize 6 |
| Authentication | JWT (jsonwebtoken) + bcryptjs | — |
| Background Jobs | BullMQ + ioredis | BullMQ 5 |
| File Upload | Multer | 2 |
| Validation | express-validator | 7 |
| HTTP Security | Helmet + CORS | — |

---

## Features

- **JWT Authentication** — Secure login; all non-auth routes protected by Bearer token
- **Category Management** — Full CRUD with auto-generated unique IDs (`CAT-0001`)
- **Product Management** — Full CRUD with server-side pagination, search, and sort
- **Bulk CSV Import** — Upload a CSV; BullMQ worker validates every row, inserts in 500-row batches inside a transaction, generates an error CSV on validation failure
- **CSV Report Generation** — Background-generated product report scoped to current search/sort filters
- **Import History** — View all past import jobs with status chips and error report download
- **Responsive Angular Material UI** — Works on desktop, tablet, and mobile

---

## Prerequisites

| Requirement | Minimum Version |
|---|---|
| Node.js | 18 LTS |
| npm | 9 |
| PostgreSQL | 14 |
| Redis | 7 |
| Angular CLI | 21 (`npm install -g @angular/cli`) |

---

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd product_management_system
```

### 2. Configure environment variables

```bash
cd backend
cp ../.env.example .env
```

Open `backend/.env` and set your local values — at minimum:

```
DB_USER=postgres
DB_PASSWORD=<your-pg-password>
DB_NAME=product_management_db
JWT_SECRET=<strong-random-string-32-chars-min>
```

### 3. Create the PostgreSQL database

```bash
psql -U postgres -c "CREATE DATABASE product_management_db;"
```

### 4. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend (from repo root)
cd ../frontend
npm install
```

### 5. Run database migrations and seed

```bash
cd backend
npm run db:migrate   # Creates all tables
npm run db:seed      # Creates the admin user
```

### 6. Start the backend

```bash
cd backend
npm run dev          # Starts Express on http://localhost:3000
```

### 7. Start the frontend

```bash
cd frontend
ng serve             # Opens http://localhost:4200
```

---

## Default Credentials

| Field | Value |
|---|---|
| Email | `admin@example.com` |
| Password | `Admin@1234` |

> This is the only user in the system. There is no self-registration.

---

## Backend Scripts

```bash
npm run dev              # Start development server (nodemon + ts-node)
npm run build            # Compile TypeScript → dist/
npm run start            # Run compiled production build
npm run db:migrate       # Apply all Sequelize migrations
npm run db:migrate:undo  # Roll back all migrations
npm run db:seed          # Seed the admin user
npm run lint             # ESLint (TypeScript rules)
npm run format           # Prettier format
```

---

## Environment Variables

All variables are defined in `backend/.env` (copied from `.env.example` at the repo root).

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | Express server port |
| `NODE_ENV` | `development` | `development` or `production` |
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_NAME` | `product_management_db` | Database name |
| `DB_USER` | `postgres` | Database user |
| `DB_PASSWORD` | _(required)_ | Database password |
| `DB_DIALECT` | `postgres` | Sequelize dialect |
| `JWT_SECRET` | _(required)_ | Secret key for signing JWTs — use a strong random string |
| `JWT_EXPIRES_IN` | `8h` | JWT lifetime |
| `REDIS_HOST` | `localhost` | Redis host |
| `REDIS_PORT` | `6379` | Redis port |
| `REDIS_PASSWORD` | _(empty)_ | Redis password (leave blank if none) |
| `UPLOAD_DIR` | `uploads` | Root directory for uploaded/generated files |
| `MAX_FILE_SIZE_MB` | `10` | Maximum CSV upload size in MB |
| `BCRYPT_ROUNDS` | `12` | bcrypt cost factor for password hashing |

---

## Project Structure

```
product_management_system/
├── backend/
│   ├── src/
│   │   ├── config/          # Database, Redis, and env validation
│   │   ├── constants/        # BATCH_SIZE, PAGE_SIZE, etc.
│   │   ├── controllers/      # Thin HTTP handlers
│   │   ├── middlewares/      # Auth, error handler, Multer upload
│   │   ├── models/           # Sequelize models (User, Category, Product, ImportJob)
│   │   ├── queues/           # BullMQ queue instances
│   │   ├── repositories/     # Database access layer
│   │   ├── routes/           # Express routers mounted under /api/v1
│   │   ├── services/         # Business logic
│   │   ├── types/            # Shared TypeScript interfaces & custom errors
│   │   ├── utils/            # CSV parser/writer, pagination, response helpers
│   │   ├── validators/       # express-validator rule chains
│   │   ├── workers/          # BullMQ processors (import, report)
│   │   └── app.ts            # Express app factory
│   ├── migrations/           # Sequelize migration files
│   ├── seeders/              # Admin user seeder
│   ├── uploads/
│   │   ├── templates/        # sample-products.csv
│   │   ├── imports/          # Uploaded CSV files (git-ignored)
│   │   ├── errors/           # Error CSV files (git-ignored)
│   │   └── reports/          # Generated report files (git-ignored)
│   └── server.ts             # Entry point
├── frontend/
│   └── src/app/
│       ├── core/             # Auth service, token service, guards, interceptors
│       ├── shared/           # Reusable components (spinner, confirm dialog) & snackbar service
│       ├── features/
│       │   ├── auth/         # Login page
│       │   ├── layout/       # Main toolbar + router outlet
│       │   ├── categories/   # Category list + dialog
│       │   ├── products/     # Product list + dialog + import banner
│       │   └── import/       # Upload dialog + import history
│       └── models/           # TypeScript interfaces
├── postman/                  # Postman collection + environment
├── docs/                     # Architecture and specification documents
├── .env.example              # Environment variable template
└── README.md
```

---

## API Reference

All endpoints are prefixed with `/api/v1`. All routes except `POST /auth/login` require `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/login` | Login — returns JWT |
| `GET` | `/categories` | List all categories |
| `GET` | `/categories/:id` | Get category by ID |
| `POST` | `/categories` | Create category |
| `PUT` | `/categories/:id` | Update category |
| `DELETE` | `/categories/:id` | Delete category |
| `GET` | `/products` | List products (paginated, searchable, sortable) |
| `GET` | `/products/:id` | Get product by ID |
| `POST` | `/products` | Create product |
| `PUT` | `/products/:id` | Update product |
| `DELETE` | `/products/:id` | Delete product |
| `POST` | `/products/import` | Upload CSV for bulk import → returns `jobId` (202) |
| `GET` | `/products/import/history` | List all import jobs |
| `GET` | `/products/import/status/:jobId` | Poll import job status |
| `GET` | `/products/import/error/:jobId` | Download error CSV for a failed import |
| `GET` | `/products/import/template` | Download sample CSV template |
| `GET` | `/products/report` | Start background report generation → returns `jobId` (202) |
| `GET` | `/products/report/:jobId/status` | Poll report job status |
| `GET` | `/products/report/:jobId/download` | Download completed report CSV |

### Pagination query parameters (`GET /products`)

| Parameter | Default | Description |
|---|---|---|
| `page` | `1` | Page number |
| `pageSize` | `10` | Records per page (max 100) |
| `search` | — | Case-insensitive search on product name or category name |
| `sortBy` | `createdAt` | `name` \| `price` \| `createdAt` |
| `sortOrder` | `desc` | `asc` \| `desc` |

### Standard response envelope

```json
{ "success": true, "message": "...", "data": { ... } }
{ "success": false, "message": "...", "errors": [ ... ] }
```

---

## CSV Import Format

Upload a `.csv` file (max 10 MB) with these exact column headers:

```
Product Name,Category,Price,Image URL
Gaming Laptop,Electronics,1299.99,https://example.com/images/gaming-laptop.jpg
```

Download a pre-built template from the **Template** button on the dashboard or via `GET /api/v1/products/import/template`.

**Validation rules:**

| Column | Rules |
|---|---|
| Product Name | Required, max 255 chars, alphanumeric + spaces/hyphens/underscores |
| Category | Required, must match an existing category name (case-insensitive) |
| Price | Required, numeric, greater than 0 |
| Image URL | Required, valid URL (`http://` or `https://`), max 500 chars |

If **any** row fails validation the entire import is rejected and an error CSV is generated. No rows are inserted. If all rows pass, they are inserted in batches of 500 inside a single transaction.

---

## Postman Collection

Two files are provided in `postman/`:

| File | Purpose |
|---|---|
| `ProductManagementSystem.postman_collection.json` | All 19 API requests with example bodies and test scripts |
| `ProductManagementSystem.postman_environment.json` | `{{baseUrl}}` and `{{token}}` variables |

**Import steps:**

1. Open Postman → **Import** → select both JSON files
2. Select the **Product Management System** environment from the environment picker
3. Run **Auth → Login** — the test script automatically sets `{{token}}`
4. All other requests inherit the Bearer token from the collection-level auth

---

## Documentation

| Document | Description |
|---|---|
| [Project Context](docs/00_PROJECT_CONTEXT.md) | Goals, stack, architecture decisions |
| [Architecture](docs/01_ARCHITECTURE.md) | Technical architecture |
| [Functional Requirements](docs/02_FUNCTIONAL_REQUIREMENTS.md) | Feature requirements |
| [UI/UX Specification](docs/03_UI_UX_SPECIFICATION.md) | Screen and component specs |
| [Bulk Upload Specification](docs/04_BULK_UPLOAD_SPECIFICATION.md) | CSV import workflow |
| [API Standards](docs/05_API_STANDARDS.md) | REST conventions |
| [Development Guidelines](docs/06_DEVELOPMENT_GUIDELINES.md) | Coding standards |
