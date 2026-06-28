# UI & UX Specification

## Overview

The application should provide a clean, modern, responsive, and professional user interface using Angular Material.

The UI should resemble a real-world admin dashboard rather than a basic CRUD application.

The application must be responsive and usable on desktop, tablet, and mobile devices.

All pages should maintain a consistent design language.

---

# Design Guidelines

UI Library

- Angular Material

Icons

- Angular Material Icons

Theme

- Clean
- Professional
- Minimal
- Responsive

Use

- Material Cards
- Material Tables
- Material Dialogs
- Material Tooltips
- Material Snackbars
- Material Menus
- Material Buttons
- Material Icons
- Material Progress Spinner

---

# Application Flow

Login

↓

Dashboard

↓

Product Listing

↓

Upload CSV / Download Report / CRUD Operations

---

# Login Page

The login page should be centered vertically and horizontally.

Components

- Company/Application Logo
- Application Title
- Email Field
- Password Field
- Show/Hide Password Icon
- Login Button

Features

- Field Validation
- Loading Spinner while logging in
- Enter key submits the form
- Error Snackbar on invalid credentials

Validation

Email

- Required
- Valid email format

Password

- Required

---

# Dashboard Layout

After successful login

Navigate to Dashboard.

Dashboard Layout

Top Toolbar

↓

Content Area

Toolbar should contain

- Application Title
- Logged-in User Email
- Logout Button

---

# Product Listing Page

This is the primary screen of the application.

Layout

--------------------------------------------------------

Toolbar

--------------------------------------------------------

Search

Upload CSV

Download Template

Download Report

Reset Filters

--------------------------------------------------------

Product Table

--------------------------------------------------------

Pagination

---

# Toolbar Components

## Search Box

Placeholder

Search Product or Category

Features

- Search by Product Name
- Search by Category Name
- Debounced search (300–500ms)
- Server-side search

---

## Upload CSV Button

Type

Material Icon Button

Icon

Upload

Tooltip

Upload Product CSV

Click Action

Open Upload Dialog

---

## Download Sample Template Button

Type

Material Icon Button

Icon

Download

Tooltip

Download Sample CSV Template

Click Action

Download sample-products.csv

---

## Download Product Report Button

Type

Material Icon Button

Icon

Description / Download

Tooltip

Download Product Report

Behavior

Download report using

- Current Search
- Current Sorting
- Current Filters

Pagination should not affect exported data.

---

## Reset Filters Button

Type

Material Button

Tooltip

Reset Search and Sorting

Behavior

Reset

- Search
- Sorting
- Current Page

Reload products

Default Sorting

Price Descending

---

# Product Table

Use Angular Material Table.

Columns

- Product Name
- Category
- Price
- Image
- Actions

Actions

- Edit
- Delete

Table Features

- Sticky Header
- Responsive
- Hover Effect
- Loading State
- Empty State

---

# Image Column

Display product image.

If image fails to load

Display placeholder image.

Image should maintain aspect ratio.

---

# Sorting

Allow sorting by

Price

Ascending

Descending

Sorting should happen on the server.

Current sorting should remain active until reset.

---

# Pagination

Server-side pagination.

Display

- Current Page
- Total Records
- Rows Per Page

Rows Per Page Options

10

20

50

100

---

# Empty State

If no products are available

Display

No Products Found

Provide a button

Reset Filters

---

# Loading State

While fetching data

Display

Material Progress Spinner

Disable

- Search
- Upload
- Download Buttons

---

# Upload CSV Dialog

Use Angular Material Dialog.

Dialog Title

Upload Product CSV

Components

File Picker

Selected File Name

Upload Button

Cancel Button

---

# Upload Validation

Allow only

.csv

Invalid file

Display Snackbar

Only CSV files are supported.

---

# Upload Progress

After successful upload request

Close Dialog.

Display Snackbar

Import Started Successfully.

Refresh Import History if available.

---

# Download Sample Template

Clicking the button should download

sample-products.csv

The template should contain

Product Name,Category,Price,Image URL

---

# Download Product Report

Behavior

Generate report using

Current Search

Current Sorting

Current Filters

Do not apply pagination.

The downloaded report should include every matching product.

---

# Delete Product

Click Delete

↓

Confirmation Dialog

↓

User Confirms

↓

Delete Product

↓

Refresh Listing

Confirmation Message

Are you sure you want to delete this product?

---

# Edit Product

Click Edit

↓

Open Dialog

↓

Populate Existing Data

↓

Save

↓

Refresh Listing

---

# Create Product

Use Material Dialog.

Fields

- Product Name
- Category Dropdown
- Price
- Image URL

Buttons

- Save
- Cancel

---

# Create Category

Use Material Dialog.

Fields

Category Name

Buttons

- Save
- Cancel

---

# Edit Category

Open Material Dialog.

Populate existing values.

Buttons

- Update
- Cancel

---

# Delete Category

Confirmation Dialog

↓

Delete

↓

Refresh Listing

---

# Snackbar Messages

Success

- Login Successful
- Product Created
- Product Updated
- Product Deleted
- Category Created
- Category Updated
- Category Deleted
- CSV Uploaded Successfully
- Report Generation Started

Error

- Invalid Credentials
- Upload Failed
- Invalid CSV
- Product Delete Failed
- Server Error

---

# Tooltips

Every icon button should have a tooltip.

Examples

Upload CSV

Download Sample Template

Download Product Report

Edit Product

Delete Product

Logout

Reset Filters

---

# Responsive Design

Desktop

Display full toolbar.

Tablet

Wrap toolbar items.

Mobile

Stack toolbar controls vertically.

Table should support horizontal scrolling.

---

# Accessibility

Buttons should have

- aria-label

Inputs should have

- labels
- placeholders

Dialogs should trap keyboard focus.

Enter key should submit forms.

Escape key should close dialogs where appropriate.

---

# UX Expectations

The application should

- Feel fast
- Be intuitive
- Minimize clicks
- Provide meaningful validation messages
- Show loading indicators
- Avoid blocking the user unnecessarily

---

# Definition of Done

The UI is considered complete when

- Professional appearance
- Fully responsive
- Material Design components used
- Tooltips implemented
- Snackbars implemented
- Dialogs implemented
- Loading states implemented
- Empty states implemented
- Confirmation dialogs implemented
- Server-side pagination implemented
- Server-side search implemented
- Server-side sorting implemented
- Reset Filters implemented
- Download Template implemented
- Download Product Report implemented
- Upload CSV dialog implemented
```