# API Gateway — The Dwarpal 🚪

![](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js&logoColor=white)
![](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white)
![](https://img.shields.io/badge/MySQL-8-4479A1?style=flat-square&logo=mysql&logoColor=white)
![](https://img.shields.io/badge/Redis-7-DC382D?style=flat-square&logo=redis&logoColor=white)
![](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![](https://img.shields.io/badge/Status-In%20Progress-orange?style=flat-square)

A production-inspired microservices project built with **Node.js, Express, MySQL, Redis, and Docker**.

This microservices project with a custom-built API Gateway in front of independent services (User, Order), demonstrating routing, auth, rate limiting, load balancing, and async processing.

The goal of this project is **not** to build another CRUD application. It is to understand how modern backend systems are designed internally—API Gateway, authentication, rate limiting, service-to-service communication, load balancing, caching, background jobs, and distributed system concepts.

This project is being built feature-by-feature, exactly as it would evolve in a real company.

## Services

- **api-gateway** — routing, auth, rate limiting, load balancing, logging
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

# 🚧 Coming Soon

- API GATEWAY

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
├── api-dwar/                # API Gateway (Coming Soon)
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
├── postman/
│   └── API Gateway.postman_collection.json
│
└── README.md
```

---

# 🧠 Why this project?

Most tutorials stop after CRUD.

This project focuses on the backend concepts used in production systems:

- Authentication
- Authorization
- API Gateway
- Rate Limiting
- Reverse Proxy
- Service Communication
- Logging

---

# 🚀 Running the Project

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

# 📮 API Testing

The project is tested using **Postman**.

A Postman Collection is included inside the repository.

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

## User APIs

POST /register

POST /login

GET /profile

---

## Order APIs

POST /orders

GET /orders/:id

GET /orders/user

---

# 🔐 Authentication

Authentication is currently handled independently inside each service using JWT.

JWT verification will be removed from individual services and centralized in the API Gateway.

---

# 📈 Project Status

| Module        | Status         |
| ------------- | -------------- |
| User Service  | ✅ Complete    |
| Order Service | ✅ Complete    |
| API Gateway   | 🚧 In Progress |
| Redis Cache   | ⏳ Planned     |
| Rate Limiter  | ⏳ Planned     |
| Reverse Proxy | ⏳ Planned     |
| Logging       | ⏳ Planned     |

---

## What I'm Learning

This project is intentionally being built from scratch without using frameworks like NestJS or Kong.

The objective is to understand how production backend systems actually work internally by implementing features myself.
