# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# Base stage (used by VS fast mode)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081
ENV ASPNETCORE_URLS=http://+:8080

# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files for restore (fixed paths)
COPY ["LogsManagement.API/LogsManagement.API.csproj", "LogsManagement.API/"]
COPY ["LogsManagement.Infrastructure.Persistence/LogsManagement.Infrastructure.Persistence.csproj", "LogsManagement.Infrastructure.Persistence/"]
COPY ["LogsManagement.Infrastructure.Migrations/LogsManagement.Infrastructure.Migrations.csproj", "LogsManagement.Infrastructure.Migrations/"]
COPY ["LogsManagement.Common.Infrastructure/LogsManagement.Common.Infrastructure.csproj", "LogsManagement.Common.Infrastructure/"]
COPY ["LogsManagement.Common.Application/LogsManagement.Common.Application.csproj", "LogsManagement.Common.Application/"]
COPY ["LogsManagement.Common.Domain/LogsManagement.Common.Domain.csproj", "LogsManagement.Common.Domain/"]
COPY ["LogsManagement.Domain/LogsManagement.Domain.csproj", "LogsManagement.Domain/"]
COPY ["LogsManagement.Common/LogsManagement.Common.csproj", "LogsManagement.Common/"]

# Restore
RUN dotnet restore "LogsManagement.API/LogsManagement.API.csproj"

# Copy source and build
COPY . .
WORKDIR /src/LogsManagement.API
RUN dotnet build "LogsManagement.API.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "LogsManagement.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "LogsManagement.API.dll"]