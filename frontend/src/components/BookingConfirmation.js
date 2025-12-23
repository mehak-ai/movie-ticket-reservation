import React from 'react';
import { Ticket } from 'lucide-react';

const BookingConfirmation = ({ 
  bookingConfirmed, 
  bookingData, 
  movie, 
  showtime, 
  selectedSeats, 
  getTotalPrice, 
  onReset 
}) => {
  return (
    <div className="text-center">
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Ticket className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Booking Confirmed!</h2>
        <p className="text-indigo-200 mb-6">
          Your tickets have been booked successfully. A confirmation email has been sent to {bookingData.email}
        </p>
        
        <div className="bg-white/5 rounded-lg p-6 mb-6 text-left">
          <h3 className="font-bold mb-4 text-center">
            Booking Reference: #{bookingConfirmed.booking_reference}
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-indigo-200">Name:</span>
              <span className="font-semibold">{bookingData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-indigo-200">Movie:</span>
              <span className="font-semibold">{movie.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-indigo-200">Date & Time:</span>
              <span className="font-semibold">
                {showtime.show_date} at {showtime.show_time}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-indigo-200">Seats:</span>
              <span className="font-semibold">{selectedSeats.join(', ')}</span>
            </div>
            <div className="flex justify-between border-t border-white/20 pt-2 mt-2">
              <span className="text-indigo-200">Amount Paid:</span>
              <span className="font-bold text-lg">${getTotalPrice()}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onReset}
          className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          Book Another Movie
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmation;