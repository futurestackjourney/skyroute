import { useEffect, useState, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Armchair } from "lucide-react";
import { getSeatsByFlight, lockSeats, releaseSeats } from "../api/seats";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const LOCK_MINUTES = 10;

const CLASS_META = {
  First: { color: "bg-yellow-400", label: "First Class" },
  Business: { color: "bg-sky-300", label: "Business Class" },
  Economy: { color: "bg-emerald-200", label: "Economy Class" },
};

export default function SeatSelection() {
  const { user } = useContext(AuthContext);
  const { flightId } = useParams();
  const navigate = useNavigate();

  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);
  const [timer, setTimer] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const timerRef = useRef(null);

  /* --------------------------------
     Load Seats
  -------------------------------- */
  useEffect(() => {
    fetchSeats();

    return () => clearInterval(timerRef.current);
  }, [flightId]);

  const fetchSeats = async () => {
    try {
      const res = await getSeatsByFlight(flightId);
      setSeats(res);
    } catch (e) {
      console.error("Failed to load seats", e);
    }
  };

  /* --------------------------------
     Group Seats (Memoized)
  -------------------------------- */
  const grouped = useMemo(() => {
    return seats.reduce((acc, seat) => {
      const row = seat.seatNumber.match(/\d+/)?.[0];

      if (!acc[seat.class]) acc[seat.class] = {};
      if (!acc[seat.class][row]) acc[seat.class][row] = [];

      acc[seat.class][row].push(seat);
      return acc;
    }, {});
  }, [seats]);

  // seleted seats
  const selectedSeatNumbers = useMemo(() => {
    return seats
      .filter((seat) => selected.includes(seat.seatId))
      .map((seat) => seat.seatNumber);
  }, [selected, seats]);

  /* --------------------------------
     Seat Selection
  -------------------------------- */
  const toggleSeat = (id) => {
    const seat = seats.find((s) => s.seatId === id);

    if (seat.isLocked || seat.isBooked) return;

    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  /* --------------------------------
     Lock / Release
  -------------------------------- */
  const handleLock = async () => {
    if (!selected.length) return;

    try {
      await lockSeats({
        flightId: Number(flightId),
        seatIds: selected,
        lockDurationMinutes: LOCK_MINUTES,
      });

      startTimer(LOCK_MINUTES * 60);
      await fetchSeats();

      navigate("/booking", {
        state: { flightId: Number(flightId), seatIds: selected },
      });
    } catch (e) {
      console.error("Lock failed", e);
    }
  };

  const handleRelease = async () => {
    try {
      await releaseSeats({
        flightId: Number(flightId),
        seatIds: selected,
      });

      clearInterval(timerRef.current);
      setSelected([]);
      setTimer(null);

      await fetchSeats();
    } catch (e) {
      console.error("Release failed", e);
    }
  };

  /* --------------------------------
     Timer
  -------------------------------- */
  const startTimer = (seconds) => {
    setTimer(seconds);

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleRelease();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formattedTime = useMemo(() => {
    if (!timer) return null;

    const m = Math.floor(timer / 60);
    const s = timer % 60;

    return `${m}:${String(s).padStart(2, "0")}`;
  }, [timer]);

  /* --------------------------------
     For Login Modal
  -------------------------------- */
  const handleSeatClick = (seat) => {
    console.log("USER NOT LOGGED IN");
    if (!user) {
      // show login modal instead of selecting
      console.log("USER NOT LOGGED IN");
      setShowLoginModal(true);
      return;
    }

    if (seat.isLocked || seat.isBooked) return;

    toggleSeat(seat.seatId);
  };

  /* --------------------------------
     Render Seat
  -------------------------------- */
  const Seat = ({ seat }) => {
    const isSelected = selected.includes(seat.seatId);
    const locked = seat.isLocked;
    const booked = seat.isBooked;

    let base = CLASS_META[seat.class]?.color;

    if (booked) base = "bg-gray-400";
    else if (locked) base = "bg-gray-200";
    else if (isSelected) base = "bg-green-500";

    return (
      <button
        disabled={locked || booked}
        onClick={() => handleSeatClick(seat)}
        className={`
          relative
          w-9 h-9 sm:w-11 sm:h-11
          rounded-md
          ${base}
          text-[10px]
          font-semibold
          flex flex-col
          items-center
          justify-center
          shadow-sm
          transition
          hover:scale-105
          disabled:cursor-not-allowed
          disabled:opacity-60
        `}
      >
        <Armchair size={14} />
        {seat.seatNumber}
      </button>
    );
  };

  /* --------------------------------
     Render Cabin Section
  -------------------------------- */
  const CabinSection = ({ type, rows }) => {
    if (!rows) return null;

    return (
      <section className="mb-10">
        <h3 className="text-center text-lg font-semibold mb-4">
          {CLASS_META[type]?.label}
        </h3>

        <div className="space-y-3">
          {Object.entries(rows).map(([row, rowSeats]) => (
            <div
              key={row}
              className="grid grid-cols-[28px_1fr_28px_1fr] items-center gap-2"
            >
              {/* Row */}
              <div className="text-xs font-bold text-center">{row}</div>

              {/* Left Seats */}
              <div className="flex gap-2 justify-end">
                {rowSeats.slice(0, 3).map((s) => (
                  <Seat key={s.seatId} seat={s} />
                ))}
              </div>

              {/* Aisle */}
              <div />

              {/* Right Seats */}
              <div className="flex gap-2 justify-start">
                {rowSeats.slice(3, 6).map((s) => (
                  <Seat key={s.seatId} seat={s} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  /* --------------------------------
     UI
  -------------------------------- */
  return (
    <div className="min-h-screen padding-x max-w-7xl py-12 sm:py-22 ">
      <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-[2fr_1fr] gap-8 ">
        {/* LEFT: SEAT MAP */}
        <div>
          <h1 className="text-3xl font-bold text-center mb-4">
            Choose Your Seat
          </h1>

          <p className="text-center text-sm text-gray-500 mb-6">
            Front of Aircraft
          </p>

          {/* Legend */}
          <Legend />

          {/* Plane */}
          <div className="bg-white rounded-xl shadow p-6 max-w-xl mx-auto">
            <CabinSection type="First" rows={grouped.First} />
            <CabinSection type="Business" rows={grouped.Business} />
            <CabinSection type="Economy" rows={grouped.Economy} />
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            Rear of Aircraft
          </p>

          {/* Mobile Actions */}
          <div className="flex justify-center gap-3 mt-6 lg:hidden">
            <PrimaryButton disabled={!selected.length} onClick={handleLock}>
              Continue
            </PrimaryButton>

            <SecondaryButton onClick={handleRelease}>Release</SecondaryButton>
          </div>

          {formattedTime && (
            <p className="text-center mt-3 text-red-600 font-medium">
              Time left: {formattedTime}
            </p>
          )}
        </div>

        {/* RIGHT: SUMMARY */}
        <aside className="bg-white  rounded-xl shadow p-6 h-fit sticky top-24 ">
          <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>

          <div className="space-y-2 text-sm text-charcoal">
            <p>
              <span className="font-medium">Flight:</span> {flightId}
            </p>

            <p>
              <span className="font-medium">Route:</span> KHI → LHR
            </p>

            <p>
              <span className="font-medium">Seats:</span>{" "}
              {selected.length || "None"}
            </p>

            <p>
              <span className="font-medium">Seat Number:</span>{" "}
              {selectedSeatNumbers.length
                ? selectedSeatNumbers.join(", ")
                : "None"}
            </p>

            <p>
              <span className="font-medium">Base Fare:</span> $120
            </p>

            <p>
              <span className="font-medium">Extra:</span> $9
            </p>

            <hr />

            <p className="font-semibold">Total: $150</p>
          </div>

          {/* Desktop Actions */}
          <div className="flex flex-col gap-3 mt-6">
            <PrimaryButton disabled={!selected.length} onClick={handleLock}>
              Lock & Continue
            </PrimaryButton>

            <SecondaryButton onClick={handleRelease}>
              Release Seats
            </SecondaryButton>
          </div>

          {formattedTime && (
            <p className="text-center mt-4 text-red-600 text-sm font-medium">
              Expires in {formattedTime}
            </p>
          )}
        </aside>
      </div>

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div
          className=" z-50 fixed inset-0 bg-black/50 flex items-center justify-center "
          onClick={() => setShowLoginModal(false)}
        >
          <div className="bg-zinc-100 p-6 rounded-lg text-center">
            <div className="mb-2">
              <h2 className="text-xl font-semibold">Please login first</h2>
              <h2 className="text-sm text-charcoal-100">
                For Select, Book or lock{" "}
              </h2>
            </div>

            <div className="flex gap-5">
            <button className="mt-3 px-4 py-3 bg-gray-300 hover:bg-gray-200 rounded"
            onClick={() => setShowLoginModal(false)}
            >
              Okay
            </button>
            <button
              onClick={() => navigate("/login")}
              className="mt-3 px-4 py-3 bg-charcoal hover:bg-charcoal-50 text-white rounded"
            >
              Go to Login
            </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* --------------------------------
   UI Helpers
-------------------------------- */

function PrimaryButton({ children, ...props }) {
  return (
    <button
      {...props}
      className="
        w-full
        py-2.5
        rounded-lg
        bg-charcoal
        text-white
        font-medium
        hover:bg-charcoal-100
        transition
        disabled:opacity-50
        disabled:cursor-not-allowed
      "
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, ...props }) {
  return (
    <button
      {...props}
      className="
        w-full
        py-2.5
        rounded-lg
        bg-slate-100
        hover:bg-slate-200
        font-medium
        transition
      "
    >
      {children}
    </button>
  );
}

function Legend() {
  const items = [
    { color: "bg-gray-200", label: "Locked" },
    { color: "bg-gray-400", label: "Booked" },
    { color: "bg-green-500", label: "Selected" },
    { color: "bg-yellow-400", label: "First" },
    { color: "bg-sky-300", label: "Business" },
    { color: "bg-emerald-200", label: "Economy" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-6 text-xs">
      {items.map((i) => (
        <div key={i.label} className="flex items-center gap-2">
          <div className={`w-3.5 h-3.5 rounded ${i.color}`} />
          <span>{i.label}</span>
        </div>
      ))}
    </div>
  );
}
