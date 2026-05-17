# 📋 Task Manager API

A production-ready RESTful API for managing tasks, built with **Node.js**, **Express.js**, and **MongoDB (Mongoose)**.

---

## 🗂 Folder Structure

```
task-manager/
├── config/
│   └── db.js                  # MongoDB connection logic
├── controllers/
│   └── taskController.js      # CRUD handler functions
├── middleware/
│   ├── errorHandler.js        # Global error handler
│   ├── notFound.js            # 404 handler
│   └── validate.js            # express-validator runner
├── models/
│   └── Task.js                # Mongoose Task schema
├── routes/
│   ├── index.js               # Root router + /health
│   └── taskRoutes.js          # Task-specific routes + validation
├── utils/
│   ├── ApiError.js            # Custom operational error class
│   └── ApiResponse.js         # Standardised response helpers
├── .env.example               # Environment variable template
├── .gitignore
├── package.json
├── README.md
└── server.js                  # App entry point
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable          | Description                                    | Default                                        |
|-------------------|------------------------------------------------|------------------------------------------------|
| `PORT`            | Port the server listens on                     | `5000`                                         |
| `NODE_ENV`        | Runtime environment (`development/production`) | `development`                                  |
| `MONGO_URI`       | MongoDB connection string                      | `mongodb://localhost:27017/taskmanager`        |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins                   | `http://localhost:3000,http://localhost:5173`  |

---

## 🚀 Setup & Running

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or [Atlas](https://www.mongodb.com/atlas))

### Install dependencies
```bash
npm install
```

### Development (with auto-reload)
```bash
npm run dev
```

### Production
```bash
npm start
```

The server starts at `http://localhost:5000` by default.

---

## 📡 API Endpoints

### Base URL: `/api`

#### Health Check
| Method | Endpoint      | Description         |
|--------|---------------|---------------------|
| GET    | `/api/health` | Server health check |

---

#### Tasks — `/api/tasks`

| Method | Endpoint          | Description           |
|--------|-------------------|-----------------------|
| POST   | `/api/tasks`      | Create a new task     |
| GET    | `/api/tasks`      | Get all tasks         |
| GET    | `/api/tasks/:id`  | Get a single task     |
| PUT    | `/api/tasks/:id`  | Update a task         |
| DELETE | `/api/tasks/:id`  | Delete a task         |

---

### 🔍 GET /api/tasks — Query Parameters

| Param    | Type   | Options                               | Description              |
|----------|--------|---------------------------------------|--------------------------|
| `status` | string | `pending` `in-progress` `completed`   | Filter by status         |
| `priority`| string| `low` `medium` `high`                | Filter by priority       |
| `page`   | number | ≥ 1                                   | Page number (default: 1) |
| `limit`  | number | 1–100                                 | Items per page (default: 10) |
| `sortBy` | string | `createdAt` `updatedAt` `dueDate` `priority` `title` | Sort field |
| `order`  | string | `asc` `desc`                          | Sort direction           |

**Example:**
```
GET /api/tasks?status=pending&priority=high&page=1&limit=5&sortBy=dueDate&order=asc
```

---

### 📦 Task Object Schema

```json
{
  "_id":         "64f1a2b3c4d5e6f7a8b9c0d1",
  "title":       "Design landing page",
  "description": "Create wireframes and final mockups",
  "status":      "in-progress",
  "priority":    "high",
  "dueDate":     "2025-08-15T00:00:00.000Z",
  "isOverdue":   false,
  "createdAt":   "2025-06-01T10:00:00.000Z",
  "updatedAt":   "2025-06-02T12:30:00.000Z"
}
```

| Field         | Type    | Required | Values                              |
|---------------|---------|----------|-------------------------------------|
| `title`       | string  | ✅ yes    | 3–100 characters                    |
| `description` | string  | ❌ no     | max 1000 characters                 |
| `status`      | string  | ❌ no     | `pending` `in-progress` `completed` |
| `priority`    | string  | ❌ no     | `low` `medium` `high`               |
| `dueDate`     | date    | ❌ no     | ISO 8601 format                     |
| `isOverdue`   | boolean | virtual  | Computed automatically              |

---

### 📤 Request & Response Examples

#### Create a Task
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Write unit tests",
  "description": "Cover all controller functions",
  "status": "pending",
  "priority": "high",
  "dueDate": "2025-09-01"
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": { ...task }
}
```

#### Get All Tasks
```http
GET /api/tasks?status=pending&limit=5
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": [ ...tasks ],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 5,
    "totalPages": 9
  }
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "title", "message": "Title must be between 3 and 100 characters" }
  ]
}
```

---

## 🛡 HTTP Status Codes

| Code | Meaning                          |
|------|----------------------------------|
| 200  | OK                               |
| 201  | Created                          |
| 400  | Bad Request                      |
| 404  | Not Found                        |
| 409  | Conflict (duplicate key)         |
| 422  | Unprocessable Entity (validation)|
| 500  | Internal Server Error            |

---

## 🧰 Tech Stack

| Package            | Purpose                          |
|--------------------|----------------------------------|
| express            | Web framework                    |
| mongoose           | MongoDB ODM                      |
| dotenv             | Environment variable loading     |
| cors               | Cross-Origin Resource Sharing    |
| express-validator  | Request validation               |
| morgan             | HTTP request logging             |
| nodemon            | Dev auto-reload                  |
