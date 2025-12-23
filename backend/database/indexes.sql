USE movie_booking;

-- Additional indexes for performance
CREATE INDEX idx_showtime_movie ON showtimes(movie_id);
CREATE INDEX idx_booking_showtime ON bookings(showtime_id);
CREATE INDEX idx_booking_reference ON bookings(booking_reference);
CREATE INDEX idx_seats_booking ON seats(booking_id);
CREATE INDEX idx_booking_status ON bookings(status);
CREATE INDEX idx_showtime_date ON showtimes(show_date);