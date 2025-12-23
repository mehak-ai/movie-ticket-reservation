# API Documentation

Base URL: `http://localhost:5000/api`

## Table of Contents
- [Movies](#movies)
- [Showtimes](#showtimes)
- [Bookings](#bookings)
- [Error Handling](#error-handling)
- [Status Codes](#status-codes)

---

## Movies

### Get All Movies
Retrieve all movies with their showtimes.

**Endpoint:**
```
GET /movies
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Inception",
    "genre": "Sci-Fi/Thriller",
    "duration": "148 min",
    "rating": "PG-13",
    "poster": "🎬",
    "description": "A thief who steals corporate secrets through dream-sharing technology.",
    "created_at": "2024-12-23T10:00:00.000Z",
    "updated_at": "2024-12-23T10:00:00.000Z",
    "showtimes": [
      {
        "id": 1,
        "movie_id": 1,
        "show_date": "2024-12-24",
        "show_time": "10:00:00",
        "available_seats": 80,
        "created_at": "2024-12-23T10:00:00.000Z",
        "updated_at": "2024-12-23T10:00:00.000Z"
      }
    ]
  }
]
```

**Status Codes:**
- `200` - Success
- `500` - Server Error

---

### Get Movie by ID
Retrieve a single movie by its ID.

**Endpoint:**
```
GET /movies/:id
```

**Parameters:**
- `id` (path parameter) - Movie ID

**Example:**
```
GET /movies/1
```

**Response:**
```json
{
  "id": 1,
  "title": "Inception",
  "genre": "Sci-Fi/Thriller",
  "duration": "148 min",
  "rating": "PG-13",
  "poster": "🎬",
  "description": "A thief who steals corporate secrets through dream-sharing technology.",
  "created_at": "2024-12-23T10:00:00.000Z",
  "updated_at": "2024-12-23T10:00:00.000Z"
}
```

**Status Codes:**
- `200` - Success
- `404` - Movie not found
- `500` - Server Error

---

### Get Movie Showtimes
Retrieve all showtimes for a specific movie.

**Endpoint:**
```
GET /movies/:id/showtimes
```

**Parameters:**
- `id` (path parameter) - Movie ID

**Example:**
```
GET /movies/1/showtimes
```

**Response:**
```json
[
  {
    "id": 1,
    "movie_id": 1,
    "show_date": "2024-12-24",
    "show_time": "10:00:00",
    "available_seats": 80,
    "created_at": "2024-12-23T10:00:00.000Z",
    "updated_at": "2024-12-23T10:00:00.000Z"
  },
  {
    "id": 2,
    "movie_id": 1,
    "show_date": "2024-12-24",
    "show_time": "14:30:00",
    "available_seats": 75,
    "created_at": "2024-12-23T10:00:00.000Z",
    "updated_at": "2024-12-23T10:00:00.000Z"
  }
]
```

**Status Codes:**
- `200` - Success
- `500` - Server Error

---

## Showtimes

### Get Showtime Details
Retrieve details of a specific showtime.

**Endpoint:**
```
GET /showtimes/:id
```

**Parameters:**
- `id` (path parameter) - Showtime ID

**Example:**
```
GET /showtimes/1
```

**Response:**
```json
{
  "id": 1,
  "movie_id": 1,
  "show_date": "2024-12-24",
  "show_time": "10:00:00",
  "available_seats": 80,
  "created_at": "2024-12-23T10:00:00.000Z",
  "updated_at": "2024-12-23T10:00:00.000Z"
}
```

**Status Codes:**
- `200` - Success
- `404` - Showtime not found
- `500` - Server Error

---

### Get Booked Seats
Retrieve all booked seats for a specific showtime.

**Endpoint:**
```
GET /showtimes/:id/booked-seats
```

**Parameters:**
- `id` (path parameter) - Showtime ID

**Example:**
```
GET /showtimes/1/booked-seats
```

**Response:**
```json
["A1", "A2", "B5", "C3", "D7", "E2"]
```

**Status Codes:**
- `200` - Success
- `500` - Server Error

---

## Bookings

### Create Booking
Create a new booking with seat selection.

**Endpoint:**
```
POST /bookings
```

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "showtime_id": 1,
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "+1234567890",
  "seats": ["A1", "A2"],
  "total_amount": 24.00
}
```

**Request Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| showtime_id | integer | Yes | ID of the showtime |
| customer_name | string | Yes | Customer's full name |
| customer_email | string | Yes | Valid email address |
| customer_phone | string | Yes | Contact phone number |
| seats | array | Yes | Array of seat numbers (e.g., ["A1", "A2"]) |
| total_amount | number | Yes | Total booking amount |

**Success Response:**
```json
{
  "success": true,
  "booking_reference": "BK1703345678123",
  "booking_id": 1,
  "message": "Booking confirmed successfully"
}
```

**Error Responses:**

*Seats Already Booked:*
```json
{
  "success": false,
  "error": "Seats already booked: A1, A2"
}
```

*Not Enough Seats Available:*
```json
{
  "success": false,
  "error": "Only 5 seats available"
}
```

*Validation Error:*
```json
{
  "success": false,
  "errors": [
    {
      "msg": "Valid email is required",
      "param": "customer_email",
      "location": "body"
    }
  ]
}
```

**Status Codes:**
- `201` - Booking created successfully
- `400` - Bad request (validation error, seats unavailable, etc.)
- `500` - Server Error

---

### Get Booking by Reference
Retrieve booking details using the booking reference number.

**Endpoint:**
```
GET /bookings/:reference
```

**Parameters:**
- `reference` (path parameter) - Booking reference number (e.g., BK1703345678123)

**Example:**
```
GET /bookings/BK1703345678123
```

**Response:**
```json
{
  "id": 1,
  "showtime_id": 1,
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "+1234567890",
  "seats": "[\"A1\",\"A2\"]",
  "total_amount": "24.00",
  "booking_reference": "BK1703345678123",
  "status": "confirmed",
  "created_at": "2024-12-23T10:30:00.000Z",
  "updated_at": "2024-12-23T10:30:00.000Z",
  "title": "Inception",
  "show_date": "2024-12-24",
  "show_time": "10:00:00"
}
```

**Status Codes:**
- `200` - Success
- `404` - Booking not found
- `500` - Server Error

---

### Cancel Booking
Cancel an existing booking and restore seats.

**Endpoint:**
```
DELETE /bookings/:reference
```

**Parameters:**
- `reference` (path parameter) - Booking reference number

**Example:**
```
DELETE /bookings/BK1703345678123
```

**Success Response:**
```json
{
  "success": true,
  "message": "Booking cancelled successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Booking not found"
}
```

**Status Codes:**
- `200` - Successfully cancelled
- `400` - Bad request
- `404` - Booking not found
- `500` - Server Error

---

## Error Handling

All endpoints follow a consistent error response format:
```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

In development mode, stack traces are included:
```json
{
  "success": false,
  "error": "Error message",
  "stack": "Error stack trace..."
}
```

---

## Status Codes

The API uses standard HTTP status codes:

| Code | Description |
|------|-------------|
| `200` | OK - Request successful |
| `201` | Created - Resource created successfully |
| `400` | Bad Request - Invalid input or business logic error |
| `404` | Not Found - Requested resource doesn't exist |
| `500` | Internal Server Error - Server-side error |

---

## Rate Limiting

Currently, there is no rate limiting implemented. This may be added in future versions.

---

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

**Note:** In a production environment, you should implement proper authentication and authorization mechanisms.

---

## CORS

The API allows Cross-Origin Resource Sharing (CORS) from all origins. In production, you should restrict this to specific domains:
```javascript
// backend/server.js
app.use(cors({
  origin: 'https://yourdomain.com'
}));
```

---

## Testing the API

### Using cURL

**Get all movies:**
```bash
curl http://localhost:5000/api/movies
```

**Create a booking:**
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "showtime_id": 1,
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "customer_phone": "+1234567890",
    "seats": ["A1", "A2"],
    "total_amount": 24.00
  }'
```

### Using Postman

1. Import the API endpoints into Postman
2. Set the base URL to `http://localhost:5000/api`
3. Add appropriate headers and body for POST requests
4. Test each endpoint

---

## Changelog

### Version 1.0.0 (Current)
- Initial API release
- Basic CRUD operations for movies, showtimes, and bookings
- Double booking prevention with database transactions
- Seat availability tracking

---

## Support

For issues or questions:
- Create an issue on GitHub
- Email: your.email@example.com

---

## License

This API is part of the Movie Ticket Reservation System and is licensed under the MIT License.