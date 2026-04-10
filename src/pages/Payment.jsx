import { useParams, useNavigate } from "react-router-dom";
import { payBooking } from "../api/bookings";

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const handlePay = async () => {
    await payBooking(bookingId);
    navigate("/user/profile/my-bookings");
  };

  return (
    <>
    <div className="padding-x">
      <h2 className="text-2xl">Payment</h2>
      <p className="text-lg">Mock payment gateway</p>
      <button onClick={handlePay} className="px-4 py-2 bg-charcoal rounded-lg text-creame hover:bg-charcoal-100">Pay Now</button>
    </div>
    </>
  );
};

export default Payment;
