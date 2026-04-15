# koda-b6-backend-node

REST API backend for the coffee shop project, built with Express.js, PostgreSQL, JWT auth, file upload, and Redis caching.

## Tech Stack

- Node.js
- Express.js
- PostgreSQL with `pg`
- Redis
- JWT
- Multer
- Swagger

## Project Structure

```text
src/
├── controller/
├── lib/
├── middleware/
├── models/
├── routes/
├── main.js
└── ...
```

## Getting Started

### 1. Clone repository

```bash
git clone https://github.com/ghifar1327/koda-b6-backend-node.git
cd koda-b6-backend-node
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Example:

```dotenv
PORT=8888

DATABASE_URL=postgres://username:password@localhost:5432/database_name?sslmode=disable

SECRET_KEY=your_secret_key_here

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password_here

CORS_ORIGINS=["http://localhost:5173"]
```

### 4. Run the server

```bash
npm run dev
```

For production:

```bash
npm start
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Run server with watch mode |
| `npm start` | Run server normally |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix lint issues automatically |

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Port used by the Express server |
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | Secret key for JWT token signing |
| `REDIS_HOST` | Redis host |
| `REDIS_PORT` | Redis port |
| `REDIS_PASSWORD` | Redis password |
| `CORS_ORIGINS` | Allowed origins for CORS, stored as JSON array string |

## API Documentation

Swagger UI is available after the server starts:

```text
http://localhost:PORT/api-docs
```

Example:

```text
http://localhost:8888/api-docs
```

## Main Route Prefixes

| Prefix | Description |
|---|---|
| `/auth` | Authentication, profile update, forgot/reset password |
| `/admin` | Admin endpoints |
| `/cart` | Cart endpoints |
| `/landing` | Landing page endpoints |
| `/master` | Master data endpoints |
| `/products` | Product endpoints |
| `/transactions` | Transaction endpoints |

## Notes

- Static uploaded files are served from `/uploads`
- `PATCH /auth/:id/update` supports partial update behavior
- Profile update can accept standard JSON requests
- The backend also handles text body requests for profile update when the frontend sends serialized JSON as `text/plain`
- Redis is optional; if Redis connection fails, the application still runs without caching

## Example Profile Update Request

```http
PATCH /auth/:id/update
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "full_name": "Ghifar",
  "email": "ghifar@example.com",
  "phone": "08123456789",
  "address": "Jakarta"
}
```

## Redis Caching

Redis is used for product caching to improve read performance.

Features:

- Cache for product list and detail endpoints
- Cache invalidation on data changes
- Safe fallback when Redis is unavailable

## License

ISC
