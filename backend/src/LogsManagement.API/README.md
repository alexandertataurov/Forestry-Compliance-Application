# LogsManagement

Logging management system on .NET 8 with PostgreSQL and Docker. Supports running API locally while using DB in Docker, or running everything in containers.

## Prerequisites
- .NET 8 SDK
- Docker Desktop
- Visual Studio 2022 or VS Code

## Run modes

### A) Local API + DB in Docker (recommended)
- Start PostgreSQL (external port 5433):
  - PowerShell: ./Scripts/start-docker-db.ps1
  - Or: docker compose -f docker-compose.dev.yml up -d logs-postgres logs-pgadmin
- Ensure appsettings.Development.json uses:
  - ConnectionStrings:DefaultConnection = Host=localhost;Port=5433;Database=logs_management;Username=postgres;Password=password123
- Run API:
  - Visual Studio: Start the LogsManagement.API project
  - CLI: dotnet run --project LogsManagement.API

Services:
- API: http://localhost:5171 (Swagger: /swagger)
- DB: localhost:5433 (db=logs_management, user=postgres, pass=password123)
- pgAdmin: http://localhost:5050 (admin@example.com / admin123)

### B) Everything in Docker
- docker compose -f docker-compose.dev.yml up -d --build
- API: http://localhost:5000/swagger
- DB (from host): localhost:5433; from containers: host logs-postgres:5432

### C) Fully local (no Docker)
- Install PostgreSQL locally
- Use DefaultConnection with Host=localhost;Port=5432
- Run API from Visual Studio or dotnet run

## Configuration

- Connection string resolution order:
  - ConnectionStrings:logs-management
  - ConnectionStrings:postgres
  - ConnectionStrings:DefaultConnection
  - Fallback (Development): Host=localhost;Port=5433;Database=logs_management;Username=postgres;Password=password123
- JWT (appsettings.json / appsettings.Docker.json):
  - Jwt:Key (min 32 chars), Jwt:Issuer, Jwt:Audience, Jwt:ExpiryMinutes
- Swagger auth:
  - Click Authorize and paste only the token (Swagger auto-adds “Bearer ”)

## EF Core migrations

Migrations assembly: LogsManagement.Infrastructure.Migrations

- Add migration:
  - dotnet ef migrations add <Name> -p LogsManagement.Infrastructure.Migrations -s LogsManagement.API -c LogsManagement.Infrastructure.Persistence.LogsManagementDbContext
- Update database:
  - dotnet ef database update -p LogsManagement.Infrastructure.Migrations -s LogsManagement.API -c LogsManagement.Infrastructure.Persistence.LogsManagementDbContext
- In Development, pending migrations apply automatically on startup.

## Seeding

On first run (Development):
- System roles are created
- Role permissions are assigned
- Default admin user is created:
  - Email: admin@logsmanagement.com
  - Password: Admin123!
  - Change password after first login

## Auth endpoints
- POST /api/Auth/login
- POST /api/Auth/register
- POST /api/Auth/refresh
- POST /api/Auth/logout (requires auth)
- GET  /api/Auth/me (requires auth)

Note: If you changed JWT settings, restart API and obtain a new token via /api/Auth/login.

## Troubleshooting

- API can’t connect to DB:
  - Ensure Docker DB is up: docker ps
  - Check logs: docker logs logs_postgres_dev
  - Verify port mapping: docker compose uses 5433:5432; app uses Port=5433
- Port conflicts:
  - If 5432 is taken, compose maps DB to 5433 externally (already configured)
- 401 Unauthorized:
  - Paste only the JWT token in Swagger Authorize
  - Ensure Jwt:Key/Issuer/Audience are the same for generation and validation
  - Re-login after any JWT config changes
- Reset Docker volumes (data loss):
  - docker compose -f docker-compose.dev.yml down -v

## Health
- API health: GET /health

