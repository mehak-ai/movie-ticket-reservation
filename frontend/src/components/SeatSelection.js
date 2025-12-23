import React from 'react';

const SeatSelection = ({ 
  allSeats, 
  bookedSeats, 
  selectedSeats, 
  onSeatToggle, 
  onContinue, 
  onBack,
  getTotalPrice 
}) => {
  return (
    <div>
      <button onClick={onBack} className="mb-4 text-indigo-300 hover:text-white">
        ← Back to Showtimes
      </button>
      <h2 className="text-2xl font-bold mb-6">Select Your Seats</h2>
      
      <div className="mb-8">
        <div className="bg-white/20 h-2 rounded-t-full mb-2"></div>
        <p className="text-center text-sm text-indigo-200">Screen</p>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-6">
        <div className="grid grid-cols-10 gap-2 mb-6">
          {allSeats.map(seat => {
            const isBooked = bookedSeats.includes(seat);
            const isSelected = selectedSeats.includes(seat);
            return (
              <button
                key={seat}
                onClick={() => onSeatToggle(seat)}
                disabled={isBooked}
                className={`aspect-square rounded text-xs font-semibold transition-all ${
                  isBooked
                    ? 'bg-red-500 cursor-not-allowed opacity-50'
                    : isSelected
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-indigo-600 hover:bg-indigo-500'
                }`}
              >
                {seat}
              </button>
            );
          })}
        </div>

        <div className="flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 rounded"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-500 rounded"></div>
            <span>Booked</span>
          </div>
        </div>
      </div>

      {selectedSeats.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-indigo-200">Selected Seats</p>
              <p className="font-bold text-lg">{selectedSeats.join(', ')}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-indigo-200">Total Amount</p>
              <p className="font-bold text-2xl">${getTotalPrice()}</p>
            </div>
          </div>
          <button
            onClick={onContinue}
            className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-semibold transition-colors"
          >
            Continue to Booking Details
          </button>
        </div>
      )}
    </div>
  );
};

export default SeatSelection;
