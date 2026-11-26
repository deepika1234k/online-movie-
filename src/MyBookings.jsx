
import React, { useEffect, useState } from "react";
import API from "../services/api";
import "./MyBookings.css";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");

  const userId = localStorage.getItem("userId");

  const loadBookings = async () => {
    if (!userId) {
      setMessage("Please log in to view your bookings.");
      return;
    }

    try {
      const response = await API.get(`/bookings/user/${userId}`);
      setBookings(response.data);
      setMessage("");
    } catch (error) {
      setMessage("Unable to load bookings.");
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const cancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      await API.put(`/bookings/cancel/${bookingId}`);
      setMessage("Booking cancelled successfully!");
      loadBookings();
    } catch (error) {
      setMessage("Unable to cancel booking.");
    }
  };

  return (
    <div className="my-bookings">
      <h1>My Bookings</h1>

      {message && <p>{message}</p>}

      {bookings.map((booking) => (
        <div className="booking-card" key={booking._id}>
          <h2>{booking.show?.movie?.name || "Movie"}</h2>

          <p>
            Theatre: {booking.show?.theatre?.name || "Theatre"}
          </p>

          <p>Show Date: {booking.show?.showDate?.slice(0, 10)}</p>
          <p>Show Time: {booking.show?.showTime}</p>
          <p>Seats: {booking.seats.join(", ")}</p>
          <p>Total Amount: ₹{booking.totalAmount}</p>
          <p>Status: {booking.status}</p>

          {booking.status === "Confirmed" && (
            <button onClick={() => cancelBooking(booking._id)}>
              Cancel Booking
            </button>
          )}
        </div>
      ))}

      {bookings.length === 0 && !message && (
        <p>You have no bookings yet.</p>
      )}
    </div>
  );
}

export default MyBookings;
