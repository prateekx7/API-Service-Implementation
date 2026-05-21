# API Service Implementation

A scalable backend service using Node.js, Express, and TypeScript having:

- Rate-limited request handling
- Product catalog management
- Media URL management
- Pagination support
- Concurrency-safe in-memory storage
- Optimized list vs detail API design

---

# Tech Stack

- Node.js
- Express.js
- TypeScript
- In-memory storage using JavaScript Maps

---

# Features

## Part 1 — Rate Limited API

- Rolling 1-minute rate limiting window
- Maximum 5 accepted requests per user
- Concurrency-safe request handling using mutex locking
- User statistics endpoint
- Proper HTTP status codes
- Invalid JSON handling

## Part 2 — Product Catalog API

- Product creation
- Media URL management
- Pagination support
- Separate lightweight list and detailed product endpoints
- URL validation
- Duplicate SKU prevention
- Optimized in-memory storage design

---

# Project Structure

```txt
src/
├── controllers/
├── middleware/
├── routes/
├── scripts/
├── services/
├── store/
├── types/
├── utils/
├── index.ts
```

---

# Installation & Setup

## Clone Repository

```bash
git clone <your-repository-url>
cd <repository-name>
```

## Install Dependencies

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

Server runs on:

```txt
http://localhost:3000
```

---

# Build Project

```bash
npm run build
```

---

# API Details

# Part 1 — Rate Limited API

---

## POST /request

Accepts a request for a user while enforcing rate limiting.

### Request Body

```json
{
  "user_id": "user1",
  "payload": {
    "message": "hello"
  }
}
```

### Success Response

Status Code:

```txt
201 Created
```

Response:

```json
{
  "message": "Request accepted."
}
```

### Rate Limit Exceeded

Status Code:

```txt
429 Too Many Requests
```

Response:

```json
{
  "error": "Rate limit exceeded. Max 5 requests per minute."
}
```

### Validation Errors

Status Code:

```txt
400 Bad Request
```

Example:

```json
{
  "error": "user_id is required and must be non-empty"
}
```

---

## GET /stats

Returns rate limiting statistics for users.

### Response

```json
{
  "user1": {
    "accepted_requests_current_window": 5,
    "rejected_requests_total": 2
  }
}
```

---

# Rate Limiting Design

This implementation uses a rolling 1-minute window.

For every incoming request:

1. Expired timestamps older than 60 seconds are removed
2. Current request count is checked
3. Request is accepted or rejected accordingly

---

# Concurrency Safety

A mutex-based locking mechanism is implemented per user to ensure concurrent requests cannot bypass the rate limiter.

This prevents race conditions where multiple parallel requests could otherwise exceed the allowed request limit.

---

# Part 2 — Product Catalog API

---

## Product Data Model

Products and media are stored separately in memory.

### Product Metadata Store

Stores lightweight product information:

- id
- name
- sku
- imageCount
- videoCount
- thumbnailUrl
- createdAt

### Product Media Store

Stores heavy media arrays separately:

- imageUrls
- videoUrls

This ensures the product listing endpoint remains lightweight and performant.

---

## POST /products

Creates a product.

### Request Body

```json
{
  "name": "Widget A",
  "sku": "SKU-001",
  "image_urls": [
    "https://cdn.example.com/products/sku-001/img-1.jpg"
  ],
  "video_urls": [
    "https://cdn.example.com/products/sku-001/demo.mp4"
  ]
}
```

### Success Response

Status Code:

```txt
201 Created
```

Response:

```json
{
  "id": "generated-id",
  "name": "Widget A",
  "sku": "SKU-001",
  "imageCount": 1,
  "videoCount": 1,
  "thumbnailUrl": "https://cdn.example.com/products/sku-001/img-1.jpg",
  "createdAt": 1230000000000
}
```

---

## GET /products

Returns paginated lightweight product list.

### Query Parameters

| Parameter | Description | Default |
|---|---|---|
| limit | Number of products | 20 |
| offset | Starting index | 0 |

Maximum limit allowed:

```txt
100
```

### Example Request

```txt
GET /products?limit=20&offset=0
```

### Response

```json
{
  "limit": 20,
  "offset": 0,
  "count": 1,
  "products": [
    {
      "id": "generated-id",
      "name": "Widget A",
      "sku": "SKU-001",
      "imageCount": 1,
      "videoCount": 1,
      "thumbnailUrl": "https://cdn.example.com/products/sku-001/img-1.jpg",
      "createdAt": 1740000000000
    }
  ]
}
```

Important:

The list endpoint intentionally does NOT return full media arrays to avoid unnecessary loading and serialization overhead.

---

## GET /products/:id

Returns detailed product information including all media URLs.

### Response

```json
{
  "id": "generated-id",
  "name": "Widget A",
  "sku": "SKU-001",
  "imageCount": 1,
  "videoCount": 1,
  "thumbnailUrl": "https://cdn.example.com/products/sku-001/img-1.jpg",
  "createdAt": 1230000000000,
  "image_urls": [
    "https://cdn.example.com/products/sku-001/img-1.jpg"
  ],
  "video_urls": [
    "https://cdn.example.com/products/sku-001/demo.mp4"
  ]
}
```

### Not Found

```json
{
  "error": "Product not found"
}
```

---

## POST /products/:id/media

Appends media URLs to an existing product.

### Request Body

```json
{
  "image_urls": [
    "https://cdn.example.com/products/sku-001/img-2.jpg"
  ]
}
```

### Success Response

```json
{
  "id": "generated-id",
  "name": "Widget A",
  "sku": "SKU-001",
  "image_urls": [
    "https://cdn.example.com/products/sku-001/img-1.jpg",
    "https://cdn.example.com/products/sku-001/img-2.jpg"
  ]
}
```

---

# Validation Rules

## Product Validation

- name must be non-empty
- sku must be non-empty
- sku must be unique
- URLs must use:
  - http://
  - https://
- Maximum URL length:
  - 2048 characters
- Maximum URLs per request:
  - 20 per array

---

# Seed Script

A seed script is included for generating large datasets.

It creates:
- 1000 products
- 10 image URLs per product

## Run Seed Script

Start server first:

```bash
npm run dev
```

Then run:

```bash
npm run seed
```

---

# Error Handling

The application includes:

- Centralized error middleware
- Invalid JSON handling
- Proper HTTP status codes
- Structured JSON error responses

---

# Production Considerations

This implementation uses in-memory storage and is designed for a single-instance environment.

Current limitations:

- Data is lost on server restart
- Not horizontally scalable
- No persistent database
- No authentication layer

For production deployment:

- Redis would be used for distributed rate limiting
- PostgreSQL would be used for persistent product storage
- CDN-backed media hosting would replace raw media URLs
- Docker + Kubernetes could be used for scaling
- Authentication and authorization would be added

---

# Testing

The APIs were tested using:

- curl
- Postman

---

# Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run seed
```

---

# Notes

- In-memory Maps are used for fast lookups
- Product list and media storage are intentionally separated for performance optimization
- The service is designed to prioritize clarity, correctness, and scalability of API design