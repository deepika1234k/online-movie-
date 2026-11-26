
import { useEffect, useState } from "react";
import API from "../services/api";

function AdminShows() {
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [shows, setShows] = useState([]);

  const [form, setForm] = useState({
    movie: "",
    theatre: "",
    screen: "",
    showDate: "",
    showTime: "",
    ticketPrice: ""
  });

  // Load movies, theatres and shows
  const loadData = async () => {
    try {
      const movieRes = await API.get("/movies");
      const theatreRes = await API.get("/theatres");
      const showRes = await API.get("/shows");

      setMovies(movieRes.data);
      setTheatres(theatreRes.data);
      setShows(showRes.data);
    } catch (error) {
      console.error("Error loading data:", error);
      alert("Unable to load movies, theatres or shows");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Add a new show
  const addShow = async (e) => {
    e.preventDefault();

    try {
      await API.post("/shows/add", {
        ...form,
        movie: form.movie,
        theatre: form.theatre,
        screen: Number(form.screen),
        showDate: new Date(form.showDate),
        ticketPrice: Number(form.ticketPrice)
      });

      alert("Show added successfully!");

      setForm({
        movie: "",
        theatre: "",
        screen: "",
        showDate: "",
        showTime: "",
        ticketPrice: ""
      });

      await loadData();

    } catch (error) {
      console.error("Error adding show:", error);
      alert(error.response?.data?.message || "Failed to add show");
    }
  };

  // Delete a show
  const deleteShow = async (showId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this show?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/shows/delete/${showId}`);
      alert("Show deleted successfully!");
      await loadData();
    } catch (error) {
      console.error("Error deleting show:", error);
      alert(error.response?.data?.message || "Failed to delete show");
    }
  };

  return (
    <div>
      <h2>Show Management</h2>

      <form onSubmit={addShow}>
        <select
          name="movie"
          value={form.movie}
          onChange={handleChange}
          required
        >
          <option value="">Select Movie</option>

          {movies.map((movie) => (
            <option key={movie._id} value={movie._id}>
              {movie.name}
            </option>
          ))}
        </select>

        <select
          name="theatre"
          value={form.theatre}
          onChange={handleChange}
          required
        >
          <option value="">Select Theatre</option>

          {theatres.map((theatre) => (
            <option key={theatre._id} value={theatre._id}>
              {theatre.name}
            </option>
          ))}
        </select>

        <input
          name="screen"
          type="number"
          min="1"
          placeholder="Screen Number"
          value={form.screen}
          onChange={handleChange}
          required
        />

        <input
          name="showDate"
          type="date"
          value={form.showDate}
          onChange={handleChange}
          required
        />

        <input
          name="showTime"
          type="time"
          value={form.showTime}
          onChange={handleChange}
          required
        />

        <input
          name="ticketPrice"
          type="number"
          min="1"
          placeholder="Ticket Price"
          value={form.ticketPrice}
          onChange={handleChange}
          required
        />

        <button type="submit">Add Show</button>
      </form>

      <h3>Available Shows</h3>

      {shows.length === 0 ? (
        <p>No shows available.</p>
      ) : (
        shows.map((show) => (
          <div key={show._id}>
            <p>
              Movie: {show.movie?.name || "Unknown"} |
              Theatre: {show.theatre?.name || "Unknown"} |
              Screen: {show.screen} |
              Date: {show.showDate?.slice(0, 10)} |
              Time: {show.showTime} |
              Price: ₹{show.ticketPrice}
            </p>

            <button onClick={() => deleteShow(show._id)}>
              Delete Show
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminShows;
