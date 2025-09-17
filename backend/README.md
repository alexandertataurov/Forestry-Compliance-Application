# LogsManagement

Logging management system on .NET 8 using PostgreSQL, Docker, and .NET Aspire.

## 🏗️ Architecture

Follows Clean Architecture with the following projects:

- LogsManagement.API — ASP.NET Core Web API
- LogsManagement.API.AppHost — .NET Aspire orchestrator
- LogsManagement.API.ServiceDefaults — shared Aspire services (health, discovery, OpenTelemetry)
- LogsManagement.Domain — domain models and entities
- LogsManagement.Common.Domain — shared domain components
- LogsManagement.Common.Application — shared application components
- LogsManagement.Common.Infrastructure — shared infrastructure components
- LogsManagement.Infrastructure.Persistence — EF Core and database access
- LogsManagement.Infrastructure.Migrations — EF Core migrations assembly

Key features:
- .NET 8, ASP.NET Core, EF Core (PostgreSQL)
- Health checks and OpenTelemetry via .NET Aspire defaults
- Automatic migrations in Development
- Swagger in Development

## 📋 Prerequisites

- .NET 8 SDK
- Docker Desktop
- Visual Studio 2022 or VS Code
- PowerShell (for scripts, if used)

## ⚡ Quick start

### Option A — Docker Compose (recommended for dev)
- Start:
  - docker compose -f docker-compose.dev.yml up -d --build
- Services:
  - API: http://localhost:5000 (Swagger: /swagger)
  - PostgreSQL: localhost:5432
    - DB: logs_management
    - User: postgres
    - Password: password123
  - pgAdmin: http://localhost:5050
    - Email: admin@example.com
    - Password: admin123
    - In pgAdmin, add a server: Host: logs-postgres, User: postgres, Password: password123

Notes:
- API container runs with ASPNETCORE_ENVIRONMENT=Development and uses ConnectionStrings__DefaultConnection from docker-compose.
- Health checks are exposed; DB readiness is enforced via depends_on + healthcheck.

### Option B — .NET Aspire AppHost
- Run the orchestrator:
  - dotnet run --project LogsManagement.API.AppHost/LogsManagement.API.AppHost.csproj
- AppHost provisions PostgreSQL (password: password123) and runs the API with Development environment.

### Option C — Local (without Docker)
1) Install PostgreSQL 16 and create database logs_management.
2) Set connection string (appsettings.json or user-secrets):
   - Host=localhost;Port=5432;Database=logs_management;Username=postgres;Password=password123
3) Start API:
   - In Visual Studio: set LogsManagement.API as startup project and press __Start Debugging__.
   - Or CLI: dotnet run --project LogsManagement.API/LogsManagement.API.csproj

Migrations are applied automatically at startup in Development.

## 🗄️ Configuration

- Connection string key: ConnectionStrings:DefaultConnection
  - Overridable via environment variable: ConnectionStrings__DefaultConnection
- ASP.NET environment: ASPNETCORE_ENVIRONMENT (Development by default in dev setups)
- Migrations factory also reads env vars with prefix LOGSMANAGEMENT_ in design-time scenarios.

Effective dev values in repository:
- Docker/Compose: Host=logs-postgres;Port=5432;Database=logs_management;Username=postgres;Password=password123
- Local fallback (Program.cs): Host=localhost;Port=5432;Database=logs_management;Username=postgres;Password=password123

Security note: credentials are for development only.

## 🔧 Entity Framework Core migrations

The migrations assembly is LogsManagement.Infrastructure.Migrations. Design-time factory resolves appsettings automatically.

- Add a migration:
  - dotnet ef migrations add <Name> -p LogsManagement.Infrastructure.Migrations -s LogsManagement.API -c LogsManagement.Infrastructure.Persistence.LogsManagementDbContext
- Update database:
  - dotnet ef database update -p LogsManagement.Infrastructure.Migrations -s LogsManagement.API -c LogsManagement.Infrastructure.Persistence.LogsManagementDbContext

In Development, the API applies pending migrations on startup after the DB becomes available.

## 🩺 Health and diagnostics

- Liveness/readiness: GET /health
- Database health: GET /health/database (shows connectivity and migrations info)
- Swagger: /swagger (Development only)
- OpenTelemetry:
  - Enabled via ServiceDefaults; to export to OTLP set OTEL_EXPORTER_OTLP_ENDPOINT (e.g., http://otel-collector:4317)

## 📝 Notes and tips

- If API can’t connect to DB on startup, it retries until PostgreSQL is ready (see logs).
- To reset Docker volumes (data loss!):
  - docker compose -f docker-compose.dev.yml down -v
  - docker volume ls | find “postgres_dev_data” / “pgadmin_dev_data”
- Visual Studio:
  - Multiple startup: Solution properties → __Common Properties > Startup Project__ → __Multiple startup projects__.

