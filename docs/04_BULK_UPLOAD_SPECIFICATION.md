# Bulk Upload Specification

## Overview

This document defines the complete bulk upload workflow for importing products into the system.

The implementation must be scalable, reliable, maintainable, and capable of handling large CSV files without causing HTTP timeout errors.

The import process must execute asynchronously using BullMQ.

The database must follow an all-or-nothing transaction strategy.

---

# Objective

The bulk upload feature should

- Accept CSV files only.
- Validate the complete CSV.
- Generate an Error CSV when validation fails.
- Insert all records only if every row is valid.
- Roll back the entire transaction if insertion fails.
- Never block the HTTP request.

---

# Supported File Type

Only CSV files are supported.

Allowed Extension

.csv

Reject

- .xlsx
- .xls
- .txt
- .json
- .xml

Invalid files should return

HTTP 400 Bad Request

---

# CSV Template

Expected CSV

| Product Name | Category | Price | Image URL |

Column order is mandatory.

Header names must match exactly.

Example

Product Name,Category,Price,Image URL

Bag,Accessories,500,https://example.com/image.jpg

---

# CSV Header Validation

Validate

- Header names
- Header order
- Missing headers
- Additional headers

If validation fails

- Stop processing.
- Generate Error CSV.
- Mark Import Failed.

---

# Upload Flow

User selects CSV

↓

Frontend uploads CSV

↓

Backend validates file type

↓

Store file in uploads/imports

↓

Create Import Job

↓

Push Job to BullMQ

↓

Return HTTP 202 Accepted

↓

Worker begins processing

↓

Validate CSV

↓

Validation Successful?

↓

No

↓

Generate Error CSV

↓

Update Import Job

↓

Job Failed

↓

Yes

↓

Start Transaction

↓

Batch Insert

↓

Commit

↓

Job Completed

---

# API Response

Immediately return

HTTP 202 Accepted

Example

{
    "success": true,
    "message": "Import started successfully.",
    "data": {
        "jobId": "<job-id>"
    }
}

The frontend should never wait for the import to finish.

---

# CSV Validation Rules

## Product Name

Validation

- Required
- Trim whitespace
- Maximum 255 characters
- Allow
  - Alphabets
  - Numbers
  - Spaces
  - Hyphen (-)
  - Underscore (_)

Reject

Special characters

Example

Invalid

Bag@123

TV!!

Laptop#

Valid

Laptop

Gaming Laptop

USB-C Cable

Bag_01

Bag-01

---

## Category

Validation

- Required
- Must exist in database.

If category does not exist

Return validation error.

---

## Price

Validation

- Required
- Numeric
- Greater than zero

Examples

Valid

100

599.99

Invalid

abc

-100

empty

---

## Image URL

Validation

- Required
- Valid URL
- Maximum 500 characters

Examples

Valid

https://example.com/image.jpg

Invalid

abc

123

---

# Row Validation

Every row must be validated independently.

Validation errors should be collected.

If any row contains errors

The entire import fails.

No products should be inserted.

---

# Error CSV

Generate an Error CSV whenever validation fails.

Columns

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

| Row Number | Product Name | Category | Price | Image URL | Product Name Error | Category Error | Price Error | Image URL Error |
|------------|--------------|----------|-------|-----------|--------------------|----------------|-------------|-----------------|
| 1 | 1-!@# | 123 | abc | 123 | Special characters are not allowed. | Category does not exist. | Price must be a valid positive number. | Image URL must be a valid URL. |
| 2 | Bag | 123 | 500 | https://abc.com | | Category does not exist. | | |

Rules

- Original uploaded values must remain unchanged.
- Validation messages should appear only in the corresponding error column.
- Valid fields should have empty error columns.

---

# Validation Strategy

The worker should validate every row before starting any database transaction.

Workflow

Read CSV

↓

Validate Row

↓

Store Validation Result

↓

Next Row

↓

All Rows Processed

↓

Any Errors?

↓

Yes

↓

Generate Error CSV

↓

Stop Processing

↓

No

↓

Start Database Transaction

---

# Transaction Strategy

The application must follow an All-or-Nothing approach.

Rules

- Do not start the transaction while validating the CSV.
- Start the transaction only after all rows pass validation.
- Insert records using batch inserts.
- If any insert fails
  - Roll back the complete transaction.
  - No product should remain in the database.

---

# Batch Insert Strategy

Recommended Batch Size

500 Records

Workflow

Transaction Started

↓

Insert Batch 1

↓

Insert Batch 2

↓

Insert Batch N

↓

Commit Transaction

Benefits

- Better database performance
- Lower memory usage
- Easier maintenance

---

# BullMQ

BullMQ should process

- Product Import
- Report Generation

Queue Name

product-import

Worker Responsibilities

- Read CSV
- Validate Rows
- Generate Error CSV
- Perform Database Transaction
- Update Import Status

---

# Import Job Status

Maintain an Import Job record.

Statuses

- Pending
- Processing
- Completed
- Failed

Track

- Total Rows
- Processed Rows
- Successful Rows
- Failed Rows
- Error CSV Path
- Started At
- Completed At

---

# Import History

Every upload should create a history record.

Display

- Upload Date
- File Name
- Status
- Total Records
- Successful Records
- Failed Records

If Failed

Allow downloading the Error CSV.

---

# Storage Structure

uploads/

templates/

sample-products.csv

imports/

uploaded-file.csv

errors/

error-report.csv

reports/

generated-report.csv

Temporary files should be cleaned after successful processing where appropriate.

---

# Security

Validate

- File extension
- MIME type
- Maximum file size

Never trust client-side validation.

---

# Performance

Requirements

- Stream CSV
- Never load the complete file into memory
- Use BullMQ
- Use batch inserts
- Use transactions
- Avoid unnecessary database queries

---

# Failure Scenarios

Scenario

Invalid File Type

Expected Result

Reject upload.

---

Scenario

Invalid CSV Header

Expected Result

Generate Error CSV.

---

Scenario

Invalid Row Data

Expected Result

Generate Error CSV.

---

Scenario

Category Not Found

Expected Result

Generate Error CSV.

---

Scenario

Database Insert Failure

Expected Result

Rollback Transaction.

---

Scenario

BullMQ Worker Failure

Expected Result

Mark Job Failed.

---

Scenario

Unexpected Exception

Expected Result

Log error.

Update Import Job.

Return meaningful error response.

---

# Definition of Done

The Bulk Upload feature is complete when

- CSV upload works.
- File validation works.
- Header validation works.
- Row validation works.
- Error CSV generation works.
- BullMQ processes imports.
- Transaction rollback works.
- Batch inserts work.
- Import history is maintained.
- Import status is tracked.
- Large files do not cause HTTP timeout errors.
```