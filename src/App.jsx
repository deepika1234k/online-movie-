
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";

import "./App.css";

import Movies from "./pages/Movies";
import AdminMovies from "./pages/AdminMovies";
import SeatBooking from "./pages/SeatBooking";
import MyBookings from "./pages/MyBookings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminTheatres from "./pages/AdminTheatres";
import AdminShows from "./pages/AdminShows";
import ProtectedRoute from "./ProtectedRoute";

function Home() {
  return (
    <div className="hero">
      <h1>Book Your Movie Tickets Online</h1>
      <p>Discover movies, choose your seats and enjoy your show!</p>

      <Link to="/movies" className="explore-btn">
        Explore Movies
      </Link>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const isAdmin = user?.role === "admin";
  const isCustomer = user?.role === "user";

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    navigate("/login");
  }

  return (
    <div className="app">
      <nav className="navbar">
        <h2>MovieBook</h2>

        <div className="nav-links">
          <Link to="/">Home</Link>

          {!user && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}

          {isCustomer && (
            <>
              <Link to="/movies">Movies</Link>
              <Link to="/my-bookings">My Bookings</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}

          {isAdmin && (
            <>
              <Link to="/admin/movies">Admin Movies</Link>
              <Link to="/admin/theatres">Manage Theatres</Link>
              <Link to="/admin/shows">Show Management</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/movies"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Movies />
            </ProtectedRoute>
          }
        />

        <Route
          path="/booking"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <SeatBooking />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/movies"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminMovies />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/theatres"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminTheatres />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/shows"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminShows />
            </ProtectedRoute>
          }
        />
      </Routes>

      <footer>
        <p>© 2026 MovieBook. All rights reserved.</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
