# Products management Server

### Built with:

- **NestJS**
- **TypeORM**
- **PostgreSQL**

[![Node.js](https://img.shields.io/badge/node-%3E%3D16.13.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.0+-blue)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-compose-brightgreen)](https://www.docker.com/)

## 🚀 Quick Start

### Installation 🛠️

```bash
# Clone repository

# Install dependencies
npm install  # or pnpm install
```

### Environment Setup 🔐

```bash
# Copy and configure environment
cp env_example .env
# Edit .env with your credentials
```

### Docker Commands 🐳

```bash
# Start PostgreSQL
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Reset all data
docker-compose down -v

# Ensure Docker is running and containers are up
# Wait for PostgreSQL to initialize
```

### Runtime Commands 🏃

```bash
# Development
npm run start       # Basic start
npm run start:dev   # Watch mode

# Production
npm run build       # Compile first
npm run start:prod  # Run compiled app

```

## API Endpoints

### HTTP

- API Base: `http://localhost:3000/api`

## Project Structure

```
src/
├── modules/
│   │
│   ├── Auth/        # Authentication flows
│   ├── Categories/   # Product categories
│   ├── Product/    # Product mechanics
│   ├── Shared/    # Helpers
│
└── main.ts          # Application entry point
```
