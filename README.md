# koda-b6-backend-node

REST API backend built with **Express.js** and **PostgreSQL**.

---

## Tech Stack

- **Runtime**: Node.js (ESM / `"type": "module"`)
- **Framework**: Express.js v5
- **Database**: PostgreSQL (`pg`)
- **Linter**: ESLint

---

## Project Structure

```
src/
├── controller/
│   ├── auth.controller.js
│   └── users.controller.js
├── lib/
│   └── db.js
├── model/
│   ├── auth.model.js
│   └── users.model.js
├── router/
│   ├── admin.router.js
│   ├── auth.router.js
│   └── users.router.js
├── app.js
└── main.js
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ghifar1327/koda-b6-backend-node.git
cd koda-b6-backend-node
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

```dotenv
PORT=

DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
DB_SSLMODE=

# Redis Configuration (Optional, for product caching)
REDIS_HOST=localhost
REDIS_PORT=6379
```

| Variable      | Description                          |
|---------------|--------------------------------------|
| `PORT`        | Port the server will run on          |
| `DB_HOST`     | PostgreSQL host                      |
| `DB_PORT`     | PostgreSQL port (default: `5432`)    |
| `DB_USERNAME` | PostgreSQL username                  |
| `DB_PASSWORD` | PostgreSQL password                  |
| `DB_NAME`     | PostgreSQL database name             |
| `DB_SSLMODE`  | SSL mode (`disable` / `require`)     |
| `REDIS_HOST`  | Redis server host (default: `localhost`) |
| `REDIS_PORT`  | Redis server port (default: `6379`)  |

### 4. Run the server

```bash
# Development (with watch mode)
npm run dev

# Production
npm start
```

---

## Scripts

| Command        | Description                        |
|----------------|------------------------------------|
| `npm run dev`  | Run with watch mode (auto-restart) |
| `npm start`    | Run in production mode             |
| `npm run lint` | Lint source files                  |
| `npm run lint:fix` | Auto-fix lint issues           |

---

## API Routes

| Prefix    | Router File          | Description       |
|-----------|----------------------|-------------------|
| `/auth`   | `auth.router.js`     | Authentication    |
| `/users`  | `users.router.js`    | User management   |
| `/admin`  | `admin.router.js`    | Admin operations  |

---

## Caching (Redis)

Redis caching is implemented for the **Product** endpoints to improve performance.

### Features

- **Automatic caching** of product queries with 1-hour TTL (Time To Live)
- **Cache invalidation** on CREATE, UPDATE, and DELETE operations
- **Fallback mode**: Application continues to work without Redis if it's unavailable
- **Cache keys**:
  - `products:all` - All products list
  - `product:{id}` - Individual product
  - `product:variants:{id}` - Product variants
  - `product:sizes:{id}` - Product sizes

### Setup Redis

1. **Install Redis**:
   ```bash
   # macOS
   brew install redis

   # Ubuntu/Debian
   sudo apt-get install redis-server

   # Docker
   docker run -d -p 6379:6379 redis:latest
   ```

2. **Update `.env`**:
   ```dotenv
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```

3. **Start Redis server**:
   ```bash
   # macOS / Ubuntu
   redis-server

   # Docker (if using container)
   docker start <redis-container-id>
   ```

### Cached Endpoints

The following product endpoints use caching:

| Method | Endpoint                  | Cached |
|--------|---------------------------|--------|
| GET    | `/product`                | ✅ Yes |
| GET    | `/product/:id`            | ✅ Yes |
| GET    | `/product/:id/variants`   | ✅ Yes |
| GET    | `/product/:id/sizes`      | ✅ Yes |
| POST   | `/product`                | ❌ Invalidates cache |
| PUT    | `/product/:id`            | ❌ Invalidates cache |
| DELETE | `/product/:id`            | ❌ Invalidates cache |

---

## License

ISC