import React from 'react';
import { Calendar, Clock } from 'lucide-react';

const ShowtimeSelection = ({ movie, onShowtimeSelect, onBack }) => {
  return (
    <div>
      <button onClick={onBack} className="mb-4 text-indigo-300 hover:text-white">
        ← Back to Movies
      </button>
      <h2 className="text-2xl font-bold mb-6">Select Showtime for {movie.title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {movie.showtimes?.map(showtime => (
          <div
            key={showtime.id}
            onClick={() => onShowtimeSelect(showtime)}
            className="bg-white/10 backdrop-blur-lg rounded-lg p-6 cursor-pointer hover:bg-white/20 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-300" />
                <span className="font-semibold">{showtime.show_date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-300" />
                <span className="font-semibold">{showtime.show_time}</span>
              </div>
            </div>
            <p className="text-sm text-indigo-200">
              {showtime.available_seats} seats available
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowtimeSelection;