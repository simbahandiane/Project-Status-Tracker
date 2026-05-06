# Client Project Status Tracker

A simple full-stack CRUD application for managing projects with client information and status tracking.

---

## Features

- Create new projects
- View list of projects
- Edit existing projects
- Delete projects
- Track project status:
  - Not Started
  - In Progress
  - Blocked
  - Done

---

## Tech Stack

### Frontend + Backend
- Next.js
### Database
- SQLite
### ORM
- Prisma

---

## Architecture Overview

- Frontend: React components inside Next.js
- Backend: API routes (`/app/api`)
- Database: Local SQLite file (`dev.db`)
- ORM: Prisma for database queries

---

## Design Decisions
1. Next.js for Fullstack was used to simplify the architecture by combining frontend and backend in a single project using API routes.

2. Prisma ORM was used to simplify database operations and provide type-safe queries.

3. SQLite for portability, no setup required, works offline, easy to ship inside ZIP file, ideal for small CRUD applications.

---

## AI Usage
- Help fix encountered error upon development
- Help refactor code by the developer
- Improve UI layout and styling consistency

## Project Structure

```txt
project-tracker/
├── app/
│ ├── api/
│ │ ├── [id]
│ │ └── projects/
│ ├── page.tsx
│ └── layout.tsx
│
├── lib/
│ └── prisma.ts
│
├── prisma/
│ ├── migrations/
│ ├── dev.db
│ └── schema.prisma
│
├── .env
├── package.json
└── README.md
```

---

## Setup Instructions

### Install dependencies

```bash
npm install
```
---

## Start development server

```bash
npm run dev
```