import { useState, useEffect, useRef } from "react";
import { gsap } from "https://esm.sh/gsap@3.12.5";

const HOTELS = [
  {
    id: 1, name: "The Grand Meridian", city: "Dubai", country: "UAE",
    price: 320, rating: 4.9, reviews: 1240, stars: 5,
    tag: "Luxury", tagColor: "#e9a96e",
    amenities: ["Pool", "Spa", "Gym", "Restaurant", "Concierge"],
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
    bookedDates: ["2025-06-10", "2025-06-11", "2025-06-12"],
    desc: "Iconic tower suite overlooking the Burj Khalifa with panoramic desert skyline views.",
  },
  {
    id: 2, name: "Azura Beach Resort", city: "Karachi", country: "Pakistan",
    price: 145, rating: 4.6, reviews: 820, stars: 4,
    tag: "Beachfront", tagColor: "#5db8a0",
    amenities: ["Beach", "Pool", "Bar", "Spa", "WiFi"],
    img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
    bookedDates: ["2025-06-15", "2025-06-16"],
    desc: "Pristine beach resort on the Arabian Sea with private cabanas and ocean-view suites.",
  },
  {
    id: 3, name: "Maison Élysée", city: "Paris", country: "France",
    price: 480, rating: 4.8, reviews: 2100, stars: 5,
    tag: "Heritage", tagColor: "#c47a5a",
    amenities: ["Michelin Restaurant", "Spa", "Concierge", "Bar", "Gym"],
    img: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80",
    bookedDates: ["2025-06-20", "2025-06-21", "2025-06-22"],
    desc: "Belle Époque palace near the Champs-Élysées with timeless Parisian grandeur.",
  },
  {
    id: 4, name: "Nomo Urban Stay", city: "London", country: "UK",
    price: 210, rating: 4.4, reviews: 680, stars: 4,
    tag: "Design", tagColor: "#7a7dd4",
    amenities: ["Rooftop Bar", "Gym", "Restaurant", "WiFi", "Concierge"],
    img: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80",
    bookedDates: [],
    desc: "Award-winning boutique hotel in Shoreditch with gallery-quality art and bespoke interiors.",
  },
  {
    id: 5, name: "Shinkansen Garden Hotel", city: "Tokyo", country: "Japan",
    price: 195, rating: 4.7, reviews: 1560, stars: 4,
    tag: "Zen", tagColor: "#5db8a0",
    amenities: ["Onsen", "Restaurant", "Garden", "Gym", "WiFi"],
    img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80",
    bookedDates: ["2025-06-18", "2025-06-19"],
    desc: "Minimalist ryokan-inspired hotel with Japanese garden onsen views in Shinjuku.",
  },
  {
    id: 6, name: "Riad Al Andalus", city: "Marrakech", country: "Morocco",
    price: 165, rating: 4.8, reviews: 930, stars: 4,
    tag: "Boutique", tagColor: "#e9a96e",
    amenities: ["Pool", "Hammam", "Restaurant", "Rooftop", "WiFi"],
    img: "https://images.unsplash.com/photo-1590086782792-42dd2350140d?w=600&q=80",
    bookedDates: [],
    desc: "Authentic medina riad with mosaic courtyards, rooftop terrace, and artisan décor.",
  },
  {
    id: 7, name: "Glasshaus Alpine", city: "Zurich", country: "Switzerland",
    price: 390, rating: 4.9, reviews: 450, stars: 5,
    tag: "Luxury", tagColor: "#e9a96e",
    amenities: ["Ski-in/out", "Spa", "Pool", "Restaurant", "Helipad"],
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    bookedDates: ["2025-06-25"],
    desc: "All-glass mountain retreat with direct ski access and panoramic Alps views.",
  },
  {
    id: 8, name: "Lahore Heritage Inn", city: "Lahore", country: "Pakistan",
    price: 95, rating: 4.5, reviews: 310, stars: 3,
    tag: "Cultural", tagColor: "#c47a5a",
    amenities: ["Restaurant", "Garden", "WiFi", "Concierge", "Parking"],
    img: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&q=80",
    bookedDates: [],
    desc: "Colonial-era mansion near Badshahi Mosque with Mughal garden and heritage suites.",
  },
];

const CITIES = ["All Cities", ...new Set(HOTELS.map(h => h.city))];

const StarRating = ({ count }) => (
  <span style={{ letterSpacing: "-1px" }}>
    {[...Array(5)].map((_, i) => (
      <span key={i} style={{ color: i < count ? "#e9a96e" : "oklch(80% 0.02 250)", fontSize: "12px" }}>★</span>
    ))}
  </span>
);

const AmenityPill = ({ label }) => (
  <span style={{
    background: "oklch(96.826% 0.00696 248.26)",
    color: "oklch(49.466% 0.04468 236.159)",
    fontSize: "11px", padding: "3px 8px",
    borderRadius: "100px", border: "1px solid oklch(90% 0.02 248)",
    fontWeight: 500,
  }}>{label}</span>
);

function BookingModal({ hotel, onClose }) {
  const modalRef = useRef();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    gsap.fromTo(modalRef.current,
      { opacity: 0, scale: 0.92, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: "back.out(1.4)" }
    );
  }, []);

  const isDateConflict = () => {
    if (!checkIn || !checkOut) return false;
    const booked = hotel.bookedDates;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      const s = d.toISOString().split("T")[0];
      if (booked.includes(s)) return true;
    }
    return false;
  };

  const nights = checkIn && checkOut
    ? Math.max(0, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000))
    : 0;

  const conflict = isDateConflict();

  const handleBook = () => {
    if (!checkIn || !checkOut || nights < 1 || conflict) return;
    gsap.to(modalRef.current, { scale: 0.96, duration: 0.1, yoyo: true, repeat: 1 });
    setTimeout(() => setConfirmed(true), 200);
  };

  const handleClose = () => {
    gsap.to(modalRef.current, { opacity: 0, scale: 0.92, y: 20, duration: 0.25, ease: "power2.in", onComplete: onClose });
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div onClick={handleClose} style={{
      position: "fixed", inset: 0, background: "rgba(20,30,50,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: "16px",
      backdropFilter: "blur(6px)",
    }}>
      <div ref={modalRef} onClick={e => e.stopPropagation()} style={{
        background: "#fff", borderRadius: "20px", width: "100%", maxWidth: "480px",
        overflow: "hidden", boxShadow: "0 24px 60px rgba(20,30,60,0.18)",
      }}>
        <div style={{ position: "relative", height: "180px", overflow: "hidden" }}>
          <img src={hotel.img} alt={hotel.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(20,30,50,0.7) 0%, transparent 60%)",
          }} />
          <button onClick={handleClose} style={{
            position: "absolute", top: "12px", right: "12px",
            background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%",
            width: "32px", height: "32px", cursor: "pointer", fontSize: "16px",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "oklch(34.591% 0.04142 235.083)",
          }}>×</button>
          <div style={{ position: "absolute", bottom: "16px", left: "20px" }}>
            <p style={{ color: "#fff", fontSize: "18px", fontWeight: 700, margin: 0 }}>{hotel.name}</p>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px", margin: 0 }}>{hotel.city}, {hotel.country}</p>
          </div>
        </div>

        {confirmed ? (
          <div style={{ padding: "32px", textAlign: "center" }}>
            <div style={{
              width: "64px", height: "64px", borderRadius: "50%",
              background: "oklch(73.073% 0.17623 49.145)", margin: "0 auto 16px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "28px",
            }}>✓</div>
            <p style={{ fontSize: "20px", fontWeight: 700, color: "oklch(34.591% 0.04142 235.083)", margin: "0 0 8px" }}>Booking Confirmed!</p>
            <p style={{ color: "oklch(55.102% 0.02343 264.389)", fontSize: "14px", margin: "0 0 4px" }}>
              {hotel.name} · {checkIn} → {checkOut}
            </p>
            <p style={{ color: "oklch(55.102% 0.02343 264.389)", fontSize: "14px", margin: "0 0 24px" }}>
              {nights} night{nights > 1 ? "s" : ""} · {guests} guest{guests > 1 ? "s" : ""} · <strong style={{ color: "oklch(73.073% 0.17623 49.145)" }}>${(nights * hotel.price * guests).toLocaleString()}</strong>
            </p>
            <button onClick={handleClose} style={{
              background: "oklch(73.073% 0.17623 49.145)", color: "#fff",
              border: "none", borderRadius: "12px", padding: "12px 32px",
              fontSize: "15px", fontWeight: 600, cursor: "pointer",
            }}>Done</button>
          </div>
        ) : (
          <div style={{ padding: "24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "oklch(55.102% 0.02343 264.389)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Check-in</label>
                <input type="date" min={today} value={checkIn}
                  onChange={e => { setCheckIn(e.target.value); setCheckOut(""); }}
                  style={{
                    width: "100%", padding: "10px 12px", borderRadius: "10px",
                    border: "1.5px solid oklch(88% 0.02 248)", fontSize: "14px",
                    color: "oklch(34.591% 0.04142 235.083)", outline: "none", boxSizing: "border-box",
                    background: "oklch(98% 0.005 248)",
                  }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "oklch(55.102% 0.02343 264.389)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Check-out</label>
                <input type="date" min={checkIn || today} value={checkOut}
                  onChange={e => setCheckOut(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 12px", borderRadius: "10px",
                    border: "1.5px solid oklch(88% 0.02 248)", fontSize: "14px",
                    color: "oklch(34.591% 0.04142 235.083)", outline: "none", boxSizing: "border-box",
                    background: "oklch(98% 0.005 248)",
                  }} />
              </div>
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "oklch(55.102% 0.02343 264.389)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Guests</label>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <button onClick={() => setGuests(Math.max(1, guests - 1))} style={{
                  width: "36px", height: "36px", borderRadius: "10px", border: "1.5px solid oklch(88% 0.02 248)",
                  background: "oklch(98% 0.005 248)", cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center",
                }}>−</button>
                <span style={{ fontSize: "16px", fontWeight: 600, minWidth: "20px", textAlign: "center" }}>{guests}</span>
                <button onClick={() => setGuests(Math.min(8, guests + 1))} style={{
                  width: "36px", height: "36px", borderRadius: "10px", border: "1.5px solid oklch(88% 0.02 248)",
                  background: "oklch(98% 0.005 248)", cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center",
                }}>+</button>
              </div>
            </div>

            {conflict && (
              <div style={{
                background: "#fff3f3", border: "1px solid #fca5a5", borderRadius: "10px",
                padding: "10px 14px", fontSize: "13px", color: "#b91c1c", marginBottom: "12px",
              }}>⚠ Selected dates overlap with existing bookings. Please choose different dates.</div>
            )}

            {nights > 0 && !conflict && (
              <div style={{
                background: "#fff8f0", border: "1px solid #fde3c4", borderRadius: "10px",
                padding: "12px 16px", marginBottom: "12px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "oklch(55.102% 0.02343 264.389)", marginBottom: "4px" }}>
                  <span>${hotel.price} × {nights} night{nights > 1 ? "s" : ""} × {guests} guest{guests > 1 ? "s" : ""}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "17px", fontWeight: 700, color: "oklch(34.591% 0.04142 235.083)" }}>
                  <span>Total</span>
                  <span style={{ color: "oklch(73.073% 0.17623 49.145)" }}>${(nights * hotel.price * guests).toLocaleString()}</span>
                </div>
              </div>
            )}

            <button onClick={handleBook} disabled={!checkIn || !checkOut || nights < 1 || conflict} style={{
              width: "100%", padding: "14px", borderRadius: "12px", border: "none",
              background: (!checkIn || !checkOut || nights < 1 || conflict)
                ? "oklch(90% 0.01 248)"
                : "oklch(73.073% 0.17623 49.145)",
              color: (!checkIn || !checkOut || nights < 1 || conflict) ? "oklch(60% 0.02 248)" : "#fff",
              fontSize: "15px", fontWeight: 700, cursor: (!checkIn || !checkOut || nights < 1 || conflict) ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}>
              {!checkIn || !checkOut ? "Select Dates" : nights < 1 ? "Invalid Dates" : conflict ? "Unavailable" : `Book for $${(nights * hotel.price * guests).toLocaleString()}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function HotelCard({ hotel, onBook, index }) {
  const cardRef = useRef();
  const imgRef = useRef();
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.55, ease: "power3.out", delay: index * 0.07 }
    );
  }, []);

  const handleMouseEnter = () => {
    setHovered(true);
    gsap.to(imgRef.current, { scale: 1.06, duration: 0.5, ease: "power2.out" });
  };
  const handleMouseLeave = () => {
    setHovered(false);
    gsap.to(imgRef.current, { scale: 1, duration: 0.5, ease: "power2.out" });
  };

  return (
    <div ref={cardRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
      style={{
        background: "#fff", borderRadius: "18px", overflow: "hidden",
        boxShadow: hovered ? "0 16px 48px rgba(34,60,120,0.13)" : "0 2px 12px rgba(46, 100, 226, 0.06)",
        transition: "box-shadow 0.3s, transform 0.3s",
        transform: hovered ? "translateY(-4px)" : "none",
        border: "1px solid oklch(93% 0.01 248)",
      }}>
      <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
        <img ref={imgRef} src={hotel.img} alt={hotel.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", transformOrigin: "center" }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(20,30,60,0.5) 0%, transparent 55%)",
        }} />
        <span style={{
          position: "absolute", top: "12px", left: "12px",
          background: hotel.tagColor, color: "#fff",
          fontSize: "11px", fontWeight: 700, padding: "4px 10px",
          borderRadius: "100px", letterSpacing: "0.4px",
        }}>{hotel.tag}</span>
        <div style={{
          position: "absolute", top: "12px", right: "12px",
          background: "rgba(255,255,255,0.92)", borderRadius: "10px",
          padding: "4px 10px", display: "flex", alignItems: "center", gap: "4px",
        }}>
          <span style={{ color: "#e9a96e", fontSize: "13px" }}>★</span>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "oklch(34.591% 0.04142 235.083)" }}>{hotel.rating}</span>
          <span style={{ fontSize: "11px", color: "oklch(55% 0.02 264)" }}>({hotel.reviews})</span>
        </div>
      </div>

      <div style={{ padding: "18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
          <div>
            <p style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "oklch(34.591% 0.04142 235.083)" }}>{hotel.name}</p>
            <p style={{ margin: "2px 0 0", fontSize: "13px", color: "oklch(55.102% 0.02343 264.389)" }}>
              📍 {hotel.city}, {hotel.country}
            </p>
          </div>
          <StarRating count={hotel.stars} />
        </div>

        <p style={{ fontSize: "12.5px", color: "oklch(55% 0.025 248)", margin: "8px 0 12px", lineHeight: 1.5 }}>
          {hotel.desc}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "14px" }}>
          {hotel.amenities.slice(0, 4).map(a => <AmenityPill key={a} label={a} />)}
          {hotel.amenities.length > 4 && (
            <span style={{ fontSize: "11px", color: "oklch(55% 0.02 264)", padding: "3px 8px" }}>+{hotel.amenities.length - 4} more</span>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: "22px", fontWeight: 800, color: "oklch(34.591% 0.04142 235.083)" }}>${hotel.price}</span>
            <span style={{ fontSize: "12px", color: "oklch(55% 0.02 264)", marginLeft: "4px" }}>/night</span>
          </div>
          <button onClick={() => onBook(hotel)} style={{
            background: "oklch(73.073% 0.17623 49.145)",
            color: "#fff", border: "none", borderRadius: "12px",
            padding: "10px 20px", fontSize: "14px", fontWeight: 700,
            cursor: "pointer", transition: "background 0.2s",
          }}
            onMouseEnter={e => e.target.style.background = "oklch(77.669% 0.14767 52.458)"}
            onMouseLeave={e => e.target.style.background = "oklch(73.073% 0.17623 49.145)"}>
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Hotels() {
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [sortBy, setSortBy] = useState("recommended");
  const [selectedHotel, setSelectedHotel] = useState(null);
  const heroRef = useRef();
  const searchBarRef = useRef();
  const headlineRef = useRef();

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(headlineRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    ).fromTo(searchBarRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.4"
    );
  }, []);

  const filtered = HOTELS
    .filter(h => {
      const q = search.toLowerCase();
      return (
        (selectedCity === "All Cities" || h.city === selectedCity) &&
        (h.name.toLowerCase().includes(q) || h.city.toLowerCase().includes(q) || h.country.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="min-h-100 bg-[#f7f9fb]">

      {/* HERO */}
      <div ref={heroRef} className="pt-22 pb-12 bg-surface text-center relative overflow-hidden">
        
        <div className="absolute top-[-80px] right-[-80px] w-[400px] h-[400px] rounded-[50%] bg-[#f8e5d959]" />
  
        <div className="absolute bottom-[-120px] left-[-60px] w-[350px] h-[350px] rounded-[50%] bg-[#fd802e0d]"/>

        <div ref={headlineRef} className="relative">
          <p className="text-pumpkin text-[13px] font-semibold tracking-widest uppercase mb-[12px]">
            ✦ Hotels worldwide
          </p>
          <h1 className="text-charcoal text-[clamp(28px,5vw,48px)] font-bold mb-12 tracking-tight leading-[1.15]" >
            Find your perfect stay
          </h1>
          <p className="text-gray-400 text-[16px] mb-[32px]">
            {HOTELS.length} handpicked hotels across {new Set(HOTELS.map(h => h.city)).size} cities
          </p>
        </div>

        {/* SEARCH BAR */}
        <div ref={searchBarRef} style={{
          background: "#fff", borderRadius: "16px", padding: "8px",
          display: "flex", gap: "8px", maxWidth: "700px", margin: "0 auto",
          boxShadow: "0 12px 40px rgba(0,0,0,0.2)", position: "relative",
          flexWrap: "wrap",
        }}>
          <input
            placeholder="🔍  Search hotel or city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: "1 1 200px", border: "none", outline: "none", fontSize: "15px",
              padding: "8px 12px", color: "oklch(34.591% 0.04142 235.083)",
              background: "transparent", minWidth: "160px",
            }}
          />
          <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)} style={{
            border: "1px solid oklch(90% 0.01 248)", borderRadius: "10px", padding: "8px 12px",
            fontSize: "14px", color: "oklch(34.591% 0.04142 235.083)", background: "oklch(97% 0.005 248)",
            outline: "none", cursor: "pointer", flex: "0 0 auto",
          }}>
            {CITIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <button style={{
            background: "oklch(73.073% 0.17623 49.145)", color: "#fff", border: "none",
            borderRadius: "10px", padding: "10px 22px", fontSize: "14px", fontWeight: 700, cursor: "pointer",
            flex: "0 0 auto",
          }}>Search</button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* FILTERS ROW */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
          <p style={{ margin: 0, color: "oklch(55.102% 0.02343 264.389)", fontSize: "14px" }}>
            Showing <strong style={{ color: "oklch(34.591% 0.04142 235.083)" }}>{filtered.length}</strong> hotels
            {selectedCity !== "All Cities" ? ` in ${selectedCity}` : ""}
          </p>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span style={{ fontSize: "13px", color: "oklch(55% 0.02 264)" }}>Sort by:</span>
            {[["recommended", "Recommended"], ["rating", "Top Rated"], ["price-asc", "Price ↑"], ["price-desc", "Price ↓"]].map(([val, label]) => (
              <button key={val} onClick={() => setSortBy(val)} style={{
                padding: "6px 14px", borderRadius: "100px", border: "1.5px solid",
                borderColor: sortBy === val ? "oklch(73.073% 0.17623 49.145)" : "oklch(88% 0.01 248)",
                background: sortBy === val ? "oklch(73.073% 0.17623 49.145)" : "#fff",
                color: sortBy === val ? "#fff" : "oklch(49.466% 0.04468 236.159)",
                fontSize: "12.5px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
              }}>{label}</button>
            ))}
          </div>
        </div>

        {/* GRID */}
        {filtered.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "24px",
          }}>
            {filtered.map((hotel, i) => (
              <HotelCard key={hotel.id} hotel={hotel} onBook={setSelectedHotel} index={i} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <p style={{ fontSize: "48px", margin: "0 0 16px" }}>🏨</p>
            <p style={{ fontSize: "20px", fontWeight: 700, color: "oklch(34.591% 0.04142 235.083)", margin: "0 0 8px" }}>No hotels found</p>
            <p style={{ color: "oklch(55% 0.02 264)", fontSize: "14px" }}>Try a different city or search term</p>
          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedHotel && <BookingModal hotel={selectedHotel} onClose={() => setSelectedHotel(null)} />}
    </div>
  );
}
