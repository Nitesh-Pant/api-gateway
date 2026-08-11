# API Gateway — The Dwarpal 🚪

![](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js&logoColor=white)
![](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white)
![](https://img.shields.io/badge/MySQL-8-4479A1?style=flat-square&logo=mysql&logoColor=white)
![](https://img.shields.io/badge/Redis-7-DC382D?style=flat-square&logo=redis&logoColor=white)
![](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![](https://img.shields.io/badge/Status-In%20Progress-orange?style=flat-square)

A production-inspired microservices project built with **Node.js, Express, MySQL, Redis, and Docker**.

This is a microservices project with a custom-built API Gateway (**Dwarpal**) sitting in front of independent services (User, Order), demonstrating routing, centralized authentication, role-based access control, rate limiting, and async processing.

The goal of this project is **not** to build another CRUD application. It is to understand how modern backend systems are designed internally—API Gateway, authentication, rate limiting, service-to-service communication, caching, background jobs, and distributed system concepts.

This project is being built feature-by-feature, exactly as it would evolve in a real company.

## Services

- **api-gateway-dwarpal** — single entry point: reverse proxy, centralized JWT authentication, RBAC, routing to services
- **user-service** — user registration, login, profile
- **order-service** — order creation and management

## Status (Current Progress)

# ✅ User Service

- User Registration
- User Login
- JWT Authentication
- Password Hashing (bcrypt)
- Get Profile API
- MySQL (Raw SQL)
- Dockerized Database
- Role field (`user` / `admin`) on the user model, used for RBAC

---

# ✅ Order Service

- Create Order
- Get Order
- Get Orders by User
- JWT Verification
- Static Product Catalog (temporary)
- MySQL (Raw SQL)
- Dockerized Database

---

<!-- # ✅ API Gateway (Dwarpal)

- Reverse proxy / routing to `user-service` and `order-service`, each proxy pulled into its own middleware (`userProxy.middleware.js`, `orderProxy.middleware.js`)
- Centralized JWT verification (removed from individual services), factored into `auth.middleware.js`
- Policy-based route protection (`src/config/policies.js`) — every protected route explicitly declares which role(s) are allowed
- **Role-Based Access Control (RBAC)** — admin-only routes (e.g. list all users, list all orders) are enforced at the gateway
- Decoded user info forwarded downstream to services via the `x-user` header
- Config via `.env` (`PORT`, `JWT_SECRET`)

--- -->

# ✅ API Gateway — Dwarpal

### Routing / Reverse Proxy

- Routes incoming requests to `user-service` and `order-service`
- Separate proxy middleware for each service
- Gateway acts as the single entry point for clients

### Authentication

- Centralized JWT verification
- JWT verification happens at the gateway instead of every service
- Protected routes require a valid token
- Public routes such as registration and login bypass authentication

### RBAC

- Policy-based route protection
- Route policies are defined in:

```text
src/config/policies.js
```

- Each protected route explicitly defines allowed roles
- Current roles:
    - `user`
    - `admin`
- Admin-only APIs are rejected at the gateway when accessed by normal users

### User Context Forwarding

After successful JWT verification, the decoded user information is forwarded to downstream services through the request headers.

```text
Client
   ↓
JWT
   ↓
API Gateway
   ↓
JWT Verification
   ↓
RBAC
   ↓
x-user
   ↓
User / Order Service
```

This allows downstream services to know who made the request without having to independently verify the JWT again.

### Rate Limiting

- Token Bucket rate limiter implemented at the API Gateway
- Redis is used to store rate-limit state
- Each user has an independent rate-limit bucket
- Rate-limit configuration is maintained separately from the middleware
- Returns `429 Too Many Requests` when the bucket has no available tokens

Example configuration:

```text
Capacity    = 5 tokens
Refill Rate = 5 tokens / minute
```

Redis keys follow the pattern:

```text
rate-limit:user:<userId>
```

### Rate Limiter Reference Implementation

A simple in-memory rate limiter is also implemented without Redis to understand the Token Bucket algorithm before moving the state to Redis.

The in-memory implementation is only for learning/reference purposes and is not suitable for a multi-instance production gateway because each Node.js process would maintain its own independent state.

### Redis

Redis is integrated with the API Gateway and runs through Docker Compose.

Redis is currently used for:

- Rate-limit state
- Shared state between gateway instances

The Redis configuration is maintained separately inside the gateway configuration.

### Gateway Request Flow

```text
Client
  ↓
API Gateway
  ↓
Authentication
  ↓
RBAC
  ↓
Rate Limiting
  ↓
Reverse Proxy / Routing
  ↓
User Service / Order Service
```

---

# 🚧 Coming Soon

- Redis Caching
- Centralized Logging

---

## Tech Stack

- Node.js / Express
- MySQL (raw SQL, no ORM)
- Redis
- BullMQ
- Docker
- Docker Compose
- JWT
- bcrypt
- Postman

# 🏗️ Project Structure

``text
api-gateway/
│
├── api-gateway-dwarpal/ # API Gateway — routing, auth, RBAC, rate limiting
│ ├── src/
│ │ ├── app.js
│ │ ├── config/
│ │ │ ├── policies.js # per-route auth & role rules
│ │ │ └── redis.js # Redis client/connection config
│ │ ├── constants/
│ │ │ └── rateLimit.constants.js # bucket capacity, refill rate, etc.
│ │ └── middleware/
│ │ ├── auth.middleware.js # JWT verification + RBAC check
│ │ ├── userProxy.middleware.js # proxy to user-service
│ │ ├── orderProxy.middleware.js # proxy to order-service
│ │ ├── tokenBucket.middleware.js # Redis-backed token bucket rate limiter
│ │ └── staticRateLimiter.middleware.js # in-memory token bucket (reference only, no Redis)
│ ├── docker-compose.yml # Redis for the gateway
│ ├── .env # PORT, JWT_SECRET
│ └── package.json
│
├── user-service/
│ ├── src/
│ ├── sql/
│ ├── docker-compose.yml
│ └── ...
│
├── order-service/
│ ├── src/
│ ├── sql/
│ ├── docker-compose.yml
│ └── ...
│
├── docs/
│ └── postman/
│ └── API Gateway.postman_collection.json
│
└── README.md

````
---

# 🧠 Why this project?

Most tutorials stop after CRUD.

This project focuses on the backend concepts used in production systems:

- Authentication
- Authorization (RBAC)
- API Gateway
- Rate Limiting
- Reverse Proxy
- Service Communication
- Logging

---

# 🚀 Running the Project

> [Aug 10th] Auth is now centralized in the API Gateway. Start the two backing services first (so the gateway has something to proxy to), then start the gateway itself — **all requests go through the gateway from now on**, not directly to the individual services.

> [Aug 12th] The gateway now depends on Redis for rate limiting. Start Redis (via the gateway's own `docker-compose.yml`) before starting the gateway, or the token bucket middleware won't have anywhere to store bucket state.


## 1. Clone Repository

```bash
git clone https://github.com/<your-username>/api-gateway.git
cd api-gateway
````

---

## 2. Start User Service

```bash
cd user-service

docker compose up -d

npm install

npm run dev
```

Runs on

```
http://localhost:4001
```

---

## 3. Start Order Service

```bash
cd order-service

docker compose up -d

npm install

npm run dev
```

Runs on

```
http://localhost:4002
```

---

## 4. Start API Gateway (Dwarpal)

```bash
cd api-gateway-dwarpal

docker compose up -d   # starts Redis

npm install

npm run dev
```

Runs on

```
http://localhost:4000
```

> ⚠️ [Aug 10th] From this point on, **use the gateway as the single entry point** (`http://localhost:4000`) for all API calls instead of hitting `user-service` or `order-service` directly — that's the whole point of the gateway.

---

# 📮 API Testing

The project is tested using **Postman**.

A Postman Collection is included inside the repository (`docs/postman/`).

Example flow:

```
Register User
      ↓
Login
      ↓
Copy JWT
      ↓
Create Order
      ↓
Get Orders
```

---

## User APIs (via Gateway → `/users/*`)

| Method | Route             | Auth | Role            |
| ------ | ----------------- | ---- | --------------- |
| POST   | `/users/register` | No   | —               |
| POST   | `/users/login`    | No   | —               |
| GET    | `/users/:id`      | Yes  | `user`, `admin` |
| GET    | `/users/a/users`  | Yes  | `admin` only    |

---

## Order APIs (via Gateway → `/orders/*`)

| Method | Route              | Auth | Role            |
| ------ | ------------------ | ---- | --------------- |
| POST   | `/orders/`         | Yes  | `user`, `admin` |
| GET    | `/orders/me`       | Yes  | `user`, `admin` |
| GET    | `/orders/:id`      | Yes  | `user`, `admin` |
| GET    | `/orders/a/orders` | Yes  | `admin` only    |

---

# 🔐 Authentication & Authorization

Authentication and authorization used to be handled independently inside each service using JWT. That has now been **centralized in the API Gateway**, in `auth.middleware.js`:

- Every incoming request is matched against a route policy defined in `api-gateway-dwarpal/src/config/policies.js`.
- Each policy declares whether the route requires auth (`auth: true/false`) and, for every protected route, which role(s) are permitted (e.g. `role: ["user", "admin"]` or `role: ["admin"]`).
- If auth is required, the gateway verifies the JWT (using `JWT_SECRET` from `.env`) and rejects the request with `401` if it's missing/invalid.
- The decoded token's `role` claim is then checked against the route's allowed roles, and the request is rejected with `403` if it doesn't match — this is the **RBAC** layer, and it's now explicit on every protected route rather than only on admin-only ones.
- On success, the decoded user is attached to the request and forwarded to the downstream service via the `x-user` header, so `user-service` and `order-service` no longer need to verify JWTs themselves (their own auth middleware is now unused/commented out).
- Routing to each service is handled by its own proxy middleware (`userProxy.middleware.js`, `orderProxy.middleware.js`), applied after the auth check passes.

Roles currently supported: `user` and `admin` (stored on the `users` table).

---

# 🚦 Rate Limiting

Rate limiting is enforced at the gateway using a **token bucket** algorithm, backed by Redis so bucket state survives restarts and works across multiple gateway instances:

- `tokenBucket.middleware.js` is the actual rate limiter used in the request path — it reads/writes each user's bucket (tokens, last refill time) in Redis, connected via `src/config/redis.js`.
- Bucket parameters (capacity, refill rate, etc.) are centralized in `src/constants/`, rather than hardcoded in the middleware, so limits can be tuned in one place.
- `staticRateLimiter.middleware.js` is a separate, in-memory token bucket implementation kept purely as a **reference** — it's not wired into any route, and exists to reason about token bucket behavior without Redis as a dependency.
- Redis for the gateway is started via its own `docker-compose.yml`.

---

# 📈 Project Status

| Module                              | Status         |
| ----------------------------------- | -------------- |
| User Service                        | ✅ Complete    |
| Order Service                       | ✅ Complete    |
| RBAC                                | ✅ Complete    |
| API Gateway (routing + auth)        | ✅ Complete    |
| API Gateway (other features)        | 🚧 In Progress |
| Rate Limiter (Token Bucket + Redis) | ✅ Complete    |
| Redis Cache                         | ⏳ Planned     |
| Reverse Proxy                       | ⏳ Planned     |
| Logging                             | ⏳ Planned     |

---

## What I'm Learning

This project is intentionally being built from scratch without using frameworks like NestJS or Kong.

The objective is to understand how production backend systems actually work internally by implementing features myself.
