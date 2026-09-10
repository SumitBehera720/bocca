# Farmart Backend API (Node.js + Express + SQL)

RESTful API backend for the Farmart grocery e-commerce platform.

## Architecture

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: SQL (SQLite via `better-sqlite3` with auto-migration from `database/schema.sql` and `database/seed.sql`)
- **Authentication**: JWT & bcryptjs password hashing

## Directory Structure

```text
backend/
├── database/
│   ├── schema.sql       # SQL table schemas & constraints
│   ├── seed.sql         # Seed data (products, categories, users)
│   └── dbInit.js        # Standalone initialization script
├── src/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth & error handling
│   ├── models/          # SQL database models
│   ├── routes/          # Express route endpoints
│   ├── services/        # Business logic layer
│   ├── utils/           # JWT, responses, helpers
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── .env.example
├── package.json
└── README.md
```

## Setup & Run

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   ```bash
   cp .env.example .env
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Or production:
   ```bash
   npm start
   ```

4. **API Base URL**: `http://localhost:5000/api`
