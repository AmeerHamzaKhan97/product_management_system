# Functional Requirements

## Overview

This document defines all functional requirements for the Product Management System.

Only the functionality defined in this document should be implemented.

Do not implement additional features unless explicitly requested.

---

# Module 1 - Authentication

## Login

The application should provide a secure login screen.

The user should authenticate using

- Email
- Password

Passwords must be encrypted in the database.

After successful authentication

- Generate JWT
- Return token
- Redirect user to Dashboard

If authentication fails

Display an appropriate error message.

Examples

- Invalid email
- Invalid password
- Invalid credentials

---

## Logout

The user should be able to logout.

Logout should

- Remove JWT
- Redirect user to Login

---

# Module 2 - Category Management

The system should support complete CRUD operations.

Fields

- Unique ID (Auto Generated)
- Category Name

Business Rules

- Category Name is mandatory.
- Category Name must be unique.
- Leading and trailing spaces should be trimmed.
- Category names are case-insensitive when checking uniqueness.

Example

Electronics

electronics

Should be considered duplicates.

---

# Module 3 - Product Management

The system should support complete CRUD operations.

Fields

- Unique ID (Auto Generated)
- Product Name
- Category
- Price
- Image URL

Business Rules

- Product Name is mandatory.
- Price is mandatory.
- Category is mandatory.
- Image URL is mandatory.
- Product must belong to an existing category.
- Price cannot be negative.
- Image URL must be valid.

---

# Module 4 - Product Listing

The dashboard should display products in a paginated table.

Columns

- Product Name
- Category
- Price
- Image
- Actions

Features

- Server-side Pagination
- Search
- Sorting
- Responsive Layout

Default Sort

Price Descending

---

# Search

The application should support

Search by

- Product Name
- Category Name

Search should be server-side.

---

# Sorting

Allow sorting by

Price

Ascending

Descending

Sorting should happen on the backend.

---

# Pagination

Pagination should be server-side.

User should be able to

- Change Page
- Change Page Size

Recommended Page Sizes

10

20

50

100

---

# Reset Filters

Provide a Reset Filters button.

Reset should

- Clear Search
- Reset Sorting
- Return to Page 1
- Reload default listing

Default Listing

Sort by Price Descending.

---

# Module 5 - Bulk Upload

The application should support importing products using CSV.

Only CSV files are supported.

---

## CSV Structure

The uploaded CSV must contain the following columns.

| Product Name | Category | Price | Image URL |

Header names must match exactly.

Header order must match exactly.

Additional columns are not allowed.

Missing columns are not allowed.

---

## Upload Process

User selects CSV.

↓

System uploads file.

↓

API returns HTTP 202.

↓

Background job starts.

↓

Worker validates CSV.

↓

Worker inserts data.

↓

User can monitor status.

---

# CSV Validation

Each row should be validated.

Validation should include

## Product Name

- Required
- Trim whitespace
- Allow alphabets
- Allow numbers
- Allow spaces
- Allow hyphen (-)
- Allow underscore (_)
- Other special characters are not allowed.

---

## Category

- Required
- Category must already exist in the database.

---

## Price

- Required
- Numeric
- Greater than zero

---

## Image URL

- Required
- Valid URL

---

# Validation Strategy

Validate the complete CSV before inserting data.

If any row contains validation errors

- Stop processing.
- Generate Error CSV.
- Mark Import Failed.
- Do not insert any records.

No partial import is allowed.

---

# Error CSV

The generated Error CSV should contain

| Row Number |

Original CSV Columns

Validation Columns

Example

| Row Number | Product Name | Category | Price | Image URL | Product Name Error | Category Error | Price Error | Image URL Error |

Each validation error should only appear in its own column.

If a field passes validation

Its validation column should remain empty.

---

# Import History

The application should maintain import history.

Each import should display

- File Name
- Upload Date
- Status
- Total Records
- Successful Records
- Failed Records

If the import failed

Allow downloading the generated Error CSV.

---

# Module 6 - Report Generation

The application should allow downloading product reports.

Reports should be generated using BullMQ.

The API should immediately return Accepted.

The report should be generated in the background.

---

# Report Rules

Generated reports should respect

Current Search

Current Sorting

Current Filters

Pagination should NOT affect report generation.

The report should contain all matching records.

---

# Sample CSV Template

The application should provide a Download Sample Template button.

Clicking the button downloads

sample-products.csv

The template should contain only the headers.

Example

Product Name,Category,Price,Image URL

---

# Business Rules Summary

The system should enforce the following rules.

Authentication

- Login required

Category

- Must exist
- Must be unique

Product

- Must belong to category
- Price must be valid
- Image URL must be valid

Import

- Validate entire CSV
- No partial insert
- Transaction rollback
- Error CSV generation

Reports

- Background processing
- Respect search
- Respect sorting
- Export all matching records

---

# Out of Scope

The following features should NOT be implemented.

- User Registration
- Forgot Password
- Email Verification
- Product Image Upload
- Excel Import
- Multiple User Roles
- Dashboard Analytics
- Notifications
- Audit Logs

These features are intentionally excluded from the assignment.