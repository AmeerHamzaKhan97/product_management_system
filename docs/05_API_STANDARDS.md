# API Standards

## Overview

This document defines the API standards and conventions that every backend endpoint must follow.

The objective is to keep the APIs consistent, predictable, and easy to maintain.

All APIs should follow RESTful principles.

---

# Base URL

/api/v1

Example

/api/v1/auth/login

/api/v1/products

/api/v1/categories

---

# Authentication

All APIs except Login require JWT authentication.

Public APIs

- POST /auth/login

Protected APIs

- User APIs
- Category APIs
- Product APIs
- Bulk Upload APIs
- Report APIs

JWT should be sent in the Authorization header.

Example

Authorization: Bearer <JWT_TOKEN>

---

# HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Resource Created |
| 202 | Accepted (Background Job Started) |
| 204 | Resource Deleted |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Resource Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 500 | Internal Server Error |

---

# Standard Success Response

Every successful API should return

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {}
}
```

---

# Standard Error Response

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": []
}
```

---

# Validation Error Response

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    {
      "field": "price",
      "message": "Price must be greater than zero."
    }
  ]
}
```

---

# Pagination Response

```json
{
  "success": true,
  "message": "Products fetched successfully.",
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "totalRecords": 150,
      "totalPages": 8
    }
  }
}
```

---

# Query Parameters

## Pagination

?page=1&pageSize=20

Default

page=1

pageSize=10

Maximum Page Size

100

---

## Search

Example

?search=laptop

Search should match

- Product Name
- Category Name

Search should be case-insensitive.

---

## Sorting

Example

?sortBy=price&sortOrder=asc

Supported Fields

- price

Supported Orders

- asc
- desc

Default

price desc

---

# Login API

POST

/auth/login

Request

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

Success

200 OK

Failure

401 Unauthorized

---

# User APIs

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /users | Get Users |
| GET | /users/:id | Get User |
| POST | /users | Create User |
| PUT | /users/:id | Update User |
| DELETE | /users/:id | Delete User |

---

# Category APIs

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /categories | Get Categories |
| GET | /categories/:id | Get Category |
| POST | /categories | Create Category |
| PUT | /categories/:id | Update Category |
| DELETE | /categories/:id | Delete Category |

---

# Product APIs

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /products | Product Listing |
| GET | /products/:id | Get Product |
| POST | /products | Create Product |
| PUT | /products/:id | Update Product |
| DELETE | /products/:id | Delete Product |

Product Listing should support

- Pagination
- Search
- Sorting

---

# Bulk Upload APIs

## Upload CSV

POST

/products/import

Request

multipart/form-data

Field Name

file

Response

202 Accepted

```json
{
  "success": true,
  "message": "Import started successfully.",
  "data": {
    "jobId": "123456"
  }
}
```

---

## Get Import History

GET

/products/import/history

Returns

- Import Date
- Status
- File Name
- Total Records
- Successful Records
- Failed Records

---

## Download Error CSV

GET

/products/import/error/:jobId

Downloads

Generated Error CSV

---

# Report APIs

## Generate Product Report

GET

/products/report

Supports

- Search
- Sorting

Returns

202 Accepted

Background job begins.

---

## Download Generated Report

GET

/products/report/:jobId

Downloads generated CSV.

---

# CRUD Validation Rules

## User

Email

- Required
- Valid Email
- Unique

Password

- Required
- Minimum Length 8

---

## Category

Name

- Required
- Unique
- Maximum Length 100

---

## Product

Product Name

- Required
- Maximum Length 255

Category

- Required
- Must Exist

Price

- Required
- Numeric
- Greater Than Zero

Image URL

- Required
- Valid URL

---

# Error Messages

Use meaningful error messages.

Examples

Invalid Credentials.

Category already exists.

Category not found.

Product not found.

Invalid CSV format.

Price must be greater than zero.

Image URL must be a valid URL.

---

# Naming Conventions

Endpoints

Use plural nouns.

Examples

/products

/categories

/users

Avoid

/getProducts

/createProduct

---

# REST Principles

GET

Read

POST

Create

PUT

Update

DELETE

Delete

---

# Logging

Log

- Request Method
- Endpoint
- Response Status
- Execution Time

Do not log

- Passwords
- JWT Tokens
- Sensitive Information

---

# Security

Always

- Validate Input
- Validate JWT
- Sanitize User Input
- Use Parameterized Queries
- Validate Uploaded Files

---

# API Versioning

Every endpoint should use versioning.

Example

/api/v1/products

Future versions

/api/v2/products

---

# Definition of Done

The API layer is complete when

- REST conventions are followed.
- JWT authentication is implemented.
- Standard response format is used.
- Standard error format is used.
- Pagination is consistent.
- Sorting is consistent.
- Searching is consistent.
- Validation is implemented.
- Proper HTTP status codes are returned.
- APIs are documented in Postman.
```
