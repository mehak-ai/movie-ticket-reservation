import React, { useState, useEffect } from 'react';
import { Film } from 'lucide-react';
import api from './services/api';
import './App.css';
import MovieSelection from './components/MovieSelection';
import ShowtimeSelection from './components/ShowtimeSelection';
import SeatSelection from './components/SeatSelection';
import BookingDetails from './components/BookingDetails';
import BookingConfirmation from './components/BookingConfirmation';
import ProgressIndicator from './components/ProgressIndicator';

const App = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const data = await api.getMovies();
      setMovies(data);
    } catch (err) {
      setError('Failed to load movies');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookedSeats = async (showtimeId) => {
    try {
      const seats = await api.getBookedSeats(showtimeId);
      setBookedSeats(seats);
    } catch (err) {
      console.error('Failed to fetch booked seats:', err);
    }
  };

  const generateSeats = () => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seats = [];
    rows.forEach(row => {
      for (let i = 1; i <= 10; i++) {
        seats.push(`${row}${i}`);
      }
    });
    return seats;
  };

  const allSeats = generateSeats();

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    setSelectedShowtime(null);
    setSelectedSeats([]);
    setStep(2);
  };

  const handleShowtimeSelect = async (showtime) => {
    setSelectedShowtime(showtime);
    await fetchBookedSeats(showtime.id);
    setStep(3);
  };

  const handleSeatToggle = (seat) => {
    if (bookedSeats.includes(seat)) return;
    
    setSelectedSeats(prev => 
      prev.includes(seat) 
        ? prev.filter(s => s !== seat)
        : [...prev, seat]
    );
  };

  const handleBookingSubmit = async () => {
    if (!bookingData.name || !bookingData.email || !bookingData.phone) {
      alert('Please fill in all fields');
      return;
    }
    
    if (isBooking) {
      alert('Booking is already in progress. Please wait...');
      return;
    }
    
    setIsBooking(true);
    
    try {
      const response = await api.createBooking({
        showtime_id: selectedShowtime.id,
        customer_name: bookingData.name,
        customer_email: bookingData.email,
        customer_phone: bookingData.phone,
        seats: selectedSeats,
        total_amount: getTotalPrice()
      });
      
      setBookingConfirmed(response);
      setStep(5);
    } catch (err) {
      alert(err.message || 'Booking failed. Please try again.');
      console.error(err);
    } finally {
      setIsBooking(false);
    }
  };

  const getTotalPrice = () => {
    return selectedSeats.length * 12;
  };

  const resetBooking = () => {
    setSelectedMovie(null);
    setSelectedShowtime(null);
    setSelectedSeats([]);
    setBookedSeats([]);
    setStep(1);
    setBookingData({ name: '', email: '', phone: '' });
    setBookingConfirmed(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Film className="w-10 h-10" />
            <h1 className="text-4xl font-bold">CineBook</h1>
          </div>
          <p className="text-indigo-200">Your Premium Movie Ticket Reservation System</p>
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator currentStep={step} />

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        {/* Step Components */}
        {step === 1 && (
          <MovieSelection 
            movies={movies} 
            onMovieSelect={handleMovieSelect}
            loading={loading}
          />
        )}

        {step === 2 && selectedMovie && (
          <ShowtimeSelection 
            movie={selectedMovie}
            onShowtimeSelect={handleShowtimeSelect}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && selectedShowtime && (
          <SeatSelection
            allSeats={allSeats}
            bookedSeats={bookedSeats}
            selectedSeats={selectedSeats}
            onSeatToggle={handleSeatToggle}
            onContinue={() => setStep(4)}
            onBack={() => setStep(2)}
            getTotalPrice={getTotalPrice}
          />
        )}

        {step === 4 && (
          <BookingDetails
            movie={selectedMovie}
            showtime={selectedShowtime}
            selectedSeats={selectedSeats}
            bookingData={bookingData}
            setBookingData={setBookingData}
            onSubmit={handleBookingSubmit}
            onBack={() => setStep(3)}
            getTotalPrice={getTotalPrice}
            isBooking={isBooking}
          />
        )}

        {step === 5 && bookingConfirmed && (
          <BookingConfirmation
            bookingConfirmed={bookingConfirmed}
            bookingData={bookingData}
            movie={selectedMovie}
            showtime={selectedShowtime}
            selectedSeats={selectedSeats}
            getTotalPrice={getTotalPrice}
            onReset={resetBooking}
          />
        )}
      </div>
    </div>
  );
};

export default App;