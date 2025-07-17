# Calviora API Documentation

This document describes the API endpoints available in the Calviora e-commerce platform.

## Base URL

```
http://localhost:3000
```

## Authentication

The application uses JWT tokens stored in HTTP-only cookies for authentication.

## System Endpoints

### Health Check

```http
GET /health
```

**Response:**

```json
{
    "status": "OK",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "uptime": 3600
}
```

## Public Endpoints

### Home Page

```http
GET /
```

Returns the homepage (requires login redirect if not authenticated).

## Authentication Endpoints

### User Registration

```http
POST /users/register
```

**Request Body:**

```json
{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123"
}
```

**Validation Rules:**

- `fullName`: Required, 3-50 characters, letters and spaces only
- `email`: Required, valid email format
- `password`: Required, 6+ characters, must contain uppercase, lowercase, and number

### User Login

```http
POST /users/login
```

**Request Body:**

```json
{
    "email": "john@example.com",
    "password": "password123"
}
```

### User Logout

```http
GET /users/logout
```

### Owner Login

```http
POST /owners/login
```

**Request Body:**

```json
{
    "email": "owner@example.com",
    "password": "ownerpassword"
}
```

## Protected User Endpoints

All endpoints below require user authentication.

### View Shop

```http
GET /shop
```

Returns the product listing page.

### View Account

```http
GET /account
```

Returns user account page with order history.

### Update Profile

```http
POST /users/update
```

**Request Body:**

```json
{
    "phone": "1234567890",
    "address": "123 Main St, City, State"
}
```

**Validation Rules:**

- `phone`: Optional, 10-15 digits
- `address`: Optional, max 200 characters

### View Cart

```http
GET /cart
```

Returns the shopping cart page with items and totals.

### Add to Cart

```http
GET /cart/add/:productid
```

**Parameters:**

- `productid`: MongoDB ObjectId of the product

**Rules:**

- Maximum 5 items per product
- Product ID must be valid MongoDB ObjectId

### Update Cart

```http
POST /cart/update
```

**Request Body:**

```json
{
    "productId": "60f1b2b3b4f4f4f4f4f4f4f4",
    "quantity": 2
}
```

**Validation Rules:**

- `productId`: Required, valid MongoDB ObjectId
- `quantity`: Required, integer 0-5 (0 removes item)

### Checkout

```http
POST /checkout
```

Processes the cart and creates an order.

## Protected Owner Endpoints

All endpoints below require owner authentication.

### Owner Dashboard

```http
GET /owners/admin
```

Returns the owner admin dashboard.

### Create Owner

```http
POST /owners/create
```

**Request Body:**

```json
{
    "fullName": "Owner Name",
    "email": "owner@example.com",
    "password": "ownerpassword"
}
```

## Product Management Endpoints

### Create Product

```http
POST /products/create
```

**Request Body (Form Data):**

- `name`: Product name
- `price`: Product price (number)
- `discount`: Discount percentage (0-100)
- `bgcolor`: Background color (hex)
- `panelcolor`: Panel color (hex)
- `textcolor`: Text color (hex)
- `image`: Product image file

**Validation Rules:**

- `name`: Required, 1-100 characters
- `price`: Required, positive number
- `discount`: Optional, 0-100
- Colors: Optional, valid hex format (#RRGGBB)

## Error Responses

### Validation Errors

```json
{
    "success": false,
    "message": "Validation failed",
    "errors": [
        {
            "field": "email",
            "message": "Please provide a valid email address"
        }
    ]
}
```

### Server Errors

```html
<!-- Error page with user-friendly message -->
```

## Rate Limiting

- General endpoints: 100 requests per 15 minutes per IP
- Authentication endpoints: 5 requests per 15 minutes per IP

## Security Features

- Helmet.js for security headers
- CORS protection
- Input validation and sanitization
- XSS protection
- CSRF protection (via HTTP-only cookies)
- Rate limiting
- Secure session configuration

## Status Codes

- `200`: Success
- `400`: Bad Request (validation errors)
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Too Many Requests (rate limited)
- `500`: Internal Server Error
