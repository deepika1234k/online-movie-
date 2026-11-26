
import React, { useEffect, useState } from "react";
import API from "../services/api";
import "./AdminTheatres.css";

function AdminTheatres() {
  const [theatres, setTheatres] = useState([]);
  const [form, setForm] = useState({
    name: "",
    location: "",
    screens: ""
  });
  const [message, setMessage] = useState("");

  const loadTheatres = async () => {
    try {
      const response = await API.get("/theatres");
      setTheatres(response.data);
    } catch (error) {
      setMessage("Unable to load theatres.");
    }
  };

  useEffect(() => {
    loadTheatres();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await API.post("/theatres/add", {
        ...form,
        screens: Number(form.screens)
      });

      setMessage("Theatre added successfully!");
      setForm({ name: "", location: "", screens: "" });
      loadTheatres();
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to add theatre.");
    }
  };

  const deleteTheatre = async (id) => {
    if (!window.confirm("Are you sure you want to delete this theatre?")) return;

    try {
      await API.delete(`/theatres/delete/${id}`);
      setMessage("Theatre deleted successfully!");
      loadTheatres();
    } catch (error) {
      setMessage("Unable to delete theatre.");
    }
  };

  return (
    <div className="admin-theatres">
      <h1>Theatre Management</h1>

      <form onSubmit={handleSubmit} className="theatre-form">
        <input
          name="name"
          placeholder="Theatre Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
        />

        <input
          name="screens"
          type="number"
          min="1"
          placeholder="Number of Screens"
          value={form.screens}
          onChange={handleChange}
          required
        />

        <button type="submit">Add Theatre</button>
      </form>

      {message && <p>{message}</p>}

      <h2>Available Theatres</h2>

      <div className="theatre-list">
        {theatres.map((theatre) => (
          <div className="theatre-card" key={theatre._id}>
            <h3>{theatre.name}</h3>
            <p>Location: {theatre.location}</p>
            <p>Screens: {theatre.screens}</p>
            <button onClick={() => deleteTheatre(theatre._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>

      {theatres.length === 0 && <p>No theatres added yet.</p>}
    </div>
  );
}

export default AdminTheatres;
