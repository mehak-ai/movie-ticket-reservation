import React from 'react';
import { Clock } from 'lucide-react';

const MovieSelection = ({ movies, onMovieSelect, loading }) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p>Loading movies...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Select a Movie</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {movies.map(movie => (
          <div
            key={movie.id}
            onClick={() => onMovieSelect(movie)}
            className="bg-white/10 backdrop-blur-lg rounded-lg p-6 cursor-pointer hover:bg-white/20 transition-all transform hover:scale-105"
          >
            <div className="text-6xl text-center mb-4">{movie.poster}</div>
            <h3 className="text-xl font-bold mb-2">{movie.title}</h3>
            <p className="text-indigo-200 text-sm mb-2">{movie.genre}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {movie.duration}
              </span>
              <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                {movie.rating}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieSelection;