import { useEffect, useState } from "react";
import { getMyBookings } from "../api/bookings";
import { getMyBoardingPasses } from "../api/boardingPasses";
import { Plane } from "lucide-react";


const MyBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    // const data = await getMyBookings();
    const data = await getMyBoardingPasses();
    setBookings(data);
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="padding-x ">
      <h2 className="text-charcoal text-4xl mb-6">My Bookings</h2>
      {bookings.length === 0 && (
        <p className="text-charcoal-100">No bookings found.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-[70%] gap-6">
        {bookings.map((b) => (
          <div className="rounded-2xl shadow-lg" key={b.bookingId}>
            <div className="bg-charcoal-100 h-20 rounded-t-2xl text-center flex items-center justify-evenly">
              <div>
                <h3 className="uppercase text-white text-2xl">Boarding Pass</h3>
              </div>
              <div>
                <h3 className="uppercase text-white text-xl">
                  {b.flightNumber}{" "}
                </h3>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-[65%_35%] gap-2">
              <div>
                <div className="flex items-center justify-between">
                  <div className="">
                    <p>From:</p>
                    <h3 className="text-5xl text-charcoal-100 font-bold uppercase">
                      {b.origin}
                    </h3>
                    <p className="text-lg text-charcoal-100 uppercase">
                     {b.originCity}
                    </p>
                    <p className="text-base flex flex-col">
                      {formatDate(b.departureTime)}
                      <span>{formatTime(b.departureTime)}</span>
                    </p>
                  </div>
                  <div className="relative">
                    {/* <Plane /> */}
                    <img
                      src="/images/airplane-svgrepo-com.svg"
                      width="140"
                      alt=""
                    />
                    <img
                      src="/images/paper_airplane_send_with_dotted_lines_flate_style.png"
                      className="w-40 absolute top-20 "
                      alt=""
                    />
                  </div>
                  <div className="">
                    <p>To:</p>
                    <h3 className="text-5xl text-charcoal-100 font-bold uppercase">
                      {b.destination}
                    </h3>
                    <p className="text-lg text-charcoal-100 uppercase">
                      {b.destinationCity}
                    </p>
                    <p className="text-base flex flex-col">
                      {formatDate(b.arrivalTime)}
                      <span>{formatTime(b.arrivalTime)}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t-2 border-charcoal-100 mt-4 pt-4">
                  <p className="flex flex-col text-sm">
                    Passenger
                    <span className="text-charcoal-100 text-xl font-bold uppercase">
                      {b.passengerName}
                    </span>
                  </p>
                  <p className="flex flex-col text-sm">
                    Flight
                    <span className="text-charcoal-100 text-xl font-bold uppercase">
                      {b.flightNumber}
                    </span>
                  </p>
                  <p className="flex flex-col text-sm">
                    Terminal
                    <span className="text-charcoal-100 text-xl font-bold uppercase">
                      2b
                    </span>
                  </p>
                  <p className="flex flex-col text-sm">
                    Gate
                    <span className="text-charcoal-100 text-xl font-bold uppercase">
                      A 14
                    </span>
                  </p>
                  <p className="flex flex-col text-sm">
                    Seat
                    <span className="text-charcoal-100 text-xl font-bold uppercase">
                      {b.seatNumbers}
                    </span>
                  </p>
                </div>
              </div>

              {/* Barcode section */}
              <div className="md:px-3">
                <div className="flex justify-between border-b-2 border-charcoal-100 mb-2">
                  <div>
                    <p className="">Passenger</p>
                    <p className="text-charcoal-100 text-xl font-bold uppercase">
                      {b.passengerName}
                    </p>
                  </div>
                  <div>
                    <p className="">Class</p>
                    <p className="text-charcoal-100 text-xl font-bold uppercase mb-2">
                      {b.class}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between border-b-2 border-charcoal-100 mb-2">
                  <div className="">
                    <p className="text-xs">Date</p>
                    <p className="text-charcoal-100 text-sm">{formatDate(b.departureTime)}</p>
                  </div>
                  <div className="">
                    <p className="text-xs">Boarding</p>
                    <p className="text-charcoal-100 text-sm">{formatTime(b.departureTime)}</p>
                  </div>
                  <div className="mb-2">
                    <p className="text-xs">Depart</p>
                    <p className="text-charcoal-100 text-sm">{formatTime(b.arrivalTime)}</p>
                  </div>
                </div>
                <div className="w-full h-20 mb-2">
                  <img
                    src="/images/9185553.png"
                    className="w-full h-full object-cover"
                    alt="Barcode"
                  />
                </div>
                {/* <img src="/images/9185553.png" width={70} alt="" />
              <p>Booking #{b.bookingId}</p>
              <p>Status: {b.bookingStatus}</p>
              <p>Total: ${b.totalPrice}</p>
              <p>Passenger Name : {b.passengerName}</p>
              <p>Seat Number: {b.seatNumbers}</p>
              <p>Flight Number: {b.flightNumber}</p> */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
