# HR Management Backend

A small HR management RESTful API built with Node.js, TypeScript, Express, and Knex. HR users can authenticate, manage employees (CRUD), record daily attendance, and generate monthly attendance reports.

**Live API:** https://backend-nzsi.onrender.com
> Hosted on a free tier — the first request may take 30-60 seconds while the server wakes up from sleep.

## Tech Stack

- **Runtime:** Node.js + TypeScript (OOP)
- **Framework:** Express
- **Query Builder:** Knex
- **Database:** MySQL
- **Validation:** Joi
- **Auth:** JWT (jsonwebtoken) + bcrypt
- **File Uploads:** Multer
- **Code Quality:** ESLint + Prettier

## Project Structure

```
src/
├── config/         # DB connection, Multer config
├── controllers/    # Route handlers
├── services/       # Business logic
├── models/         # Data types/interfaces
├── middlewares/     # Auth, validation middleware
├── validators/       # Joi schemas
├── routes/         # Express routers
├── migrations/       # Knex migrations
├── seeds/           # Knex seeds
├── uploads/         # Uploaded employee photos
└── server.ts        # App entry point
```

## Prerequisites

- Node.js (v18+)
- MySQL server running locally or remotely

## Setup & Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/tuhin637/backend.git
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```

   | Variable      | Description                              |
   |---------------|-------------------------------------------|
   | `PORT`        | Port the server runs on (default: 5000)   |
   | `DB_HOST`     | MySQL host                                |
   | `DB_PORT`     | MySQL port (default: 3306)                |
   | `DB_USER`     | MySQL username                            |
   | `DB_PASSWORD` | MySQL password                            |
   | `DB_NAME`     | Database name                             |
   | `JWT_SECRET`  | Secret key used to sign JWT tokens        |
   | `UPLOAD_PATH` | Local folder path for uploaded photos     |

4. **Create the database**

   Create a MySQL database matching `DB_NAME` from your `.env`:
   ```sql
   CREATE DATABASE hr_backend;
   ```

5. **Run migrations** (creates `hr_users`, `employees`, `attendance` tables)
   ```bash
   npm run migrate
   ```

6. **Run seeds** (creates a default HR user for login/testing)
   ```bash
   npm run seed
   ```

7. **Start the development server**
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:5000`.

## Available Scripts

| Script                  | Description                          |
|--------------------------|---------------------------------------|
| `npm run dev`            | Start dev server with hot reload      |
| `npm run build`          | Compile TypeScript to `dist/`         |
| `npm start`              | Run the compiled build (production)   |
| `npm run migrate`        | Run Knex migrations                   |
| `npm run migrate:rollback` | Rollback last migration batch       |
| `npm run seed`           | Run Knex seeds                        |
| `npm run lint`           | Lint the codebase                     |
| `npm run lint:fix`       | Lint and auto-fix                     |
| `npm run format`         | Format code with Prettier             |

## Test Credentials

```
Email: hr@example.com
Password: admin123
```

## API Documentation

All routes except `POST /auth/login` require a JWT Bearer token in the `Authorization` header:
```
Authorization: Bearer <token>
```

### Auth

| Method | Endpoint      | Description         |
|--------|---------------|----------------------|
| POST   | `/auth/login` | HR login, returns JWT |

**Request body:**
```json
{ "email": "hr@example.com", "password": "admin123" }
```

### Employees

| Method | Endpoint         | Description                                  |
|--------|------------------|-----------------------------------------------|
| GET    | `/employees`      | List employees (supports pagination & search) |
| GET    | `/employees/:id`  | Get a single employee                        |
| POST   | `/employees`      | Create an employee (multipart form-data)      |
| PUT    | `/employees/:id`  | Update an employee (photo replace supported)  |
| DELETE | `/employees/:id`  | Delete an employee                           |

**Example query:** `GET /employees?search=rahim`

**Create/Update body** (`multipart/form-data`):
```
name            string   required
age             number   required
designation     string   required
hiring_date     date     required (YYYY-MM-DD)
date_of_birth   date     required (YYYY-MM-DD)
salary          number   required
photo           file     optional
```

### Attendance

| Method | Endpoint          | Description                                       |
|--------|-------------------|-----------------------------------------------------|
| GET    | `/attendance`      | List attendance (filter by employee_id, date range) |
| GET    | `/attendance/:id`  | Get a single attendance entry                        |
| POST   | `/attendance`      | Create or upsert attendance for a given day           |
| PUT    | `/attendance/:id`  | Update an attendance entry                           |
| DELETE | `/attendance/:id`  | Delete an attendance entry                           |

**Create/Upsert body:**
```json
{ "employee_id": 1, "date": "2026-07-14", "check_in_time": "09:50:00" }
```
> If a record already exists for the given `employee_id` + `date`, it is updated instead of creating a duplicate.

**Example query:** `GET /attendance?employee_id=1&from=2026-07-01&to=2026-07-31`

### Reports

| Method | Endpoint            | Description                     |
|--------|---------------------|-----------------------------------|
| GET    | `/reports/attendance` | Monthly attendance summary       |

**Query params:** `month=YYYY-MM` (required), `employee_id` (optional)

**Example:** `GET /reports/attendance?month=2026-07`

**Response:**
```json
{
  "data": [
    { "employee_id": 1, "name": "Rahim Uddin", "days_present": 1, "times_late": 1 }
  ]
}
```
> A check-in after `09:45:00` counts as late.

## Database Schema

**hr_users**
| Column         | Type          |
|----------------|---------------|
| id             | PK, auto-increment |
| email          | string, unique, required |
| password_hash  | string, required |
| name           | string, required |
| created_at     | timestamp |
| updated_at     | timestamp |

**employees**
| Column         | Type          |
|----------------|---------------|
| id             | PK, auto-increment |
| name           | string, required |
| age            | integer, required |
| designation    | string, required |
| hiring_date    | date, required |
| date_of_birth  | date, required |
| salary         | decimal, required |
| photo_path     | string, optional |
| deleted_at     | timestamp, nullable (soft delete) |
| created_at     | timestamp |
| updated_at     | timestamp |

**attendance**
| Column         | Type          |
|----------------|---------------|
| id             | PK, auto-increment |
| employee_id    | FK → employees.id, required |
| date           | date, required |
| check_in_time  | time, required |
| created_at     | timestamp |
| updated_at     | timestamp |

Unique constraint on `(employee_id, date)` ensures a single attendance record per employee per day.

See `src/migrations/` for the exact schema definitions.
