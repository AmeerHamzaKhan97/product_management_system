# User Stories — Product Management System

This document defines all user stories derived from the project documentation.  
Stories are grouped by module and written from the perspective of an authenticated user unless otherwise noted.

---

## Epic 1 — Authentication

---

### US-001 — Login

**As a** user  
**I want to** log in with my email and password  
**So that** I can securely access the Product Management System

**Acceptance Criteria**

- The login page is centered vertically and horizontally
- The login form contains an Email field and a Password field
- The Password field has a show/hide toggle
- Email is validated for required and valid format
- Password is validated for required
- Pressing Enter submits the form
- A loading spinner is shown while the login request is in progress
- On success, a JWT token is stored and the user is redirected to the Dashboard
- On failure, a Snackbar error message is displayed (e.g., "Invalid credentials.")
- Passwords are never stored in plaintext — bcrypt hashing is used in the database

**Business Rules**

- Only registered users can log in (no self-registration)
- Authentication uses email + password
- JWT is returned on success and stored on the frontend

---

### US-002 — Logout

**As a** logged-in user  
**I want to** log out of the system  
**So that** my session is cleared and the account is secured

**Acceptance Criteria**

- A Logout button is visible in the top toolbar
- Clicking Logout removes the JWT token from local storage
- The user is immediately redirected to the Login page
- Protected routes are inaccessible after logout

---

### US-003 — Route Protection

**As a** system  
**I want to** prevent unauthenticated users from accessing protected pages  
**So that** the application data remains secure

**Acceptance Criteria**

- All routes except `/login` require a valid JWT
- Attempting to access a protected route without a token redirects to `/login`
- All API requests include the JWT in the `Authorization: Bearer <token>` header
- The HTTP interceptor automatically attaches the token to every outgoing request
- A 401 Unauthorized response from the API redirects the user to the Login page

---

## Epic 2 — Category Management

---

### US-004 — List Categories

**As a** logged-in user  
**I want to** view all categories  
**So that** I can manage the product catalogue structure

**Acceptance Criteria**

- Categories are displayed in a Material Table
- Each row shows Category ID and Category Name
- The table shows a loading spinner while fetching
- An empty state message is shown when no categories exist

---

### US-005 — Create Category

**As a** logged-in user  
**I want to** create a new product category  
**So that** products can be organised by category

**Acceptance Criteria**

- Clicking "Add Category" opens a Material Dialog
- The dialog contains a Category Name input field
- Category Name is required
- Leading and trailing spaces are trimmed before saving
- Category names are case-insensitive for uniqueness (e.g., "Electronics" and "electronics" are duplicates)
- If the name already exists, a 409 Conflict error is returned and displayed
- On success, a Snackbar message "Category Created" is displayed and the list refreshes
- On cancel, the dialog closes with no changes

**Business Rules**

- Category Name must be unique (case-insensitive)
- Category Name is mandatory
- Maximum length: 100 characters

---

### US-006 — Edit Category

**As a** logged-in user  
**I want to** update an existing category name  
**So that** I can correct or rename categories

**Acceptance Criteria**

- Clicking the Edit icon on a category row opens the Edit Dialog
- The dialog is pre-populated with the existing category name
- The same validation rules apply as for Create
- On success, a Snackbar message "Category Updated" is displayed and the list refreshes
- On cancel, no changes are made

---

### US-007 — Delete Category

**As a** logged-in user  
**I want to** delete a category  
**So that** outdated categories are removed from the system

**Acceptance Criteria**

- Clicking the Delete icon triggers a Confirmation Dialog
- The dialog asks "Are you sure you want to delete this category?"
- On confirmation, the category is deleted
- On success, a Snackbar message "Category Deleted" is displayed and the list refreshes
- On cancel, no changes are made

---

## Epic 3 — Product Management

---

### US-008 — List Products (Dashboard)

**As a** logged-in user  
**I want to** view all products in a paginated table  
**So that** I can browse and manage the product catalogue

**Acceptance Criteria**

- Products are displayed in an Angular Material Table
- Columns: Product Name, Category, Price, Image, Actions (Edit, Delete)
- The table has sticky headers
- Hover effect is applied to table rows
- A loading spinner is shown while fetching data
- Default sort is **Created Date Descending** (newest products first)
- Server-side pagination is implemented with page size options: 10, 20, 50, 100
- The paginator shows current page, total records, and rows per page

---

### US-009 — Search Products

**As a** logged-in user  
**I want to** search for products by name or category  
**So that** I can quickly find specific products

**Acceptance Criteria**

- A search input is visible in the toolbar with placeholder "Search Product or Category"
- Search is debounced (300–500 ms) to avoid excessive requests
- Search is server-side and case-insensitive
- Search matches both Product Name and Category Name
- Results update automatically as the user types
- Pagination resets to page 1 on new search

---

### US-010 — Sort Products by Created Date

**As a** logged-in user  
**I want to** sort products by the date they were added  
**So that** I can easily see the most recently imported products

**Acceptance Criteria**

- The Created Date column header is clickable and toggles between Newest First and Oldest First
- Sorting is server-side
- Default sort is **Created Date Descending** (newest first)
- Active sort indicator is visible in the column header
- Pagination resets to page 1 when sort changes

---

### US-011 — Reset Filters

**As a** logged-in user  
**I want to** reset all search and sorting filters  
**So that** I can return to the default product view

**Acceptance Criteria**

- A "Reset Filters" button is visible in the toolbar
- Clicking it clears the search input, resets sorting to **Created Date Descending**, and resets to page 1
- The product list reloads with default parameters

---

### US-012 — Create Product

**As a** logged-in user  
**I want to** create a new product  
**So that** it appears in the product catalogue

**Acceptance Criteria**

- Clicking "Add Product" opens a Material Dialog
- Fields: Product Name, Category (dropdown), Price, Image URL
- All fields are required
- Category dropdown is populated from existing categories
- Price must be a positive number
- Image URL must be a valid URL
- On success, a Snackbar message "Product Created" is displayed and the list refreshes
- On cancel, no changes are made

**Business Rules**

- Product must belong to an existing category
- Price cannot be negative or zero
- Image URL must be a valid URL
- Product Name maximum length: 255 characters

---

### US-013 — Edit Product

**As a** logged-in user  
**I want to** edit an existing product  
**So that** I can keep the product information up to date

**Acceptance Criteria**

- Clicking the Edit icon opens the Edit Dialog pre-populated with existing values
- The same validation rules apply as for Create
- On success, a Snackbar message "Product Updated" is displayed and the list refreshes
- On cancel, no changes are made

---

### US-014 — Delete Product

**As a** logged-in user  
**I want to** delete a product  
**So that** discontinued or incorrect products are removed from the catalogue

**Acceptance Criteria**

- Clicking the Delete icon triggers a Confirmation Dialog
- The dialog asks "Are you sure you want to delete this product?"
- On confirmation, the product is deleted and the list refreshes
- On success, a Snackbar message "Product Deleted" is displayed
- On cancel, no changes are made

---

### US-015 — Product Image Display

**As a** logged-in user  
**I want to** see product images in the table  
**So that** I can visually identify products

**Acceptance Criteria**

- The Image column renders a thumbnail from the product's Image URL
- If the image fails to load, a placeholder image is displayed
- Images maintain aspect ratio

---

## Epic 4 — Bulk Product Import (CSV Upload)

---

### US-016 — Download Sample CSV Template

**As a** logged-in user  
**I want to** download a sample CSV template  
**So that** I know the correct format before preparing a bulk upload

**Acceptance Criteria**

- A "Download Sample Template" icon button is visible in the toolbar with tooltip "Download Sample CSV Template"
- Clicking it immediately downloads `sample-products.csv`
- The file contains the header row and **one sample data row**

**Sample file content:**

```
Product Name,Category,Price,Image URL
Gaming Laptop,Electronics,1299.99,https://example.com/images/gaming-laptop.jpg
```

---

### US-017 — Upload Product CSV

**As a** logged-in user  
**I want to** upload a CSV file containing multiple products  
**So that** I can import products in bulk without entering them one by one

**Acceptance Criteria**

- An "Upload CSV" icon button is visible in the toolbar with tooltip "Upload Product CSV"
- Clicking it opens an Upload Dialog
- The dialog allows selecting a file via a file picker
- Only `.csv` files are accepted; other types show a Snackbar error: "Only CSV files are supported."
- On valid file selection, the filename is shown in the dialog
- Clicking Upload sends the file to the backend
- The API immediately returns HTTP 202 and the dialog closes
- A Snackbar message "Import Started Successfully" is displayed
- The import is processed asynchronously in the background via BullMQ
- The HTTP request never waits for the import to complete

**Business Rules**

- Only CSV files are accepted (validated by extension and MIME type)
- The CSV must contain exactly four columns in this order: `Product Name`, `Category`, `Price`, `Image URL`
- Missing, extra, or reordered columns are rejected
- The entire import is atomic — either all records are inserted or none

---

### US-018 — CSV Row Validation

**As a** system  
**I want to** validate every row of the uploaded CSV  
**So that** only clean data is imported into the database

**Acceptance Criteria**

- Every row is validated independently
- Product Name: required, max 255 chars, only letters, numbers, spaces, hyphens, and underscores allowed
- Category: required, Category must already exist in the database
- Price: required, numeric, greater than zero
- Image URL: required, valid URL, max 500 characters
- If any row fails validation, the entire import is rejected (no partial inserts)
- An Error CSV is generated listing every failing row with column-specific error messages

---

### US-019 — Error CSV Generation

**As a** logged-in user  
**I want to** download an Error CSV when my import fails  
**So that** I can identify and fix validation errors before re-uploading

**Acceptance Criteria**

- The Error CSV is generated whenever any row fails validation
- Columns match the input exactly: Row Number, Product Name, Category, Price, Image URL (5 columns total — no separate error columns)
- For each field that failed validation, the cell contains only the error message (the original value is not repeated)
- For each field that passed validation, the cell is empty
- Opening the file in Excel or Google Sheets shows the error message in failing cells and blank cells everywhere else
- The Error CSV is downloadable from the Import History screen

---

### US-020 — Import Status Banner

**As a** logged-in user  
**I want to** see real-time feedback about my CSV import above the product listing  
**So that** I know whether my import is processing, succeeded, or failed without having to navigate away

**Acceptance Criteria**

- After a successful upload (HTTP 202), a dismissible status banner appears **above the product table**, outside the table area
- The banner is non-blocking — the user can still browse and interact with the product listing while the import runs
- **While processing** (status: Pending / Processing):  
  Banner shows a spinner and the message:  
  *"⏳ Importing products in the background — this may take a moment."*
- **On success** (status: Completed):  
  Banner updates to:  
  *"✅ Import completed successfully. Your products have been added."*  
  The product table reloads automatically and the banner auto-dismisses after 5 seconds
- **On failure** (status: Failed):  
  Banner updates to:  
  *"⚠️ Some rows in your file failed validation and the import was not applied. Click here to review the errors and download the error report."*  
  "Click here" navigates the user to the Import History screen
- The frontend polls the job status endpoint (every 3 seconds) until the job reaches a terminal state (Completed or Failed)
- The banner can be manually dismissed by the user at any time via a close icon
- If no import is currently in progress, no banner is shown

---

### US-021 — Bulk Insert with Transaction

**As a** system  
**I want to** insert all validated products inside a single database transaction  
**So that** the database remains consistent even if an insert fails mid-way

**Acceptance Criteria**

- The database transaction begins only after every row passes validation
- Records are inserted in batches of 500
- If any batch insert fails, the entire transaction is rolled back
- No products remain in the database from a failed import
- On success, the Import Job status is updated to Completed

---

### US-022 — View Import History

**As a** logged-in user  
**I want to** view the history of all CSV import jobs  
**So that** I can monitor upload progress and review past imports

**Acceptance Criteria**

- An Import History section or page lists all import jobs
- Each row shows: File Name, Upload Date, Status, Total Records, Successful Records, Failed Records
- Statuses: Pending, Processing, Completed, Failed
- Failed imports show a "Download Error CSV" link/button
- The list is ordered by most recent first

---

### US-023 — Download Error CSV

**As a** logged-in user  
**I want to** download the Error CSV for a failed import  
**So that** I can diagnose and fix the issues in my CSV

**Acceptance Criteria**

- A "Download Error CSV" action is available for every failed import in the Import History
- Clicking it downloads the generated Error CSV for that job
- The file is named descriptively (e.g., `error-<jobId>.csv`)

---

## Epic 5 — Product Report Generation

---

### US-024 — Generate and Download Product Report

**As a** logged-in user  
**I want to** generate and download a CSV report of products matching my current search and filters  
**So that** I can export filtered product data for analysis or sharing

**Acceptance Criteria**

- A "Download Product Report" icon button is visible in the toolbar with tooltip "Download Product Report"
- Clicking it triggers a background report generation job via BullMQ
- The API immediately returns HTTP 202
- A Snackbar message "Report Generation Started" is displayed
- The report respects the current search query, current sorting, and current category filter
- Pagination does NOT affect the report — all matching records are included
- The generated report is a CSV file containing all matching products
- When the report is ready, the user can download it
- The report is named descriptively (e.g., `products-report-<jobId>.csv`)

**Business Rules**

- Reports are generated in the background and must not block the HTTP request
- Filters and sorting applied at the time of the request are applied to the report
- All matching records are exported regardless of the current page size

---

## Epic 6 — UI / UX Cross-Cutting Concerns

---

### US-025 — Toolbar Layout

**As a** logged-in user  
**I want to** see a consistent toolbar on every page  
**So that** navigation and key actions are always accessible

**Acceptance Criteria**

- The top toolbar shows: Application Title, Navigation Links (Dashboard, Categories, Import History), Logged-in User Email, Logout button
- The active navigation link is visually highlighted
- On tablet (≤768 px), navigation link labels are hidden and only icons are shown
- The product listing toolbar shows: Search Box, Upload CSV, Download Template, Download Report, Reset Filters buttons
- All icon buttons have tooltips
- All icon buttons and nav links have `aria-label` attributes for accessibility

---

### US-026 — Responsive Layout

**As a** user on any device  
**I want to** use the application on desktop, tablet, and mobile  
**So that** I can manage products regardless of my device

**Acceptance Criteria**

- The layout adapts correctly on desktop (full toolbar), tablet (wrapped toolbar), and mobile (stacked controls)
- The product table supports horizontal scrolling on small screens
- No content is cut off or unusable on any screen size

---

### US-027 — Loading States

**As a** user  
**I want to** see loading indicators when data is being fetched  
**So that** I know the system is working and do not interact with stale data

**Acceptance Criteria**

- A Material Progress Spinner is shown while any data fetch is in progress
- Search, Upload, and Download buttons are disabled while loading

---

### US-028 — Empty State

**As a** user  
**I want to** see a meaningful message when no products match my search  
**So that** I understand why the table is empty

**Acceptance Criteria**

- When the product table has no results, display "No Products Found"
- A "Reset Filters" button is provided in the empty state

---

### US-029 — Snackbar Notifications

**As a** user  
**I want to** receive brief feedback messages after every action  
**So that** I know whether my action succeeded or failed

**Acceptance Criteria**

- Success messages: Login Successful, Product Created, Product Updated, Product Deleted, Category Created, Category Updated, Category Deleted, CSV Uploaded Successfully, Report Generation Started
- Error messages: Invalid Credentials, Upload Failed, Invalid CSV, Product Delete Failed, Server Error
- Snackbars auto-dismiss after a short duration

---

### US-030 — Confirmation Dialogs

**As a** user  
**I want to** be asked to confirm before performing a destructive action  
**So that** I do not accidentally delete data

**Acceptance Criteria**

- Delete Product and Delete Category both show a Confirmation Dialog
- The dialog clearly states the action to be confirmed
- Cancelling the dialog makes no changes to data

---

### US-031 — Keyboard and Accessibility

**As a** user  
**I want to** use the application with keyboard navigation  
**So that** the application is accessible and efficient to use

**Acceptance Criteria**

- Pressing Enter in the Login form submits it
- Pressing Escape closes Dialogs where appropriate
- All dialogs trap keyboard focus while open
- All inputs have labels and placeholders
- All buttons have `aria-label` attributes

---

## Summary

| Epic | Story IDs | Count |
|---|---|---|
| Authentication | US-001 – US-003 | 3 |
| Category Management | US-004 – US-007 | 4 |
| Product Management | US-008 – US-015 | 8 |
| Bulk Product Import | US-016 – US-023 | 8 |
| Report Generation | US-024 | 1 |
| UI/UX Cross-Cutting | US-025 – US-031 | 7 |
| **Total** | | **31** |
