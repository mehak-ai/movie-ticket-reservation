# 🎬 Movie Ticket Reservation System

A full-stack movie ticket booking application built with React, Node.js, Express, and MySQL.

## Features

- 🎥 Browse available movies
- 📅 Select showtimes
- 💺 Interactive seat selection
- 🔒 Double booking prevention
- ✅ Real-time seat availability
- 📧 Booking confirmation
- 🎫 Booking reference system

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Lucide React Icons
- Axios

### Backend
- Node.js
- Express.js
- MySQL
- mysql2 (with connection pooling)

## Project Structure
```
movie-ticket-reservation/
├── frontend/          # React frontend application
├── backend/           # Node.js/Express backend API
└── docs/             # Documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/movie-ticket-reservation.git
cd movie-ticket-reservation
```

2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run setup-db
npm start
```

3. Setup Frontend
```bash
cd frontend
npm install
npm start
```

The application will open at `http://localhost:3000`

## Documentation

- [Setup Guide](docs/SETUP.md)
- [API Documentation](docs/API.md)

## Features Implementation

### Double Booking Prevention
- Database transactions with row-level locking
- Optimistic concurrency control
- Frontend button disabling during booking
- Seat conflict detection

### Security Features
- Input validation
- SQL injection prevention (parameterized queries)
- Error handling middleware
- Transaction rollback on failures

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

Your Name - your.email@example.com

Project Link: [https://github.com/yourusername/movie-ticket-reservation](https://github.com/yourusername/movie-ticket-reservation)
```

**.gitignore (Root):**
```
# Dependencies
node_modules/

# Environment variables
.env
.env.local
.env.development
.env.production

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
build/
dist/