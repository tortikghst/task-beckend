# Backend for Tasks App

## Requirements
- Docker and Docker Compose

## Quick start
1. Clone repository
2. Copy `.env.example` to `.env` (adjust variables)
3. Run `docker compose up --build`
4. API will be available at `http://localhost:3000/api`
5. Swagger documentation: `http://localhost:3000/docs`

## Environment variables
- `DATABASE_URL` – connection string for PostgreSQL
- `JWT_SECRET` – secret for JWT

## Manual start (without Docker)
- `npm install`
- Create PostgreSQL database
- Run `npx prisma migrate dev`
- `npm run start:dev`