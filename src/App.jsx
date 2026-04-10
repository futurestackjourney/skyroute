import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout Routes imports
import PublicLayout from "./layouts/PublicLayout";
import AdminRoutes from "./routes/AdminRoutes";
import UserRoutes from "./routes/UserRoutes";
import UserLayout from "./layouts/UserLayout";

// Public Pages Imports
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import FlightSearch from "./pages/FlightSearch";


// Admin Dasboard Pages Imports
import CreateFlight from "./pages/admin/CreateFligth";
import SeatSelection from "./pages/SeatSelection";
import Booking from "./pages/Booking";
import Payment from "./pages/Payment";
import MyBookings from "./pages/MyBookings";
import CreateAircraft from "./pages/admin/CreateAircraft";
import EditAircraft from "./pages/admin/EditAircraft";

// Fallback Pages imports
import Unauthorized from "./pages/fallback/Unauthorized";
import NotFound from "./pages/fallback/NotFound";
import AboutUsPage from "./pages/publicPages/AboutUsPage";
import SupportPage from "./pages/publicPages/SupportPage";
import DealsPage from "./pages/publicPages/DealsPage";

const App = () => {
  return (
    <Router>
      <Routes>

        {/* Public Routes Layout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/search" element={<FlightSearch />} />
          <Route path="/aboutUs" element={<AboutUsPage/>}/>
          <Route path="/support" element={<SupportPage />} />
          <Route path="/flights/:flightId/seats" element={<SeatSelection />} />
          <Route path="/deals" element={<DealsPage />} />
        <Route path="/booking" element={<Booking />} />
        </Route>

        {/* Auth User Routes Layout */}
        <Route path="/user/*" element={<UserRoutes />} />
        {/* <Route element={<UserLayout />}>
          <Route path="/payment/:bookingId" element={<Payment />} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Route> */}
        {/* <Route path="/payment/:bookingId" element={<Payment />} />
        <Route path="/my-bookings" element={<MyBookings />} /> */}


        {/* Staff Routes Layout  */}

        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* Fallback */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
};

export default App;
