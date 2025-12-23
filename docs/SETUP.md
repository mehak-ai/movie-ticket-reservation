# Setup Guide

## Prerequisites

- Node.js v14+ installed
- MySQL v8.0+ installed and running
- npm or yarn package manager

## Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**
```bash
cp .env.example .env
```

Edit `.env` file with your MySQL credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=movie_booking
PORT=5000
```

4. **Setup database:**
```bash
npm run setup-db
```

This will create the database, tables, indexes, and insert sample data.

5. **Start the server:**
```bash
npm start
# or for development with auto-reload
npm run dev
```

Server will run on `http://localhost:5000`

## Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## Verification

1. Check backend health: `http://localhost:5000/api/health`
2. Get movies: `http://localhost:5000/api/movies`
3. Open frontend: `http://localhost:3000`

## Troubleshooting

### MySQL Connection Error
- Verify MySQL is running
- Check credentials in `.env`
- Ensure user has proper permissions

### Port Already in Use
- Change PORT in `.env` for backend
- Frontend port can be changed in package.json

### CORS Issues
- Ensure backend is running before frontend
- Check CORS configuration in backend/server.js