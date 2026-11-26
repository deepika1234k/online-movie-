
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/movies")
      .then((response) => setMovies(response.data))
      .catch((error) => console.log("Movie loading error:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="movies-page">
      <h1>Now Showing</h1>
      <p>Choose your favourite movie and book your tickets.</p>

      {loading ? (
        <p>Loading movies...</p>
      ) : movies.length === 0 ? (
        <p>No movies available. Please check back later.</p>
      ) : (
        <div className="movie-list">
          {movies.map((movie) => (
            <div className="movie-card" key={movie._id}>
              {movie.poster && (
                <img src={movie.poster} alt={movie.name} />
              )}
              <h2>{movie.name}</h2>
              <p>{movie.description}</p>
              <p>Genre: {movie.genre}</p>
              <p>Language: {movie.language}</p>
              <p>Duration: {movie.duration} minutes</p>

              <button
                onClick={() =>
                  navigate("/booking", {
                    state: { movieId: movie._id }
                  })
                }
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Movies;
