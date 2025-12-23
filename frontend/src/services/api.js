import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = {
  // Movies
  getMovies: async () => {
    const response = await axios.get(`${API_URL}/movies`);
    return response.data;
  },

  getMovie: async (id) => {
    const response = await axios.get(`${API_URL}/movies/${id}`);
    return response.data;
  },

  // Showtimes
  getShowtimes: async (movieId) => {
    const response = await axios.get(`${API_URL}/movies/${movieId}/showtimes`);
    return response.data;
  },

// Seats
getBookedSeats: async (showtimeId) => {
    const response = await axios.get(`${API_URL}/showtimes/${showtimeId}/booked-seats`);
    return response.data;
},

// Bookings
createBooking: async (bookingData) => {
    try {
        const response = await axios.post(`${API_URL}/bookings`, bookingData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Booking failed');
    }
},

getBooking: async (reference) => {
    const response = await axios.get(`${API_URL}/bookings/${reference}`);
    return response.data;
},

cancelBooking: async (reference) => {
    const response = await axios.delete(`${API_URL}/bookings/${reference}`);
    return response.data;
}
};

export default api;