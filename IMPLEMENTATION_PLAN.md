# Implementation Plan — Product Management System

This document defines the phased implementation plan for the Product Management System.  
Each phase must be fully completed, built successfully, and approved before the next phase begins.  
No placeholder code. No partial implementations.

---

## Implementation Workflow

```
Phase 1 → Project Scaffolding
Phase 2 → Database: Models & Migrations
Phase 3 → Authentication
Phase 4 → Category Management
Phase 5 → Product Management (CRUD + Listing)
Phase 6 → Bulk CSV Import
Phase 7 → Product Report Generation
Phase 8 → UI Polish & Final Delivery
```

---

## Folder Structure

### Backend

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts          # Sequelize connection
│   │   ├── redis.ts             # Redis connection
│   │   └── env.ts               # Validated env variables
│   ├── constants/
│   │   └── index.ts             # BATCH_SIZE, PAGE_SIZE, etc.
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── category.controller.ts
│   │   ├── product.controller.ts
│   │   └── import.controller.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts   # JWT verification
│   │   ├── error.middleware.ts  # Centralised error handler
│   │   └── upload.middleware.ts # Multer config
│   ├── models/
│   │   ├── index.ts             # Sequelize init & associations
│   │   ├── user.model.ts
│   │   ├── category.model.ts
│   │   ├── product.model.ts
│   │   └── import-job.model.ts
│   ├── queues/
│   │   ├── import.queue.ts      # product-import queue
│   │   └── report.queue.ts      # product-report queue
│   ├── repositories/
│   │   ├── user.repository.ts
│   │   ├── category.repository.ts
│   │   ├── product.repository.ts
│   │   └── import-job.repository.ts
│   ├── routes/
│   │   ├── index.ts             # Mount all routers under /api/v1
│   │   ├── auth.routes.ts
│   │   ├── category.routes.ts
│   │   ├── product.routes.ts
│   │   └── import.routes.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── category.service.ts
│   │   ├── product.service.ts
│   │   └── import.service.ts
│   ├── types/
│   │   ├── express.d.ts         # Extend Express Request with user
│   │   └── index.ts             # Shared interfaces & enums
│   ├── utils/
│   │   ├── csv.util.ts          # Stream parser, Error CSV writer
│   │   ├── pagination.util.ts
│   │   ├── response.util.ts     # Standard success/error helpers
│   │   └── file.util.ts
│   ├── validators/
│   │   ├── auth.validator.ts
│   │   ├── category.validator.ts
│   │   ├── product.validator.ts
│   │   └── import.validator.ts
│   ├── workers/
│   │   ├── import.worker.ts     # CSV import BullMQ processor
│   │   └── report.worker.ts     # Report generation BullMQ processor
│   └── app.ts                   # Express app factory
├── uploads/
│   ├── templates/
│   │   └── sample-products.csv  # Header + 1 sample row
│   ├── imports/                 # Uploaded CSVs (gitignored)
│   ├── errors/                  # Error CSVs  (gitignored)
│   └── reports/                 # Generated reports (gitignored)
├── migrations/                  # Sequelize migrations
├── seeders/                     # Admin user seeder
├── server.ts                    # Entry point (starts app + workers)
├── .env
├── .env.example
├── tsconfig.json
├── nodemon.json
└── package.json
```

### Frontend

```
frontend/
├── src/
│   └── app/
│       ├── core/
│       │   ├── guards/
│       │   │   └── auth.guard.ts
│       │   ├── interceptors/
│       │   │   ├── jwt.interceptor.ts
│       │   │   └── error.interceptor.ts
│       │   ├── services/
│       │   │   ├── auth.service.ts
│       │   │   └── token.service.ts
│       │   └── core.module.ts
│       ├── shared/
│       │   ├── components/
│       │   │   ├── confirm-dialog/
│       │   │   └── loading-spinner/
│       │   ├── services/
│       │   │   └── snackbar.service.ts
│       │   └── shared.module.ts
│       ├── features/
│       │   ├── auth/
│       │   │   ├── login/
│       │   │   └── auth.module.ts
│       │   ├── layout/
│       │   │   ├── main-layout/   # Toolbar + router-outlet
│       │   │   └── layout.module.ts
│       │   ├── categories/
│       │   │   ├── category-list/
│       │   │   ├── category-dialog/
│       │   │   └── categories.module.ts
│       │   ├── products/
│       │   │   ├── product-list/  # Dashboard — table, search, toolbar
│       │   │   ├── product-dialog/
│       │   │   ├── import-banner/ # US-020 status banner
│       │   │   └── products.module.ts
│       │   └── import/
│       │       ├── upload-dialog/
│       │       ├── import-history/
│       │       └── import.module.ts
│       ├── models/                # TypeScript interfaces
│       ├── app-routing.module.ts
│       └── app.module.ts
│   ├── environments/
│   └── assets/
└── angular.json
```

---

## Phase 1 — Project Scaffolding

**Goal:** Create the complete skeleton for both backend and frontend with all tooling configured. No application logic yet — only structure, config files, and verified build pipelines.

---

### 1.1 — Backend Setup

**Tasks**

- Initialise `backend/` as a Node.js + TypeScript project
- Install dependencies:
  - Runtime: `express`, `sequelize`, `pg`, `pg-hstore`, `bullmq`, `ioredis`, `multer`, `jsonwebtoken`, `bcryptjs`, `express-validator`, `dotenv`, `cors`, `helmet`, `morgan`
  - Dev: `typescript`, `ts-node`, `nodemon`, `@types/*`, `eslint`, `prettier`
- Configure `tsconfig.json` with strict mode enabled
- Configure `eslint` with TypeScript rules
- Configure `prettier`
- Create `nodemon.json` for development server with `ts-node`
- Create `server.ts` entry point (starts Express, connects DB, starts workers)
- Create `src/app.ts` (Express app factory — registers middleware and routes)
- Create all empty folders per the folder structure above
- Create `src/config/env.ts` — validates required env variables on startup, throws if any are missing
- Create `.env` from `.env.example`
- Create `src/constants/index.ts` with:
  ```
  IMPORT_BATCH_SIZE = 500
  DEFAULT_PAGE = 1
  DEFAULT_PAGE_SIZE = 10
  MAX_PAGE_SIZE = 100
  JWT_EXPIRES_IN = '8h'
  ```
- Verify: `npm run dev` starts without errors

**Scripts in package.json**

```json
"dev":     "nodemon server.ts",
"build":   "tsc",
"start":   "node dist/server.js",
"db:migrate": "npx sequelize-cli db:migrate",
"db:seed":    "npx sequelize-cli db:seed:all",
"db:migrate:undo": "npx sequelize-cli db:migrate:undo:all"
```

---

### 1.2 — Frontend Setup

**Tasks**

- Create Angular application in `frontend/` using Angular CLI
- Add Angular Material, configure theme (Indigo/Pink or custom professional palette)
- Configure `app-routing.module.ts` with lazy-loaded feature modules
- Create `CoreModule` (singleton services, guards, interceptors)
- Create `SharedModule` (reusable UI components, exported Material modules)
- Create empty feature modules: `AuthModule`, `LayoutModule`, `CategoriesModule`, `ProductsModule`, `ImportModule`
- Configure `environment.ts` with `apiUrl: 'http://localhost:3000/api/v1'`
- Configure Angular Material typography and global styles
- Verify: `ng serve` starts without errors

**Routing structure**

```
/login                → AuthModule (public)
/                     → LayoutModule (protected, wraps child routes)
  /dashboard          → ProductsModule  (default child)
  /categories         → CategoriesModule
  /import/history     → ImportModule
```

---

### Phase 1 Definition of Done

- [ ] `npm run dev` starts the backend without errors
- [ ] `ng serve` starts the frontend without errors
- [ ] All folders and empty module files exist
- [ ] TypeScript strict mode enabled on both projects
- [ ] ESLint and Prettier configured on the backend
- [ ] No compilation errors on either project

---

## Phase 2 — Database: Models, Migrations & Seeders

**Goal:** Define all Sequelize models, create migration files, run migrations against the local PostgreSQL instance, and seed the admin user.

---

### 2.1 — Sequelize Configuration

**Tasks**

- Configure `.sequelizerc` to point to `src/models`, `migrations/`, `seeders/`
- Create `src/config/database.ts`:
  - Reads DB config from environment variables
  - Exports a Sequelize instance
  - Exports `testConnection()` — called on startup
- Configure dialect: `postgres`
- Enable logging only in development

---

### 2.2 — Models

Create the following Sequelize models with full TypeScript typing.

#### `user.model.ts`

| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK, default UUIDV4 |
| email | STRING(255) | NOT NULL, UNIQUE |
| password | STRING(255) | NOT NULL |
| createdAt | DATE | |
| updatedAt | DATE | |

#### `category.model.ts`

| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK, default UUIDV4 |
| uniqueId | STRING(20) | NOT NULL, UNIQUE (e.g. CAT-0001) |
| name | STRING(100) | NOT NULL, UNIQUE |
| createdAt | DATE | |
| updatedAt | DATE | |

#### `product.model.ts`

| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK, default UUIDV4 |
| uniqueId | STRING(20) | NOT NULL, UNIQUE (e.g. PRD-0001) |
| name | STRING(255) | NOT NULL |
| imageUrl | STRING(500) | NOT NULL |
| price | DECIMAL(10,2) | NOT NULL |
| categoryId | UUID | FK → categories.id |
| createdAt | DATE | |
| updatedAt | DATE | |

**Association:** `Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' })`

#### `import-job.model.ts`

| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK, default UUIDV4 |
| jobId | STRING(100) | NOT NULL, UNIQUE |
| fileName | STRING(255) | NOT NULL |
| filePath | STRING(500) | NOT NULL |
| status | ENUM | pending, processing, completed, failed |
| totalRows | INTEGER | default 0 |
| processedRows | INTEGER | default 0 |
| successfulRows | INTEGER | default 0 |
| failedRows | INTEGER | default 0 |
| errorCsvPath | STRING(500) | NULLABLE |
| createdBy | UUID | FK → users.id |
| startedAt | DATE | NULLABLE |
| completedAt | DATE | NULLABLE |
| createdAt | DATE | |
| updatedAt | DATE | |

**Association:** `ImportJob.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' })`

---

### 2.3 — Migrations

Create one migration file per table in this order:

1. `create-users-table`
2. `create-categories-table`
3. `create-products-table`
4. `create-import-jobs-table`

Each migration defines `up` (create table with all columns and indexes) and `down` (drop table).

**Indexes to create:**

- `users`: index on `email`
- `categories`: index on `name`
- `products`: index on `name`, `categoryId`, `createdAt`
- `import_jobs`: index on `status`, `createdBy`

---

### 2.4 — Seeders

**Admin User Seeder**

- Creates one default admin user
- Email: `admin@example.com`
- Password: `Admin@1234` (hashed with bcrypt, 12 rounds)
- This is the only user in the system (no registration)

---

### 2.5 — `uniqueId` Generation Utility

Create `src/utils/unique-id.util.ts`:

- `generateCategoryId()` — generates `CAT-XXXX` format using a sequential counter from DB
- `generateProductId()` — generates `PRD-XXXX` format

Alternatively use a hook on the model's `beforeCreate` event.

---

### Phase 2 Definition of Done

- [ ] `npm run db:migrate` runs all migrations without errors
- [ ] `npm run db:seed` creates the admin user
- [ ] All tables exist in PostgreSQL with correct columns and indexes
- [ ] All models are fully typed in TypeScript
- [ ] Associations are defined and tested
- [ ] `testConnection()` logs success on startup

---

## Phase 3 — Authentication

**Goal:** Implement secure JWT-based login on the backend and the complete Login page on the frontend, including the HTTP interceptor and route guard.

---

### 3.1 — Backend: Authentication

**Files to create:**

- `src/repositories/user.repository.ts`
  - `findByEmail(email: string): Promise<User | null>`

- `src/services/auth.service.ts`
  - `login(email, password)`: finds user, compares bcrypt hash, generates JWT
  - Throws `UnauthorizedError` on invalid credentials

- `src/controllers/auth.controller.ts`
  - `POST /auth/login` → calls `authService.login()`, returns token

- `src/validators/auth.validator.ts`
  - Validates: `email` (required, valid format), `password` (required)

- `src/middlewares/auth.middleware.ts`
  - `authenticate`: verifies JWT from `Authorization: Bearer` header
  - Attaches decoded user to `req.user`
  - Returns 401 if missing or invalid

- `src/middlewares/error.middleware.ts`
  - Centralised Express error handler
  - Maps custom error classes to HTTP status codes
  - Returns standard error envelope
  - Never exposes stack traces in production

- `src/types/index.ts`
  - `IUser`, `ILoginRequest`, `IAuthResponse`
  - Custom error classes: `AppError`, `BadRequestError`, `UnauthorizedError`, `NotFoundError`, `ConflictError`

**API Contract:**

```
POST /api/v1/auth/login

Request:
{ "email": "admin@example.com", "password": "Admin@1234" }

Success (200):
{ "success": true, "message": "Login successful.", "data": { "token": "<jwt>", "user": { "id": "...", "email": "..." } } }

Failure (401):
{ "success": false, "message": "Invalid credentials." }
```

---

### 3.2 — Frontend: Authentication

**Files to create:**

- `core/services/token.service.ts`
  - `setToken(token)`, `getToken()`, `removeToken()`, `isLoggedIn()`
  - Stores JWT in `localStorage`

- `core/services/auth.service.ts`
  - `login(email, password): Observable<AuthResponse>`
  - `logout()`: calls `tokenService.removeToken()`, navigates to `/login`
  - `getCurrentUser()`: decodes JWT payload

- `core/guards/auth.guard.ts`
  - `canActivate`: returns `true` if token exists, else redirects to `/login`

- `core/interceptors/jwt.interceptor.ts`
  - Attaches `Authorization: Bearer <token>` to every request
  - Skips `/auth/login`

- `core/interceptors/error.interceptor.ts`
  - Intercepts 401 responses → calls `authService.logout()`
  - Passes other errors through

- `features/auth/login/login.component.ts`
  - Reactive Form: `email` (required, email format), `password` (required)
  - Show/hide password toggle
  - Loading state on submit
  - Snackbar on error
  - On success → navigate to `/dashboard`

**Login Page UI:**

- Vertically and horizontally centered card
- Angular Material `mat-card`, `mat-form-field`, `mat-input`, `mat-button`
- Application title/logo above the form
- Loading spinner replaces login button while request is in progress
- Enter key submits the form

---

### Phase 3 Definition of Done

- [ ] `POST /api/v1/auth/login` returns JWT on valid credentials
- [ ] `POST /api/v1/auth/login` returns 401 on invalid credentials
- [ ] JWT is validated on every protected route
- [ ] Login page renders correctly and is centered
- [ ] Form validates email format and required fields
- [ ] Loading spinner shows during login request
- [ ] Invalid credentials show Snackbar error
- [ ] Successful login redirects to `/dashboard`
- [ ] Logout clears token and redirects to `/login`
- [ ] Auth guard blocks access to protected routes
- [ ] JWT interceptor attaches token to all API requests
- [ ] 401 response interceptor triggers logout

---

## Phase 4 — Category Management

**Goal:** Full CRUD for categories — backend APIs and Angular UI (list, create, edit, delete).

---

### 4.1 — Backend: Category APIs

**Files to create:**

- `src/repositories/category.repository.ts`
  - `findAll(): Promise<Category[]>`
  - `findById(id): Promise<Category | null>`
  - `findByName(name): Promise<Category | null>` — case-insensitive
  - `create(data): Promise<Category>`
  - `update(id, data): Promise<Category>`
  - `delete(id): Promise<void>`

- `src/services/category.service.ts`
  - `getAll()`: returns all categories
  - `getById(id)`: throws `NotFoundError` if not found
  - `create(name)`: trims, checks uniqueness (case-insensitive), throws `ConflictError` if duplicate, auto-generates `uniqueId`
  - `update(id, name)`: validates uniqueness excluding current record
  - `delete(id)`: throws `NotFoundError` if not found

- `src/controllers/category.controller.ts`
  - Thin controller — calls service, returns standard response

- `src/validators/category.validator.ts`
  - `name`: required, string, max 100 chars

- `src/routes/category.routes.ts`
  - All routes protected by `authenticate` middleware

**API Contracts:**

```
GET    /api/v1/categories          → 200, list of all categories
GET    /api/v1/categories/:id      → 200, single category | 404
POST   /api/v1/categories          → 201, created category | 409 duplicate
PUT    /api/v1/categories/:id      → 200, updated category | 404 | 409
DELETE /api/v1/categories/:id      → 204 | 404
```

---

### 4.2 — Frontend: Category Management

**Files to create:**

- `features/categories/category-list/category-list.component.ts`
  - Material Table with columns: Unique ID, Category Name, Actions (Edit, Delete)
  - Loading spinner while fetching
  - Empty state: "No Categories Found"
  - "Add Category" button in page header

- `features/categories/category-dialog/category-dialog.component.ts`
  - Used for both Create and Edit (receives data via `MAT_DIALOG_DATA`)
  - Single field: Category Name
  - Reactive Form with validation
  - Save / Cancel buttons
  - Calls appropriate service method based on mode

- `shared/components/confirm-dialog/confirm-dialog.component.ts`
  - Reusable confirmation dialog (used for all delete confirmations)
  - Receives `{ title, message }` via `MAT_DIALOG_DATA`
  - Confirm / Cancel buttons

- `shared/services/snackbar.service.ts`
  - `success(message)`, `error(message)`
  - Uses `MatSnackBar` with consistent duration and panel class

- API service: `features/categories/services/category.service.ts`
  - `getAll()`, `create(name)`, `update(id, name)`, `delete(id)`

**UI Flows:**

- Create → dialog opens → save → snackbar "Category Created" → list refreshes
- Edit → dialog opens pre-populated → save → snackbar "Category Updated" → list refreshes
- Delete → confirmation dialog → confirm → snackbar "Category Deleted" → list refreshes

---

### Phase 4 Definition of Done

- [ ] All 5 category API endpoints work and return correct status codes
- [ ] Duplicate category name returns 409
- [ ] Case-insensitive uniqueness enforced (Electronics == electronics)
- [ ] Category list page renders with Material Table
- [ ] Create dialog opens, validates, and saves
- [ ] Edit dialog opens pre-populated, validates, and saves
- [ ] Delete shows confirmation dialog and removes category
- [ ] Snackbar messages show for all success and error cases
- [ ] Loading spinner shown during fetch
- [ ] Empty state shown when no categories exist

---

## Phase 5 — Product Management (CRUD + Listing)

**Goal:** Full product CRUD with a paginated, searchable, sortable product listing dashboard.

---

### 5.1 — Backend: Product APIs

**Files to create:**

- `src/repositories/product.repository.ts`
  - `findAll(filters)`: with `search`, `sortBy`, `sortOrder`, `page`, `pageSize`
  - `findById(id)`: includes Category association
  - `create(data)`: auto-generates `uniqueId`
  - `update(id, data)`
  - `delete(id)`
  - `count(filters)`: total matching records (for pagination)

- `src/services/product.service.ts`
  - `getAll(query)`: builds filter object, calls repository, returns paginated response
  - `getById(id)`: throws `NotFoundError` if not found
  - `create(data)`: validates category exists, creates product
  - `update(id, data)`: validates category exists, updates product
  - `delete(id)`: throws `NotFoundError` if not found

- `src/controllers/product.controller.ts`

- `src/validators/product.validator.ts`
  - `name`: required, max 255
  - `categoryId`: required, valid UUID
  - `price`: required, numeric, > 0
  - `imageUrl`: required, valid URL
  - Query params: `page`, `pageSize`, `search`, `sortBy`, `sortOrder`

- `src/routes/product.routes.ts`

**API Contracts:**

```
GET    /api/v1/products
  Query: ?page=1&pageSize=10&search=laptop&sortBy=createdAt&sortOrder=desc
  Response: paginated envelope with items + pagination metadata

GET    /api/v1/products/:id     → 200 | 404
POST   /api/v1/products         → 201 | 422
PUT    /api/v1/products/:id     → 200 | 404 | 422
DELETE /api/v1/products/:id     → 204 | 404
```

**Search:** `ILIKE` on `product.name` OR `category.name`  
**Default sort:** `createdAt DESC`  
**Eager load:** include Category (name only) in all responses

---

### 5.2 — Frontend: Product Dashboard

**Files to create:**

- `features/products/product-list/product-list.component.ts`
  - Main dashboard page
  - Top toolbar with: Search input, Upload CSV button, Download Template button, Download Report button, Reset Filters button
  - Import Status Banner slot (wired up in Phase 6)
  - Angular Material Table
  - Columns: Product Name, Category, Price, Image (thumbnail), Actions (Edit, Delete)
  - Sticky header
  - Hover effect via CSS
  - `MatPaginator` — server-side, page sizes: [10, 20, 50, 100]
  - `MatSort` on Created Date column — server-side
  - Debounced search input (400 ms via RxJS `debounceTime`)
  - Loading spinner while fetching
  - Empty state when no products found
  - On image load error → fallback to placeholder asset

- `features/products/product-dialog/product-dialog.component.ts`
  - Shared Create/Edit dialog
  - Fields: Product Name, Category (dropdown), Price, Image URL
  - Category dropdown loads from Categories API
  - Reactive Form with full validation
  - Save / Cancel buttons

- `features/products/services/product.service.ts`
  - `getAll(params)`, `getById(id)`, `create(data)`, `update(id, data)`, `delete(id)`

**UI Behaviours:**

- Search debounced → resets to page 1 → fires API call
- Sort change → resets to page 1 → fires API call
- Page change → fires API call preserving current search/sort
- Reset Filters → clears search, resets sort to createdAt DESC, resets to page 1, reloads

---

### Phase 5 Definition of Done

- [ ] Product listing API returns correctly paginated, searched, and sorted results
- [ ] Default sort is `createdAt DESC`
- [ ] Search works case-insensitively on product name and category name
- [ ] Create product dialog works with full validation
- [ ] Edit product dialog opens pre-populated
- [ ] Delete shows confirmation and removes product
- [ ] Paginator works correctly (server-side)
- [ ] Debounced search fires correctly
- [ ] Sort toggles between asc/desc server-side
- [ ] Reset Filters clears all state and reloads
- [ ] Image thumbnail renders; placeholder shown on error
- [ ] Loading spinner shown while fetching
- [ ] Empty state shown when no products match

---

## Phase 6 — Bulk CSV Import

**Goal:** Implement the complete CSV import pipeline — file upload, BullMQ job queue, streaming validation worker, error CSV generation, import history, and the Import Status Banner.

---

### 6.1 — Backend: File Upload Endpoint

**Files to create / update:**

- `src/middlewares/upload.middleware.ts`
  - Multer configuration: `diskStorage`, destination `uploads/imports/`
  - File filter: validates extension (`.csv`) and MIME type (`text/csv`, `application/csv`)
  - File size limit: `MAX_FILE_SIZE_MB` from env
  - Filename: `import-<timestamp>-<originalname>`

- `src/repositories/import-job.repository.ts`
  - `create(data)`: creates import job with status `pending`
  - `findById(id)`
  - `findByJobId(jobId)`
  - `findAll()`: ordered by `createdAt DESC`
  - `updateStatus(id, status, extra?)`

- `src/services/import.service.ts`
  - `uploadCsv(file, userId)`:
    1. Creates `ImportJob` record with status `pending`
    2. Adds job to `product-import` BullMQ queue with `{ importJobId, filePath }`
    3. Returns `{ jobId }` — the BullMQ job ID

- `src/controllers/import.controller.ts`
  - `POST /products/import` → calls `importService.uploadCsv()` → returns 202
  - `GET /products/import/history` → calls `importJobRepository.findAll()` → returns 200
  - `GET /products/import/status/:jobId` → returns current ImportJob status
  - `GET /products/import/error/:jobId` → streams error CSV file as download

- `src/queues/import.queue.ts`
  - Creates BullMQ Queue named `product-import`
  - Connects to Redis using config
  - Exports queue instance

**API Contracts:**

```
POST /api/v1/products/import
  Content-Type: multipart/form-data
  Field: file (.csv only)
  Response 202: { "success": true, "message": "Import started successfully.", "data": { "jobId": "..." } }
  Response 400: invalid file type

GET /api/v1/products/import/history
  Response 200: { "success": true, "data": { "items": [...importJobs] } }

GET /api/v1/products/import/status/:jobId
  Response 200: { "success": true, "data": { "status": "processing", "totalRows": 100, "processedRows": 45, ... } }

GET /api/v1/products/import/error/:jobId
  Response 200: streams error CSV file
  Response 404: no error file found
```

---

### 6.2 — Backend: Import Worker

**File:** `src/workers/import.worker.ts`

**Responsibilities:** Process `product-import` queue jobs

**Processing Steps:**

```
Step 1 — Update ImportJob status → processing, set startedAt

Step 2 — Stream CSV file using a streaming parser
         Collect all rows in memory as validated/invalid lists

Step 3 — Validate CSV headers
         Expected: ["Product Name", "Category", "Price", "Image URL"]
         If headers don't match → generate Error CSV → mark job failed → stop

Step 4 — Validate every row (independently)

         Product Name:
           - Required
           - Trim whitespace
           - Max 255 chars
           - Regex: /^[a-zA-Z0-9 \-_]+$/

         Category:
           - Required
           - Must exist in the database (case-insensitive lookup)

         Price:
           - Required
           - Must be a valid positive number > 0

         Image URL:
           - Required
           - Must be a valid URL
           - Max 500 chars

         Collect per-row errors:
           { rowNumber, productName, category, price, imageUrl,
             productNameError, categoryError, priceError, imageUrlError }

Step 5 — If any row has errors:
           Generate Error CSV (see below)
           Update ImportJob: status=failed, failedRows=N, errorCsvPath
           Stop — do not insert anything

Step 6 — If all rows are valid:
           Open Sequelize transaction
           Insert records in batches of IMPORT_BATCH_SIZE (500)
           Each batch uses bulkCreate()
           On any failure → rollback entire transaction → mark job failed
           On success → commit → update ImportJob: status=completed, successfulRows=N

Step 7 — Update ImportJob completedAt timestamp
```

**Error CSV Generation (`src/utils/csv.util.ts`):**

```
Columns: Row Number, Product Name, Category, Price, Image URL
(5 columns — no separate error columns)

- Each data cell is written using the embedError() helper:
    • If the field failed validation: cell = error message only (no original value)
    • If the field passed validation: cell is empty
- Original cell values are always preserved unchanged
- Save to uploads/errors/error-<jobId>-<timestamp>.csv
```

**Pre-fetch Categories Optimisation:**

Before validating rows, load all categories into a `Map<string (lowercase), Category>` — avoids N+1 queries during CSV validation.

---

### 6.3 — Backend: Sample CSV Template

- File: `uploads/templates/sample-products.csv`
- Content:
  ```
  Product Name,Category,Price,Image URL
  Gaming Laptop,Electronics,1299.99,https://example.com/images/gaming-laptop.jpg
  ```
- Endpoint: `GET /api/v1/products/import/template`
  - Streams `sample-products.csv` as a file download

---

### 6.4 — Frontend: Upload Dialog

**File:** `features/import/upload-dialog/upload-dialog.component.ts`

**UI:**

- Material Dialog
- Title: "Upload Product CSV"
- File picker input (accept=".csv")
- Selected filename shown after selection
- Upload / Cancel buttons
- Validates `.csv` extension on the frontend — shows Snackbar error for invalid type
- On upload: sends `multipart/form-data` with `file` field
- On 202 response: closes dialog, shows Snackbar "Import started. We'll notify you when it's done.", stores `jobId` in service

---

### 6.5 — Frontend: Import Status Banner

**File:** `features/products/import-banner/import-banner.component.ts`

**Behaviour:**

- Rendered above the product table in `product-list.component.html`
- Invisible when no active import
- Becomes visible when `importBannerService.startPolling(jobId)` is called (after upload)
- Polls `GET /api/v1/products/import/status/:jobId` every **3 seconds**
- Stops polling when status is `completed` or `failed`

**State Display:**

| Status | Banner Content |
|---|---|
| `pending` / `processing` | ⏳ spinner + *"Importing products in the background — this may take a moment."* |
| `completed` | ✅ *"Import completed successfully. Your products have been added."* → auto-dismisses after 5 seconds, reloads product table |
| `failed` | ⚠️ *"Some rows in your file failed validation and the import was not applied. Click here to review the errors and download the error report."* — "Click here" navigates to `/import/history` |

- Dismiss (×) button always visible
- Banner is non-blocking — user can still use the product table

**Service:** `features/import/services/import-banner.service.ts`
- Manages active `jobId` and polling interval using RxJS `interval` + `switchMap`

---

### 6.6 — Frontend: Import History Page

**File:** `features/import/import-history/import-history.component.ts`

**UI:**

- Material Table
- Columns: File Name, Upload Date, Status (chip), Total Records, Successful Records, Failed Records, Actions
- Status chips: Pending (grey), Processing (blue), Completed (green), Failed (red)
- "Download Error Report" button shown only for failed imports
- Clicking "Download Error Report" calls `GET /api/v1/products/import/error/:jobId`
- Table ordered by most recent first
- Loading spinner while fetching
- Empty state: "No import history found."

---

### 6.7 — Frontend: Download Sample Template

- In `product-list.component.ts` toolbar
- Calls `GET /api/v1/products/import/template`
- Triggers browser download of `sample-products.csv`

---

### Phase 6 Definition of Done

- [ ] Upload endpoint validates CSV file type and returns 202
- [ ] BullMQ job is created and worker picks it up
- [ ] CSV headers are validated before row processing
- [ ] Each row is validated independently
- [ ] Category lookup is case-insensitive and pre-fetched (no N+1)
- [ ] Error CSV is generated with 5 columns (Row Number, Product Name, Category, Price, Image URL) when validation fails
- [ ] Validation errors are embedded inside the failing field's cell on a second line (no separate error columns)
- [ ] Valid field cells contain only the original value with no error text
- [ ] Original cell values preserved in Error CSV
- [ ] Transaction begins only after full CSV validation passes
- [ ] Batch inserts of 500 rows per batch
- [ ] Full transaction rollback on any insert failure
- [ ] ImportJob record updated at every stage
- [ ] Import history API returns all jobs
- [ ] Status polling endpoint returns current job state
- [ ] Error CSV download endpoint streams the file
- [ ] Sample template endpoint streams `sample-products.csv`
- [ ] Upload dialog works, validates file type, shows filename
- [ ] Import Status Banner shows spinner while processing
- [ ] Banner updates to success → auto-dismisses → reloads table
- [ ] Banner updates to failure → shows error message with link to history
- [ ] Import History page renders with correct columns and status chips
- [ ] "Download Error Report" button works for failed imports

---

## Phase 7 — Product Report Generation

**Goal:** Generate a filtered product CSV report in the background using BullMQ, poll for completion, and auto-download the file.

---

### 7.1 — Backend: Report Queue & Worker

**Files to create:**

- `src/queues/report.queue.ts`
  - Creates BullMQ Queue named `product-report`

- `src/workers/report.worker.ts`

  **Processing Steps:**

  ```
  Step 1 — Receive job payload: { search, sortBy, sortOrder, userId }

  Step 2 — Query all matching products using repository
           Apply same search and sort logic as the listing API
           No pagination — fetch ALL matching records

  Step 3 — Write products to CSV using streaming
           Save to uploads/reports/products-report-<jobId>-<timestamp>.csv

  Step 4 — Return the file path in job result
  ```

  **CSV Columns:** Product Name, Category, Price, Image URL, Created Date

- `src/routes/product.routes.ts` (add report routes)

**API Contracts:**

```
GET /api/v1/products/report
  Query: ?search=laptop&sortBy=createdAt&sortOrder=desc
  Response 202:
  { "success": true, "message": "Report generation started.", "data": { "jobId": "..." } }

GET /api/v1/products/report/:jobId/status
  Response 200: { "success": true, "data": { "status": "completed" | "processing" | "failed" } }

GET /api/v1/products/report/:jobId/download
  Response 200: streams CSV file
  Response 404: report not ready or not found
```

---

### 7.2 — Frontend: Download Report

**Updates to `product-list.component.ts`:**

- "Download Product Report" icon button in toolbar
- Tooltip: "Download Product Report"
- On click:
  1. Calls `GET /api/v1/products/report` with current `search`, `sortBy`, `sortOrder` params
  2. Shows Snackbar: "Report Generation Started. Download will begin shortly."
  3. Starts polling `GET /api/v1/products/report/:jobId/status` every 2 seconds
  4. When `status === completed`: calls download endpoint, triggers browser file download, stops polling
  5. On failure: shows Snackbar error, stops polling
- Button is disabled while report generation is in progress

---

### Phase 7 Definition of Done

- [ ] Report generation API returns 202 with jobId
- [ ] BullMQ worker generates CSV with all matching records
- [ ] Report respects search, sort, and filter parameters
- [ ] Report is NOT paginated — all records included
- [ ] Report status polling endpoint works
- [ ] Report download endpoint streams the CSV
- [ ] Frontend polls for completion and auto-triggers download
- [ ] Download button is disabled while generating
- [ ] Snackbar messages shown at appropriate points

---

## Phase 8 — UI Polish & Final Delivery

**Goal:** Complete all UI/UX requirements, add responsiveness, accessibility, tooltips, and produce the final deliverables.

---

### 8.1 — UI Polish Tasks

- Apply consistent Angular Material theme across all pages
- Ensure all icon buttons have:
  - `matTooltip` directive
  - `aria-label` attribute
- Responsive layout:
  - Desktop: full toolbar in one row
  - Tablet: toolbar items wrap
  - Mobile: toolbar controls stack vertically, table scrolls horizontally
- Snackbar service used consistently for all success/error feedback
- Confirm Dialog used consistently for all delete actions
- Loading spinner shown while any request is in progress
- Empty states implemented on both product and category lists
- Placeholder image for broken product image URLs (`assets/images/placeholder.png`)
- Enter key submits all forms
- Escape key closes dialogs

---

### 8.2 — Sample CSV Template File

- Ensure `uploads/templates/sample-products.csv` exists with:
  ```
  Product Name,Category,Price,Image URL
  Gaming Laptop,Electronics,1299.99,https://example.com/images/gaming-laptop.jpg
  ```

---

### 8.3 — Postman Collection

Create `postman/ProductManagementSystem.postman_collection.json` containing:

- Auth: Login
- Categories: Get All, Get By ID, Create, Update, Delete
- Products: Get All (with query params), Get By ID, Create, Update, Delete
- Import: Upload CSV, Get History, Get Status, Download Error CSV, Download Template
- Report: Generate, Get Status, Download

Each request includes:
- Pre-configured headers
- Example request bodies
- Environment variable `{{baseUrl}}` = `http://localhost:3000/api/v1`
- Environment variable `{{token}}` = set automatically on login

---

### 8.4 — Final README Update

Update `README.md` with complete:

- Project overview
- Technology stack table
- Prerequisites (Node.js, PostgreSQL, Redis versions)
- Installation steps (clone, copy .env, install, migrate, seed)
- Running backend and frontend
- Default credentials (`admin@example.com` / `Admin@1234`)
- Environment variable descriptions
- Project folder structure
- API documentation summary
- Postman collection import instructions

---

### Phase 8 Definition of Done

- [ ] All pages are responsive (desktop, tablet, mobile)
- [ ] All icon buttons have tooltips and aria-labels
- [ ] All snackbar messages use the shared snackbar service
- [ ] All delete actions use the shared confirm dialog
- [ ] Loading states shown on all data fetches
- [ ] Empty states shown on both product and category lists
- [ ] Placeholder image shown on broken product images
- [ ] Enter key submits Login form
- [ ] Postman collection is complete and importable
- [ ] README is complete with all setup instructions
- [ ] Sample CSV template file exists with header + 1 sample row
- [ ] Application builds without TypeScript or ESLint errors
- [ ] All phases work end-to-end

---

## Full API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/auth/login` | No | Login |
| GET | `/api/v1/categories` | Yes | List categories |
| GET | `/api/v1/categories/:id` | Yes | Get category |
| POST | `/api/v1/categories` | Yes | Create category |
| PUT | `/api/v1/categories/:id` | Yes | Update category |
| DELETE | `/api/v1/categories/:id` | Yes | Delete category |
| GET | `/api/v1/products` | Yes | List products (paginated) |
| GET | `/api/v1/products/:id` | Yes | Get product |
| POST | `/api/v1/products` | Yes | Create product |
| PUT | `/api/v1/products/:id` | Yes | Update product |
| DELETE | `/api/v1/products/:id` | Yes | Delete product |
| POST | `/api/v1/products/import` | Yes | Upload CSV |
| GET | `/api/v1/products/import/history` | Yes | Import history |
| GET | `/api/v1/products/import/status/:jobId` | Yes | Import job status |
| GET | `/api/v1/products/import/error/:jobId` | Yes | Download error CSV |
| GET | `/api/v1/products/import/template` | Yes | Download sample template |
| GET | `/api/v1/products/report` | Yes | Start report generation |
| GET | `/api/v1/products/report/:jobId/status` | Yes | Report job status |
| GET | `/api/v1/products/report/:jobId/download` | Yes | Download report CSV |

---

## Deliverables Checklist

| Deliverable | Phase |
|---|---|
| Angular Frontend | 3–8 |
| Node.js Backend | 1–7 |
| PostgreSQL Schema (Migrations) | 2 |
| Sequelize Models | 2 |
| BullMQ Import Worker | 6 |
| BullMQ Report Worker | 7 |
| Redis Configuration | 1 |
| Environment Files (.env.example) | 1 |
| Sample CSV Template | 6 |
| Postman Collection | 8 |
| README | 8 |
| Production-ready folder structure | 1 |

---

## Dependencies Between Phases

```
Phase 1 (Scaffolding)
  └── Phase 2 (Database)
        └── Phase 3 (Authentication)
              ├── Phase 4 (Categories)
              │     └── Phase 5 (Products)
              │           ├── Phase 6 (Bulk Import)
              │           └── Phase 7 (Reports)
              └── Phase 8 (Polish) ← depends on all phases
```

No phase may be started until the previous phase is complete and approved.
