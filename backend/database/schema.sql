-- Create database
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'movie_booking')
  CREATE DATABASE movie_booking;
GO

USE movie_booking;
GO

-- Movies table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'movies')
CREATE TABLE movies (
  id INT PRIMARY KEY IDENTITY(1,1),
  title VARCHAR(255) NOT NULL,
  genre VARCHAR(100),
  duration VARCHAR(50),
  rating VARCHAR(10),
  poster VARCHAR(255),
  description TEXT,
  created_at DATETIME DEFAULT GETDATE(),
  updated_at DATETIME DEFAULT GETDATE()
);
GO

-- Showtimes table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'showtimes')
CREATE TABLE showtimes (
  id INT PRIMARY KEY IDENTITY(1,1),
  movie_id INT NOT NULL,
  show_date DATE NOT NULL,
  show_time TIME NOT NULL,
  available_seats INT DEFAULT 80,
  created_at DATETIME DEFAULT GETDATE(),
  updated_at DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);
GO

CREATE INDEX idx_movie_date_time ON showtimes(movie_id, show_date, show_time);
GO

-- Bookings table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'bookings')
CREATE TABLE bookings (
  id INT PRIMARY KEY IDENTITY(1,1),
  showtime_id INT NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20),
  seats NVARCHAR(MAX) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  booking_reference VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'confirmed',
  created_at DATETIME DEFAULT GETDATE(),
  updated_at DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (showtime_id) REFERENCES showtimes(id) ON DELETE CASCADE
);
GO

CREATE INDEX idx_booking_reference ON bookings(booking_reference);
GO
CREATE INDEX idx_showtime_id ON bookings(showtime_id);
GO
CREATE INDEX idx_customer_email ON bookings(customer_email);
GO

-- Seats table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'seats')
CREATE TABLE seats (
  id INT PRIMARY KEY IDENTITY(1,1),
  booking_id INT NOT NULL,
  seat_number VARCHAR(10) NOT NULL,
  created_at DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  UNIQUE (booking_id, seat_number)
);
GO

CREATE INDEX idx_booking_id ON seats(booking_id);
GO