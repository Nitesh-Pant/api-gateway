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

# ✅ API Gateway (Dwarpal)

- Reverse proxy / routing to `user-service` and `order-service`, each proxy pulled into its own middleware (`userProxy.middleware.js`, `orderProxy.middleware.js`)
- Centralized JWT verification (removed from individual services), factored into `auth.middleware.js`
- Policy-based route protection (`src/config/policies.js`) — every protected route explicitly declares which role(s) are allowed
- **Role-Based Access Control (RBAC)** — admin-only routes (e.g. list all users, list all orders) are enforced at the gateway
- Decoded user info forwarded downstream to services via the `x-user` header
- Config via `.env` (`PORT`, `JWT_SECRET`)

---

# 🚧 Coming Soon

- Rate Limiting
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

```text
api-gateway/
│
├── api-gateway-dwarpal/      # API Gateway — routing, auth, RBAC
│   ├── src/
│   │   ├── app.js
│   │   ├── config/
│   │   │   └── policies.js   # per-route auth & role rules
│   │   └── middleware/
│   │       ├── auth.middleware.js         # JWT verification + RBAC check
│   │       ├── userProxy.middleware.js    # proxy to user-service
│   │       └── orderProxy.middleware.js   # proxy to order-service
│   ├── .env                  # PORT, JWT_SECRET
│   └── package.json
│
├── user-service/
│   ├── src/
│   ├── sql/
│   ├── docker-compose.yml
│   └── ...
│
├── order-service/
│   ├── src/
│   ├── sql/
│   ├── docker-compose.yml
│   └── ...
│
├── docs/
│   └── postman/
│       └── API Gateway.postman_collection.json
│
└── README.md
```

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

## 1. Clone Repository

```bash
git clone https://github.com/<your-username>/api-gateway.git
cd api-gateway
```

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

# 📈 Project Status

| Module                       | Status         |
| ---------------------------- | -------------- |
| User Service                 | ✅ Complete    |
| Order Service                | ✅ Complete    |
| RBAC                         | ✅ Complete    |
| API Gateway (routing + auth) | ✅ Complete    |
| API Gateway (other features) | 🚧 In Progress |
| Redis Cache                  | ⏳ Planned     |
| Rate Limiter                 | ⏳ Planned     |
| Reverse Proxy                | ⏳ Planned     |
| Logging                      | ⏳ Planned     |

---

## What I'm Learning

This project is intentionally being built from scratch without using frameworks like NestJS or Kong.

The objective is to understand how production backend systems actually work internally by implementing features myself.
