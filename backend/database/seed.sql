USE movie_booking;

-- Insert sample movies
INSERT INTO movies (title, genre, duration, rating, poster, description) VALUES
('Inception', 'Sci-Fi/Thriller', '148 min', 'PG-13', '🎬', 'A thief who steals corporate secrets through the use of dream-sharing technology.'),
('The Dark Knight', 'Action/Drama', '152 min', 'PG-13', '🦇', 'Batman faces the Joker, a criminal mastermind who wants to plunge Gotham into anarchy.'),
('Interstellar', 'Sci-Fi/Adventure', '169 min', 'PG-13', '🚀', 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity''s survival.');

-- Insert sample showtimes
INSERT INTO showtimes (movie_id, show_date, show_time, available_seats) VALUES
(1, '2024-12-24', '10:00:00', 80),
(1, '2024-12-24', '14:30:00', 80),
(1, '2024-12-24', '18:00:00', 80),
(1, '2024-12-24', '21:30:00', 80),
(2, '2024-12-24', '11:00:00', 80),
(2, '2024-12-24', '15:00:00', 80),
(2, '2024-12-24', '19:00:00', 80),
(2, '2024-12-24', '22:00:00', 80),
(3, '2024-12-24', '12:00:00', 80),
(3, '2024-12-24', '16:00:00', 80),
(3, '2024-12-24', '20:00:00', 80);

-- Insert more dates
INSERT INTO showtimes (movie_id, show_date, show_time, available_seats) VALUES
(1, '2024-12-25', '10:00:00', 80),
(1, '2024-12-25', '14:30:00', 80),
(2, '2024-12-25', '11:00:00', 80),
(2, '2024-12-25', '19:00:00', 80),
(3, '2024-12-25', '12:00:00', 80),
(3, '2024-12-25', '20:00:00', 80);