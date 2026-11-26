
import { useEffect, useState } from "react";
import API from "../services/api";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const userId = localStorage.getItem("userId");

  const loadBookings = async () => {
    try {
      const response = await API.get(`/bookings/user/${userId}`);
      setBookings(response.data);
    } catch (error) {
      console.log("Booking loading error:", error);
    }
  };

  useEffect(() => {
    if (userId) loadBookings();
  }, [userId]);

  return (
    <div className="my-bookings">
      <h1>My Bookings</h1>

      {!userId ? (
        <p>Please login to view your bookings.</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((booking) => (
          <div key={booking._id} className="booking-card">
            <h2>{booking.show?.movie?.name || "Movie"}</h2>
            <p>Theatre: {booking.show?.theatre?.name || "N/A"}</p>
            <p>Date: {booking.show?.showDate?.slice(0, 10)}</p>
            <p>Time: {booking.show?.showTime}</p>
            <p>Seats: {booking.seats.join(", ")}</p>
            <p>Total: ₹{booking.totalAmount}</p>
            <p>Status: {booking.status}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default MyBookings;
