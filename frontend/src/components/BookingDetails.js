import React from 'react';
import { User, Mail, Phone, CreditCard } from 'lucide-react';

const BookingDetails = ({ 
  movie, 
  showtime, 
  selectedSeats, 
  bookingData, 
  setBookingData, 
  onSubmit, 
  onBack, 
  getTotalPrice,
  isBooking 
}) => {
  return (
    <div>
      <button onClick={onBack} className="mb-4 text-indigo-300 hover:text-white">
        ← Back to Seat Selection
      </button>
      <h2 className="text-2xl font-bold mb-6">Enter Your Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Booking Summary */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <h3 className="font-bold mb-4">Booking Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-indigo-200">Movie:</span>
              <span className="font-semibold">{movie.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-indigo-200">Date:</span>
              <span className="font-semibold">{showtime.show_date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-indigo-200">Time:</span>
              <span className="font-semibold">{showtime.show_time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-indigo-200">Seats:</span>
              <span className="font-semibold">{selectedSeats.join(', ')}</span>
            </div>
            <div className="flex justify-between border-t border-white/20 pt-3">
              <span className="text-indigo-200">Total:</span>
              <span className="font-bold text-xl">${getTotalPrice()}</span>
            </div>
          </div>
        </div>

        {/* Customer Details Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Full Name
              </label>
              <input
                type="text"
                value={bookingData.name}
                onChange={(e) => setBookingData({...bookingData, name: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-400"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <input
                type="email"
                value={bookingData.email}
                onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-400"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                value={bookingData.phone}
                onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-400"
                placeholder="+1 234 567 8900"
              />
            </div>
            <button
              onClick={onSubmit}
              disabled={isBooking}
              className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                isBooking 
                  ? 'bg-gray-500 cursor-not-allowed opacity-50' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isBooking ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Proceed to Payment
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;