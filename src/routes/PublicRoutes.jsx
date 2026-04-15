import { Routes, Route } from "react-router-dom";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import SeatSelection from "../pages/SeatSelection";
import Home from "../pages/Home";
import PublicLayout from "../layouts/PublicLayout";
import FlightSearch from "../pages/FlightSearch";
import Booking from "../pages/Booking";
import AboutUsPage from "../pages/publicPages/AboutUsPage";
import SupportPage from "../pages/publicPages/SupportPage";
import DealsPage from "../pages/publicPages/DealsPage";
import NotFound from "../pages/fallback/NotFound";

const PublicRoutes = () => {
  return (
    <>
      <Routes>
      <Route element={<PublicLayout />}>
        {/* Home */}
        <Route index element={<Home />} />

        {/* Auth */}
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />

        {/* Flights */}
        <Route path="search" element={<FlightSearch />} />
        <Route path="flights/:flightId/seats" element={<SeatSelection />} />

        {/* Booking */}
        <Route path="booking" element={<Booking />} />

        {/* Static Pages */}
        <Route path="aboutUs" element={<AboutUsPage />} />
        <Route path="support" element={<SupportPage />} />
        <Route path="deals" element={<DealsPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
    </>
  );
};

export default PublicRoutes;
