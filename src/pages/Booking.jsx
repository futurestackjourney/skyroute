import { useState } from "react";
import { createBooking } from "../api/bookings";
import { useNavigate, useLocation } from "react-router-dom";

const Booking = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { flightId, seatIds } = state;

  const [passengers, setPassengers] = useState(
    seatIds.map((seatId) => ({
      fullName: "",
      passportNumber: "",
      seatId,
    }))
  );

  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);

    // Remove field error when typing (same as login)
    const key = `${index}.${field}`;
    if (errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }

    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setErrors({});
    setLoading(true);

    try {
      const booking = await createBooking({
        flightId,
        seatIds,
        passengers,
      });

      navigate(`/user/profile/payment/${booking.bookingId}`);
    } catch (err) {
      const data = err.response?.data;

      if (data?.errors) {
        /*
          Convert backend keys like:
          "Passengers[0].FullName"
          into:
          "0.fullName"
        */
        const normalizedErrors = {};

        Object.entries(data.errors).forEach(([key, value]) => {
          const match = key.match(/Passengers\[(\d+)\]\.(\w+)/);
          if (match) {
            const index = match[1];
            const field =
              match[2].charAt(0).toLowerCase() + match[2].slice(1);
            normalizedErrors[`${index}.${field}`] = value;
          }
        });

        setErrors(normalizedErrors);
      } else if (data?.message) {
        setError(data.message);
      } else {
        setError("Booking failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="padding-x py-18 sm:py-22">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="shadow-sm px-6 py-6 rounded-lg ">
        <h2 className="text-4xl mb-6 font-tech">Passenger Details</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {passengers.map((p, i) => (
            <div key={i}>
              <h3 className="text-2xl mb-4">
                {i === 0 ? "Passenger" : `Passenger ${i + 1}`}
              </h3>

              <div className="mb-4">
                <label className="form-label">Full Name</label>
                <input
                  className="form-input"
                  placeholder="Full Name"
                  value={p.fullName}
                  onChange={(e) =>
                    handleChange(i, "fullName", e.target.value)
                  }
                />
                {errors[`${i}.fullName`] && (
                  <p className="error-message">
                    {errors[`${i}.fullName`][0]}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="form-label">Passport Number</label>
                <input
                  className="form-input"
                  placeholder="Passport Number"
                  value={p.passportNumber}
                  onChange={(e) =>
                    handleChange(i, "passportNumber", e.target.value)
                  }
                />
                {errors[`${i}.passportNumber`] && (
                  <p className="error-message">
                    {errors[`${i}.passportNumber`][0]}
                  </p>
                )}
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="form-btn"
          >
            {loading ? "Processing..." : "Continue to Payment"}
          </button>
        </form>
      </div>
      {/* LEFT: Instructions / Manual */}
    <div className="p-6 rounded-lg shadow-sm space-y-4 h-max sticky top-6">
      <h2 className="text-4xl text-charcoal font-semi-bold mb-4 font-tech">How to Fill Passenger Details</h2>
      <p className="text-charcoal-100 text-sm">
        Please provide each passenger's information carefully to ensure smooth check-in.
      </p>

      <div className="space-y-3">
        <div>
          <h3 className="text-charcoal font-semibold">Full Name</h3>
          <p className="text-charcoal-100 text-sm">
            Enter the passenger's full legal name as shown on their passport. 
            Include first name, middle name (if any), and last name. 
            Only letters and spaces are allowed.
          </p>
        </div>

        <div>
          <h3 className="text-charcoal font-semibold">Passport Number</h3>
          <p className="text-charcoal-100 text-sm">
            Enter the passport number exactly as printed on the passport.
            Only letters and numbers are allowed. No spaces or special characters.
          </p>
        </div>

        <div>
          <h3 className="text-charcoal font-semibold">Multiple Passengers</h3>
          <p className="text-charcoal-100 text-sm">
            If you are booking for multiple passengers, fill in the details for each passenger in the form on the right. 
            Make sure each passenger’s full name and passport number are correct.
          </p>
        </div>

        <div>
          <h3 className="text-charcoal font-semibold">Tips</h3>
          <ul className="list-disc list-inside text-charcoal-100 text-sm space-y-1">
            <li>Double-check spelling of names and passport numbers.</li>
            <li>Ensure the passport is valid for at least 6 months.</li>
            <li>Do not use special characters or spaces in passport number.</li>
          </ul>
        </div>
      </div>
    </div>

      </div>
    </div>
  );
};

export default Booking;
