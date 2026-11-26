
import React, { useState } from "react";
import API from "../services/api";
import "./AdminMovies.css";

function AdminMovies() {
  const [movie, setMovie] = useState({
    name: "",
    description: "",
    genre: "",
    language: "",
    duration: "",
    releaseDate: "",
    poster: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setMovie({
      ...movie,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/movies/add",
        {
          ...movie,
          duration: Number(movie.duration)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage("Movie added successfully!");

      setMovie({
        name: "",
        description: "",
        genre: "",
        language: "",
        duration: "",
        releaseDate: "",
        poster: ""
      });
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Unable to add movie. Please check admin login."
      );
    }
  };

  return (
    <div className="admin-movies">
      <h1>Admin - Add Movie</h1>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Movie Name"
          value={movie.name} onChange={handleChange} required />

        <textarea name="description" placeholder="Movie Description"
          value={movie.description} onChange={handleChange} required />

        <input name="genre" placeholder="Genre"
          value={movie.genre} onChange={handleChange} required />

        <input name="language" placeholder="Language"
          value={movie.language} onChange={handleChange} required />

        <input name="duration" type="number" placeholder="Duration in minutes"
          value={movie.duration} onChange={handleChange} required />

        <label>Release Date</label>
        <input name="releaseDate" type="date"
          value={movie.releaseDate} onChange={handleChange} required />

        <input name="poster" placeholder="Poster Image URL (optional)"
          value={movie.poster} onChange={handleChange} />

        <button type="submit">Add Movie</button>

        {message && <p>{message}</p>}
      </form>
    </div>
  );
}

export default AdminMovies;
