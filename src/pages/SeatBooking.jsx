
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";

function SeatBooking() {
  const location = useLocation();
  const navigate = useNavigate();

  const movieId = location.state?.movieId;

  const [shows, setShows] = useState([]);
  const [selectedShow, setSelectedShow] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  const seats = Array.from({ length: 40 }, (_, i) => `S${i + 1}`);

  // LOAD SHOWS
  useEffect(() => {
    const loadShows = async () => {
      try {
        setLoading(true);

        const response = await API.get("/shows");

        const allShows = Array.isArray(response.data)
          ? response.data
          : [];

        // DEBUG INFORMATION
        console.log("Selected Movie ID:", movieId);

        console.log(
          "Shows received from backend:",
          allShows.map((show) => ({
            movieName: show.movie?.name,
            movieId: show.movie?._id || show.movie,
            showId: show._id
          }))
        );

        // FILTER SHOWS FOR SELECTED MOVIE
        const filteredShows = movieId
          ? allShows.filter((show) => {
              const showMovieId =
                typeof show.movie === "object"
                  ? show.movie?._id
                  : show.movie;

              return (
                String(showMovieId) === String(movieId)
              );
            })
          : allShows;

        console.log("Filtered Shows:", filteredShows);

        setShows(filteredShows);
        setSelectedShow("");
        setSelectedSeats([]);
        setBookedSeats([]);

      } catch (error) {
        console.log("Show loading error:", error);
        alert("Unable to load shows");
      } finally {
        setLoading(false);
      }
    };

    loadShows();
  }, [movieId]);

  // LOAD BOOKED SEATS
  useEffect(() => {
    if (!selectedShow) {
      setBookedSeats([]);
      return;
    }

    API.get("/bookings/all")
      .then((response) => {
        const bookings = Array.isArray(response.data)
          ? response.data
          : [];

        const occupied = bookings
          .filter((booking) => {
            const bookingShowId =
              typeof booking.show === "object"
                ? booking.show?._id
                : booking.show;

            return (
              String(bookingShowId) === String(selectedShow) &&
              booking.status === "Confirmed"
            );
          })
          .flatMap((booking) => booking.seats || []);

        setBookedSeats(occupied);
      })
      .catch((error) => {
        console.log("Booked seats error:", error);
      });
  }, [selectedShow]);

  // SELECT OR DESELECT SEAT
  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return;

    setSelectedSeats((previous) =>
      previous.includes(seat)
        ? previous.filter((item) => item !== seat)
        : [...previous, seat]
    );
  };

  // CONFIRM BOOKING
  const confirmBooking = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Please login before booking");
      navigate("/login");
      return;
    }

    if (!selectedShow) {
      alert("Please select a show");
      return;
    }

    if (selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }

    try {
      await API.post("/bookings/add", {
        userId,
        showId: selectedShow,
        seats: selectedSeats
      });

      alert("Booking confirmed successfully!");
      navigate("/my-bookings");

    } catch (error) {
      console.log("Booking error:", error);

      alert(
        error.response?.data?.message ||
        "Booking failed. Please try again."
      );
    }
  };

  const selectedShowDetails = shows.find(
    (show) => String(show._id) === String(selectedShow)
  );

  return (
    <div className="seat-booking">
      <h1>Book Your Seats</h1>

      {loading ? (
        <p>Loading shows...</p>
      ) : shows.length === 0 ? (
        <p>
          No shows available for this movie.
          Please add a show first.
        </p>
      ) : (
        <>
          <h3>Select Show</h3>

          <select
            value={selectedShow}
            onChange={(e) => {
              setSelectedShow(e.target.value);
              setSelectedSeats([]);
            }}
          >
            <option value="">Select a show</option>

            {shows.map((show) => (
              <option key={show._id} value={show._id}>
                {show.movie?.name || "Movie"} -{" "}
                {show.theatre?.name || "Theatre"} -{" "}
                {show.showDate?.slice(0, 10)} -{" "}
                {show.showTime} - ₹{show.ticketPrice}
              </option>
            ))}
          </select>

          {selectedShow && (
            <>
              <h3>Select Your Seats</h3>
              <p>Screen</p>

              <div className="seat-grid">
                {seats.map((seat) => (
                  <button
                    key={seat}
                    type="button"
                    disabled={bookedSeats.includes(seat)}
                    onClick={() => toggleSeat(seat)}
                    style={{
                      margin: "6px",
                      padding: "12px",
                      backgroundColor: bookedSeats.includes(seat)
                        ? "#999"
                        : selectedSeats.includes(seat)
                        ? "#28a745"
                        : "#e5e5e5",
                      color:
                        selectedSeats.includes(seat) ||
                        bookedSeats.includes(seat)
                          ? "white"
                          : "black",
                      border: "none",
                      borderRadius: "6px",
                      cursor: bookedSeats.includes(seat)
                        ? "not-allowed"
                        : "pointer"
                    }}
                  >
                    {seat}
                  </button>
                ))}
              </div>

              <p>
                Selected Seats:{" "}
                {selectedSeats.join(", ") || "None"}
              </p>

              <h3>
                Total Amount: ₹
                {selectedShowDetails
                  ? selectedSeats.length *
                    selectedShowDetails.ticketPrice
                  : 0}
              </h3>

              <button
                type="button"
                onClick={confirmBooking}
              >
                Confirm Booking
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default SeatBooking;
