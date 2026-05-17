# TaskFlow Microservices Application

A fully containerized full-stack task management application 

## Tech Stack

### Backend Services
- API Gateway: Node.js, Express, Http-Proxy-Middleware (Port 5000)
- User Service: Node.js, Express, Mongoose, JWT Authentication (Port 5001)
- Task Service: Node.js, Express, Mongoose (Port 5002)
- Notification Service: Node.js, Express, EmailJS API (Port 5003)

### Databases
- User Database: MongoDB (Isolated Container: mongo-user)
- Task Database: MongoDB (Isolated Container: mongo-task)

### Frontends
- User Frontend: React, Vite, CSS (Port 5173)
- Admin Frontend: React, Vite, CSS (Port 3000)

### Orchestration & Deployment
- Containerization: Docker
- Orchestration: Docker Compose
- Web Server: Nginx (serving frontends inside containers)

---

## Folder Structure

```text
task-manager-api/
├── .gitignore                      # Project-wide git exclusion file
├── docker-compose.yml              # Central Docker Compose orchestration file
├── api-gateway/                    # Express gateway proxy on Port 5000
│   ├── Dockerfile
│   └── server.js
├── user-service/                   # Manages auth, user profiles, and admin accounts (Port 5001)
│   ├── controllers/
│   ├── models/                     # Contains isolated User schema
│   ├── routes/
│   └── Dockerfile
├── task-service/                   # Manages task lifecycles and assignments (Port 5002)
│   ├── controllers/
│   ├── models/                     # Contains isolated Task schema
│   ├── routes/
│   └── Dockerfile
├── notification-service/           # Handles automated email alerts via EmailJS (Port 5003)
│   ├── utils/                      # Email client configurations
│   ├── server.js
│   └── Dockerfile
├── task-manager-user-frontend/     # React application for general task users (Port 5173)
│   ├── src/
│   ├── nginx.conf                  # Production routing proxy configuration
│   └── Dockerfile
└── task-manager-frontend/          # React application for system administrators (Port 3000)
    ├── src/
    ├── nginx.conf                  # Production routing proxy configuration
    └── Dockerfile
```

---

## How to Run

Docker Compose is the only supported and required method to build and run the entire application stack.

### 1. Prerequisites
- Docker Desktop must be installed and running on your system.
- Git must be installed.

### 2. Configure Environment Variables
You must verify and configure the environment files for each service. Sample or pre-configured `.env` files must be populated prior to startup. Key env files include:
- `user-service/.env` (contains MONGO_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD)
- `task-service/.env` (contains MONGO_URI, JWT_SECRET)
- `notification-service/.env` (contains EMAILJS_PRIVATE_KEY, EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID)
- `task-manager-user-frontend/.env` (contains VITE_API_URL pointing to the API Gateway)
- `task-manager-frontend/.env` (contains VITE_API_URL pointing to the API Gateway)

*Note: In the local microservice environment, the User and Task service databases are automatically hosted by the local MongoDB containers on `mongodb://mongo-user:27017/TaskManagerUser` and `mongodb://mongo-task:27017/TaskManager` respectively.*

### 3. Start the Application
Open a terminal in the root directory and run the following command to compile the code, pull the base images, and initialize the containers:
```bash
docker-compose up --build -d
```

Once execution completes, all 8 containers will be running in the background.

### 4. Access Links
- User Interface: http://localhost:5173
- Admin Dashboard: http://localhost:3000
- API Gateway Entrypoint: http://localhost:5000

---

## Developer Commands and Operations

Common commands used during developer cycles:

### Check Running Container Health
```bash
docker-compose ps
```

### View Real-Time Output Logs
To inspect system logs globally:
```bash
docker-compose logs -f
```

To tail logs for a specific service (e.g., `user-service`):
```bash
docker-compose logs -f user-service
```

### Recreate and Apply Changes
If you modify source code in one of the backend services or static frontends, you must force a rebuild and update the active container:
```bash
docker-compose stop <service-name>
docker-compose rm -f <service-name>
docker-compose up -d --build <service-name>
```
*Example for task-service:*
```bash
docker-compose stop task-service; docker-compose rm -f task-service; docker-compose up -d --build task-service
```

### Stop All Services
To suspend execution and stop all microservice containers:
```bash
docker-compose down
```

To tear down all microservices, networks, and clear persistent volumes:
```bash
docker-compose down -v
```
