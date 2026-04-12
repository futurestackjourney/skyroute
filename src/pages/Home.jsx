import { ArrowRight, Cog, Search, Star } from "lucide-react";
import { useState, useRef, useEffect, use } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { Popular, features, works, deals, testimonials } from "../constants";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRevealAnimation } from "../animations/useRevealAnimation ";
import { useStaggerReveal } from "../animations/useStaggerReveal";
import SectionSkeleton from "../components/skeleton/SectionSkeleton";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { showError } from "../utils/toast";

gsap.registerPlugin(ScrollTrigger);
const Home = () => {
  // ----- STATES -----
  // const [loading, setLoading] = useState(true);
  const [sectionLoading, setSectionLoading] = useState(false);
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [offers, setOffers] = useState([]);
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [query, setQuery] = useState({
    origin: "",
    destination: "",
    date: "",
  });
  const navigate = useNavigate();
  const container = useRef();

  // HERO SECTIONS ANIMATIONS
  // Animated elements
  const titleRef = useRef();
  const textRef = useRef();
  const btnRef = useRef();
  const planeRef = useRef();
  const leftFormRef = useRef();
  const rightFormRef = useRef();
  const donutRef = useRef();
  const bgRef = useRef();

  // Section refs
  const sectionsRef = useRef([]);
  const cardsRefs = useRef([]);
  const headingRefs = useRef([]);
  const subTextRefs = useRef([]);
  const contentRefs = useRef([]);

  // Reset refs on each render
  sectionsRef.current = [];
  cardsRefs.current = [];
  headingRefs.current = [];
  subTextRefs.current = [];
  contentRefs.current = [];

  // HERO SECTION ANIMATION
  useGSAP(
    () => {
      const tl = gsap.timeline();
      tl.from(bgRef.current, {
        // y: -100,
        opacity: 0,
        duration: 0.4,
        // scale: 0,
        ease: "power4.out",
      });

      // Animate ONLY these refs
      tl.from(titleRef.current, {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      });

      tl.from(leftFormRef.current, {
        x: -100,
        opacity: 0,
        duration: 0.4,
        ease: "power4.out",
      });
      tl.from(rightFormRef.current, {
        x: 20,
        opacity: 0,
        duration: 0.4,
        ease: "power4.out",
      });

      tl.from(
        textRef.current,
        {
          x: 100,
          opacity: 0,
          duration: 0.8,
        },
        "-=0.5",
      );

      tl.from(
        btnRef.current,
        {
          x: 10,
          opacity: 0,
          duration: 0.6,
        },
        "-=0.4",
      );
      tl.from(
        planeRef.current,
        {
          y: 200,
          opacity: 0,
          duration: 2.9,
          zIndex: -1,
          ease: "power4.out",
        },
        "-=0.4",
      );

      tl.from(donutRef.current, {
        y: 200,
        opacity: 0,
        duration: 1.2,
        ease: "expo.out",
      }).to(donutRef.current, {
        rotation: "+=360",
        duration: 8,
        repeat: -1,
        ease: "linear",
      });
    },
    { scope: container },
  );

  const cardRef = useRef();
  const headingRef = useRef();
  const headingTopRef = useRef();
  const paraRef = useRef();
  const imgRef = useRef();
  const addToRefs = useStaggerReveal();

  useRevealAnimation(cardRef, { direction: "bottom", duration: 1.2 });
  useRevealAnimation(headingRef, { direction: "left", duration: 1.2 });
  useRevealAnimation(headingTopRef, { direction: "top", duration: 1.2 });
  useRevealAnimation(paraRef, { direction: "right", duration: 1.2 });
  useRevealAnimation(imgRef, {
    direction: "bottom",
    duration: 1.2,
    opacity: 0,
  });

  // === FETCH POPULAR DESTINATION ===
  const fetchPopularDestinations = async () => {
    try {
      setSectionLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setPopularDestinations(Popular);
    } catch (err) {
      showError("Fail to load Popupar Destinations");
      console.error("Error loading popular destinations:", err);
    } finally {
      setSectionLoading(false);
    }
  };

  // === FETCH DEALS ===
  const FetchDeals = async () => {
    try {
      setSectionLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setOffers(deals);
    } catch (err) {
      showError("Fail to load Deals ");
      console.error("Error Loading Deals", err);
    } finally {
      setSectionLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularDestinations();
    FetchDeals();
  }, []);

  const handleSearch = () => {
    if (!query.origin || !query.destination || !query.date) {
      alert("Please fill all fields");
      return;
    }

    // navigate(
    //   `/flights?origin=${query.origin}&destination=${query.destination}&date=${query.date}`,
    // );
    navigate(
      `/search?origin=${encodeURIComponent(query.origin)}&destination=${encodeURIComponent(query.destination)}&date=${query.date}`,
    );
  };

  const handleOriginChange = async (e) => {
    const value = e.target.value;

    setQuery({ ...query, origin: value });

    if (value.length >= 1) {
      const res = await api.get("/flights/autocomplete", {
        params: {
          query: value,
          isOrigin: true,
        },
      });

      setOriginSuggestions(res.data);
    } else {
      setOriginSuggestions([]);
    }
  };

  const handleDestinationChange = async (e) => {
    const value = e.target.value;

    setQuery({ ...query, destination: value });

    if (value.length >= 1) {
      const res = await api.get("/flights/autocomplete", {
        params: {
          query: value,
          isOrigin: false,
        },
      });

      setDestinationSuggestions(res.data);
    } else {
      setDestinationSuggestions([]);
    }
  };

  return (
    <>
      {/* Home Section */}
      <div
        ref={container}
        className="max-w-full mx-auto h-[150vh] md:h-[110vh] relative"
      >
        {/* SVG Clip Path */}
        <svg width="0" height="0" className="absolute">
          <defs>
            <clipPath id="customReviewShape" clipPathUnits="objectBoundingBox">
              <path
                d="
                      M 0 0
                      H 1
                      V 0.5
                      V 1

                      H 0.88
                      C 0.79 1 0.83 0.9 0.75 0.9

                      H 0.25
                      C 0.17 0.9 0.21 1 0.13 1

                      H 0

                      M 0 0.5
                      V 0
                      V 0.5
                      H 0
                      V 1

                      Z
        "
              />
            </clipPath>
          </defs>
        </svg>
        <div
          ref={bgRef}
          className="bg-[url(https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg)] bg-cover bg-center bg-no-repeat bg-fixed h-full flex items-center justify-center relative"
          style={{
            clipPath: "url(#customReviewShape)",
            WebkitClipPath: "url(#customReviewShape)",
          }}
        >
          <img
            ref={planeRef}
            src="/images/aircraft.png"
            className="z-0 md:z-10 absolute w-md md:w-lg 2xl:w-4xl"
            alt=""
          />
          <div className="max-w-3xl text-center absolute top-30">
            <h1
              ref={titleRef}
              className="text-6xl md:text-7xl 2xl:text-9xl font-bold uppercase masked-text"
            >
              fly in style arrive in confort
            </h1>
          </div>

          <div className=" w-full padding-x">
            {/* Left Side */}
            <div className="absolute bottom-24 md:bottom-18 2xl:bottom-25 left-10 max-w-sm">
              {/* TEXT CONTENT */}
              <div ref={textRef} className="mb-2 w-xs">
                <h2 className="text-charcoal text-2xl sm:text-3xl font-bold tracking-tighter ">
                  Plan your trip
                </h2>
                <p className="text-charcoal-100 text-sm xl:text-base mt-1 mb-4">
                  Discover the world with SkyRoute - your trusted partner for
                  seamless travel experiences.
                </p>
                {/* <button className="py-3 px-4 xl:py-3 xl:px-6 text-sm xl:text-lg rounded-full bg-charcoal text-creame shadow-lg shadow-[#000a4ea0]">
                  Start Your Journey
                </button> */}
              </div>

              {/* BOOKING FORM */}
              <div
                ref={leftFormRef}
                className="bg-charcoal/30 rounded-4xl p-4 flex flex-col  items-start justify-center shadow-lg shadow-black/50 md:w-xs 2xl:w-lg"
              >
                {/* Button for type */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <button className="bg-white rounded-full p-2 text-charcoal text-[0.7rem] hover:bg-zinc-300 active:bg-zinc-300 hover:cursor-pointer ">
                    One Way
                  </button>
                  <button className="bg-white rounded-full p-2 text-charcoal text-[0.7rem] hover:bg-zinc-300 active:bg-zinc-300 hover:cursor-pointer">
                    Rounded
                  </button>
                  <button className="bg-white rounded-full p-2 text-charcoal text-[0.7rem] hover:bg-zinc-300 active:bg-zinc-300 hover:cursor-pointer">
                    Multi City
                  </button>
                </div>
                {/* input fields */}
                <div className="flex flex-col gap-6 ">
                  <div className="flex gap-2">
                    <div className="bg-charcoal-100 border border-zinc-100 p-2 rounded-2xl ">
                      <h4 className="text-creame text-sm mb-1">Leaving from</h4>
                      <input
                        type="text"
                        name="origin"
                        value={query.origin}
                        onChange={handleOriginChange}
                        placeholder="Karachi, Pakistan"
                        className="book-input p-2 rounded-xl text-charcoal "
                      />
                      {originSuggestions.length > 0 && (
                        <ul className="absolute z-10 bg-white w-35 rounded-xl mt-1 max-h-40 overflow-auto">
                          {originSuggestions.map((city, index) => (
                            <li
                              key={index}
                              className="p-2 hover:bg-gray-200 cursor-pointer"
                              onClick={() => {
                                setQuery({ ...query, origin: city });
                                setOriginSuggestions([]);
                              }}
                            >
                              {city}
                            </li>
                          ))}
                        </ul>
                      )}{" "}
                    </div>
                    <div className="bg-charcoal-100 border border-zinc-100 p-2 rounded-2xl">
                      <h4 className="text-creame text-sm mb-1">Going to</h4>
                      <input
                        type="text"
                        name="destination"
                        value={query.destination}
                        onChange={handleDestinationChange}
                        placeholder="Dubai, UAE"
                        className="book-input p-2 rounded-xl text-charcoal"
                      />
                      {destinationSuggestions.length > 0 && (
                        <div className="absolute z-10 bg-white w-35 rounded-xl mt-1 max-h-40 overflow-auto">
                          {destinationSuggestions.map((city) => (
                            <div
                              key={city}
                              onClick={() => {
                                setQuery({ ...query, destination: city });
                                setDestinationSuggestions([]);
                              }}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                            >
                              {city}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="bg-charcoal-100 border border-zinc-100 p-2 rounded-2xl">
                      <h4 className="text-creame text-sm mb-1">Departing</h4>
                      <input
                        type="date"
                        value={query.date}
                        onChange={(e) =>
                          setQuery({ ...query, date: e.target.value })
                        }
                        placeholder="Oct11,2026"
                        className="book-input p-2 rounded-xl text-charcoal"
                      />
                    </div>
                    {/* <div className="border border-zinc-100 p-2 rounded-2xl">
                  <h4 className="text-zinc-600 text-sm">Class</h4>
                </div> */}
                    <button
                      onClick={handleSearch}
                      className="bg-charcoal-100 hover:bg-charcoal-50 border border-zinc-100 p-2 rounded-2xl px-6 "
                    >
                      <Search className="text-white size-6 w-16 " />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="absolute bottom-5 right-10">
              <div className="flex flex-col justify-end items-end ">
                {/* REVIEW CARD */}
                <div
                  ref={rightFormRef}
                  className="relative hidden md:block md:w-sm 2xl:w-md"
                >
                  {/* have to use here  */}
                  {/* SVG Clip Path */}
                  <svg width="0" height="0" className="absolute">
                    <defs>
                      <clipPath
                        id="reviewShape"
                        clipPathUnits="objectBoundingBox"
                      >
                        <path
                          d="
                        M 0 0
                        V 1
                        H 0.567
                        Q 0.7 1 0.7 0.8
                        V 0.75
                        Q 0.7 0.55 0.833 0.55
                        L 0.867 0.55
                        Q 1 0.55 1 0.35
                        V 0
                        H 0
                        Z
                      "
                        />
                      </clipPath>
                    </defs>
                  </svg>

                  <div
                    className="bg-charcoal/30  rounded-4xl p-4  h-full min-h-50 min-w-50 "
                    style={{
                      clipPath: "url(#reviewShape)",
                      WebkitClipPath: "url(#reviewShape)",
                    }}
                  >
                    <h3 className="text-charcoal font-bold text-xl sm:text-2xl">
                      1.2M+
                    </h3>
                    <p className="text-charcoal-100 text-sm sm:text-lg">
                      Active Passenger world wide
                    </p>
                    <div className="flex flex-col gap-4  relative h-20">
                      <div className="flex -space-x-4">
                        <div className="absolute top-4 left-0 rounded-full border-creame border-2 w-12 h-12 overflow-hidden">
                          <img
                            src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGVvcGxlfGVufDB8fDB8fHww"
                            alt=""
                          />
                        </div>
                        <div className="absolute top-4 left-10 rounded-full border-creame border-2 w-12 h-12 overflow-hidden">
                          <img
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGVvcGxlfGVufDB8fDB8fHww"
                            alt=""
                          />
                        </div>
                        <div className="absolute top-4 left-20 rounded-full border-creame border-2 w-12 h-12 overflow-hidden">
                          <img
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cGVvcGxlfGVufDB8fDB8fHww"
                            alt=""
                          />
                        </div>
                      </div>
                      <div className=" flex items-center justify-center gap-1 mt-2 ms-6">
                        <Star className="size-8 fill-charcoal" />
                        <p className="text-creame font-semibold text-base">
                          <span className="font-bold text-3xl text-charcoal">
                            5
                          </span>{" "}
                          Stars
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    ref={btnRef}
                    className="px-8 py-3 bg-charcoal text-creame rounded-3xl absolute bottom-5 right-2 "
                  >
                    <ArrowRight className="size-8" />
                  </button>
                </div>

                {/* DONUT RING */}
                <div ref={donutRef} className="hidden md:block mt-4 ms-4">
                  <svg width="120" height="120" viewBox="-20 -20 240 240">
                    {/* Gradient */}
                    <defs>
                      <linearGradient
                        id="grad"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#fd802e" />
                        <stop offset="100%" stopColor="#233d4c" />
                      </linearGradient>

                      {/* Circle Path */}
                      <path
                        id="circlePath"
                        d="M100,20 a80,80 0 1,1 0,160 a80,80 0 1,1 0,-160"
                      />
                    </defs>

                    {/* Donut Ring */}
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      stroke="url(#grad)"
                      strokeWidth="60"
                      fill="none"
                    />

                    {/* Curved Text */}
                    <text
                      fill="white"
                      fontSize="24"
                      fontWeight="700"
                      letterSpacing="5"
                      dominantBaseline="middle"
                    >
                      <textPath href="#circlePath" startOffset="5%">
                        COMFORT
                      </textPath>

                      <textPath href="#circlePath" startOffset="40%">
                        ENCE FEE
                      </textPath>

                      <textPath href="#circlePath" startOffset="75%">
                        EXPERT
                      </textPath>
                    </text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section>
        <div className="padding-x h-max my-10">
          <div className="mb-10">
            <h1 ref={headingRef} className="text-charcoal text-4xl mb-1">
              Popular Destinations
            </h1>
            <p className="text-base text-charcoal-100">
              Discover the most loved travel spots around the world
            </p>
          </div>
          <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
            {Popular.map((pop, key) => (
              <div
                // ref={(el) => (gcardsRef.current[key] = el)}
                ref={addToRefs}
                key={key}
                className="overflow-hidden w-full sm:h-80 relative"
              >
                <img
                  src={pop.image}
                  alt=""
                  className="w-full h-full object-cover rounded-2xl"
                  loading="lazy"
                />
                <div className="absolute z-10 bottom-6 px-2 text-zinc-200">
                  <h3 className="text-lg font-semibold">{pop.title}</h3>
                  <p className="text-sm">{pop.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* {sectionLoading ? (
        <SectionSkeleton type="card" count={3} />
      ) : (
      )} */}
      {/* Popular Destinations Section */}
      <section></section>

      {/* Comfort & Experience Section */}
      <section>
        <div className="padding-x my-10 py-10 bg-[#f1f1f1f1]">
          {/* <h1 className="text-charcoal-50 text-3xl font-bold mb-10">
            Popular Destinations
          </h1> */}

          <div className="flex gap-4 md:flex-row flex-col md:max-h-100 overflow-hidden">
            <div className="relative">
              {/* SVG Clip Path */}
              <svg width="0" height="0" className="absolute">
                <defs>
                  <clipPath
                    id="customMiniShape1"
                    clipPathUnits="objectBoundingBox"
                  >
                    <path
                      d="
                        M 0.375 0
                        H 1
                        V 1
                        H 0
                        V 0.409
                        q 0 -0.136 0.125 -0.136
                        q 0.125 0 0.125 -0.136

                        M 0.375 0
                        q -0.125 0 -0.125 0.136
                        Z
                      "
                    />
                  </clipPath>
                </defs>
              </svg>
              <div
                className="w-full md:w-2xl md:h-full overflow-hidden "
                style={{
                  clipPath: "url(#customMiniShape1)",
                  WebkitClipPath: "url(#customMiniShape1)",
                }}
              >
                <img
                  ref={cardRef}
                  src="/images/woman-sleeping-airplane.jpg"
                  alt=""
                  className="rounded-3xl h-full w-full object-cover"
                />
              </div>

              {/* <button className="absolute top-5 sm:top-10 left-0 sm:left-2 py-2 px-4 sm:py-3 sm:px-6 bg-pumpkin text-creame text-sm sm:text-lg rounded-2xl uppercase tracking-widest">
              Comfort
            </button> */}
            </div>

            <div ref={paraRef} className="my-auto ">
              <h2 className="text-pumpkin text-xl font-semibold">
                Experience Ultimate Comfort
              </h2>
              <p className="text-sm text-charcoal-100 mb-4">
                Traveling with SkyRoute means enjoying a journey designed around
                your comfort. From spacious seating to adjustable ergonomic
                chairs, every passenger can relax and stretch out during their
                flight. Our cabins are thoughtfully arranged to provide personal
                space and a sense of calm, letting you focus on your journey
                instead of feeling cramped or rushed.
              </p>
              <p className="text-sm text-charcoal-100 mb-4">
                We understand that a comfortable flight is more than just a
                seat. That’s why we provide premium amenities such as soft
                lighting, noise-reducing cabins, and easy access to
                refreshments. Every detail, from cabin temperature to onboard
                service, is carefully considered to ensure that your time in the
                air feels effortless and rejuvenating.
              </p>
              {/* <p className="text-sm text-charcoal-100 mb-4">
               We understand that a comfortable flight is more than just a seat. That’s why we provide premium amenities such as soft lighting, noise-reducing cabins, and easy access to refreshments. Every detail, from cabin temperature to onboard service, is carefully considered to ensure that your time in the air feels effortless and rejuvenating.
              </p> */}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose SkyRoute Section */}
      <section>
        <div className="padding-x py-4 sm:py-10">
          <div>
            <div className="mb-10">
              <h1
                ref={headingRef}
                className="text-charcoal text-4xl mb-1 tracking-wide"
              >
                Why Choose SkyRoute
              </h1>
              <p ref={headingTopRef} className="text-base text-charcoal-100">
                Experience comfort, reliability, and convenience on every
                journey
              </p>
            </div>
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
              {features.map((feature, key) => {
                const Icon1 = feature.icon1;
                const Icon2 = feature.icon2;
                return (
                  <div
                    ref={addToRefs}
                    key={key}
                    className=" p-4 rounded-xl shadow-lg"
                  >
                    <div className="flex items-center gap-2 text-pumpkin">
                      <div className="bg-charcoal/10 p-2 rounded-full">
                        <Icon1 className="size-6 sm:size-10" />
                      </div>
                      <Icon2 className="size-6 sm:size-10" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mt-4 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-charcoal-100">
                        {feature.para1}
                      </p>
                      <p className="text-sm text-charcoal-100">
                        {feature.para2}
                      </p>
                      <p></p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      {sectionLoading ? (
        <SectionSkeleton type="card" count={3} />
      ) : (
        <section>
          <div className="padding-x py-4 sm:py-10">
            <div>
              <div className="text-center mb-10">
                <h1 className="text-charcoal text-4xl  text-center uppercase">
                  How it Works
                </h1>
                <p className="text-xl text-charcoal-100 ">
                  Your journey starts with these simple steps
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 ">
                {works.map((work, key) => (
                  <div
                    key={key}
                    className="flex flex-col items-center justify-center text-center py-6 px-8 rounded-xl shadow-lg relative "
                  >
                    <div className="absolute top-20 -right-10 w-20 hidden lg:block">
                      <img src={work.icon2} alt="" />
                    </div>
                    <div className="relative mb-2">
                      <div className="w-30 p-6 rounded-full absolute top-7 left-8 text-pumpkin bg-[#f7f9fb] z-10">
                        <img src={work.icon1} alt="" />
                      </div>
                      <div className="size-45">
                        <svg
                          viewBox="0 0 32 32"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                        >
                          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                          <g
                            id="SVGRepo_tracerCarrier"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></g>
                          <g id="SVGRepo_iconCarrier">
                            {" "}
                            <path
                              stroke="#f2f2f2"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13.905 3.379A.5.5 0 0114.39 3h3.22a.5.5 0 01.485.379l.689 2.757a.515.515 0 00.341.362c.383.126.755.274 1.115.443a.515.515 0 00.449-.003l2.767-1.383a.5.5 0 01.577.093l2.319 2.319a.5.5 0 01.093.577l-1.383 2.767a.515.515 0 00-.003.449c.127.271.243.549.346.833.053.148.17.265.319.315l2.934.978a.5.5 0 01.342.474v3.28a.5.5 0 01-.342.474l-2.934.978a.515.515 0 00-.32.315 9.937 9.937 0 01-.345.833.515.515 0 00.003.449l1.383 2.767a.5.5 0 01-.093.577l-2.319 2.319a.5.5 0 01-.577.093l-2.767-1.383a.515.515 0 00-.449-.003c-.271.127-.549.243-.833.346a.515.515 0 00-.315.319l-.978 2.934a.5.5 0 01-.474.342h-3.28a.5.5 0 01-.474-.342l-.978-2.934a.515.515 0 00-.315-.32 9.95 9.95 0 01-1.101-.475.515.515 0 00-.498.014l-2.437 1.463a.5.5 0 01-.611-.075l-2.277-2.277a.5.5 0 01-.075-.61l1.463-2.438a.515.515 0 00.014-.498 9.938 9.938 0 01-.573-1.383.515.515 0 00-.362-.341l-2.757-.69A.5.5 0 013 17.61v-3.22a.5.5 0 01.379-.485l2.757-.689a.515.515 0 00.362-.341c.157-.478.35-.94.573-1.383a.515.515 0 00-.014-.498L5.594 8.557a.5.5 0 01.075-.611l2.277-2.277a.5.5 0 01.61-.075l2.438 1.463c.152.091.34.094.498.014a9.938 9.938 0 011.382-.573.515.515 0 00.342-.362l.69-2.757z"
                            ></path>{" "}
                            <circle
                              cx="16"
                              cy="16"
                              r="5"
                              stroke="#535358"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                            ></circle>{" "}
                          </g>
                        </svg>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-2 text-center mb-2">
                        <h1 className="text-pumpkin text-6xl font-bold">
                          {work.count}
                        </h1>
                        <h3 className="text-charcoal text-2xl font-bold tracking-wide">
                          {work.title}
                        </h3>
                      </div>
                      <p className="text-chrcoal-100 text-base flex-wrap ">
                        {work.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
      {/* Deals Sectiion */}
      {/* {sectionLoading ? (
        <SectionSkeleton type="list" count={3} />
      ) : (
      )} */}
      <section>
        <div className="padding-x py-4 sm:py-10 bg-creame">
          <div>
            <div className="mb-10">
              <h1 ref={headingRef} className="text-4xl text-charcoal">
                Deals & Offers
              </h1>
              <p ref={headingTopRef} className="text-lg text-charcoal-100">
                Unlock Exclusive Savings & Limited-Time Deals!
              </p>
            </div>

            <div className="grid grid-cols-1 2xl:grid-cols-2 space-y-2 sm:space-y-8">
              {deals.map((deal, key) => (
                <div
                  ref={addToRefs}
                  key={key}
                  className="px-6 py-4  rounded-xl flex gap-4 md:flex-row md:max-h-100"
                >
                  {/* SVG Clip Path */}
                  <svg width="0" height="0" className="absolute">
                    <defs>
                      <clipPath
                        id="customMiniShape2"
                        clipPathUnits="objectBoundingBox"
                      >
                        <path
                          d="
                           M 0 0
                            V 1
                            H 0.676
                            Q 0.784 1 0.784 0.833
                            Q 0.784 0.667 0.892 0.667
                            Q 1 0.667 1 0.5
                            V 0
                            H 0
                            Z
                          "
                        />
                      </clipPath>
                    </defs>
                  </svg>
                  <div
                    className="w-full md:w-2xl md:h-full overflow-hidden"
                    style={{
                      clipPath: "url(#customMiniShape2)",
                      WebkitClipPath: "url(#customMiniShape2)",
                    }}
                    >
                    {/* {sectionLoading && deal.image === null ? (
                      <SectionSkeleton type="image" count={1} />
                    ) : (
                    )} */}
                      <img
                        loading="lazy"
                        src={deal.image}
                        className="rounded-3xl h-full w-full object-cover"
                        alt={deal.title}
                      />
                  </div>
                  <div className="">
                    <h1 className="text-xl sm:text-3xl text-charcoal">
                      {deal.title}
                    </h1>
                    <p className="text-base text-charcoal-100">{deal.desc}</p>
                    <h4 className="text-2xl text-black line-through decoration-red-600 ">
                      {deal.price}
                    </h4>
                    {/* <h3>$220</h3> */}
                    <button className="py-2 px-4 bg-charcoal text-creame rounded-xl">
                      Book now
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <button className="py-3 px-6 border-2 border-charcoal text-charcoal rounded-2xl hover:text-creame hover:bg-charcoal transition-colors">
                View All Deals
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section>
        <div className="padding-x py-4 sm:py-10 ">
          <div>
            <div className="mb-10 text-center">
              <h1 ref={headingRef} className="text-4xl text-charcoal">
                Testimonails & Reviews
              </h1>
              <p ref={headingTopRef} className="text-lg text-charcoal-100">
                Hear From Our Happy Customers!
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-8">
              {/* SVG Clip Path */}
              <svg width="0" height="0" className="absolute">
                <defs>
                  <clipPath
                    id="customMiniShape8"
                    clipPathUnits="objectBoundingBox"
                  >
                    <path
                      d="
                          M 0.719 0
                          H 0
                          V 1
                          H 1
                          V 0.375
                          Q 1 0.25 0.906 0.25
                          Q 0.813 0.25 0.813 0.125
                          Q 0.813 0 0.719 0
                          Z
                        "

                      // d="
                      //     M 0.275 0
                      //     H 0
                      //     V 1
                      //     H 1
                      //     V 0
                      //     H 0.725
                      //     Q 0.6 0 0.575 0.208
                      //     Q 0.5 0.375 0.425 0.208
                      //     Q 0.4 0 0.275 0
                      //     Z
                      //   "
                    />
                  </clipPath>
                </defs>
              </svg>
              {testimonials.map((review, key) => (
                <div
                  ref={addToRefs}
                  key={key}
                  className="py-4 px-6 text-center rounded-2xl flex justify-center items-center flex-col
                            bg-[url(https://media.istockphoto.com/id/1309531348/vector/white-hexagon-5.jpg?s=612x612&w=0&k=20&c=yfDPUlZQJlu4L_dy0lVMD0x7mpEe6jgp2EsdKstRY_k=)] bg-cover bg-no-repeat bg-center
                            "
                  style={{
                    clipPath: "url(#customMiniShape8)",
                    WebkitClipPath: "url(#customMiniShape8)",
                  }}
                >
                  <div className="w-18 h-18  rounded-full overflow-hidden">
                    <img
                      className="w-full "
                      src={review.image}
                      alt=""
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-sm mt-2 text-charcoal-100">
                    -{review.name}
                  </h3>
                  <div className="">
                    <div className="flex gap-1 justify-center items-center mt-4">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="size-4 text-amber-400 fill-amber-400"
                        />
                      ))}
                    </div>
                    <h3 className="text-charcoal text-lg md:text-xl">
                      {review.title}
                    </h3>
                    <p className="text-charcoal-100 text-sm 2xl:text-base">
                      {review.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <button className="py-3 px-6 border-2 border-charcoal text-charcoal rounded-2xl hover:text-creame hover:bg-charcoal transition-colors">
                Read More Reviews
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section>
        <div className="padding-x py-6 sm:py-12 bg-[#f1f1f1]">
          {/* Section Header */}
          <div className="mb-10 text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-semibold text-charcoal">
              Stay Updated & Save!
            </h1>
            <p className="mt-3 text-lg text-charcoal-100">
              Unlock exclusive deals, travel tips, and early access to special
              offers. Be the first to know about discounted flights and premium
              packages.
            </p>
          </div>

          {/* Main Box */}
          <div className="rounded-2xl bg-white py-6 px-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-[35%_65%] gap-6">
              {/* Image */}
              <div className="h-full w-full overflow-hidden rounded-xl">
                <img
                  src="/images/Wavy_Bus-38_Single-01.jpg"
                  alt="Travel Newsletter"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex justify-center items-center flex-col">
                {/* Title */}
                <h2 className="text-charcoal text-3xl font-medium">
                  Subscribe to Our Newsletter
                </h2>

                {/* Description */}
                <p className="mt-2 text-charcoal-100 text-base max-w-md">
                  Join thousands of travelers who receive weekly updates on the
                  best flight deals, hotel discounts, and exclusive promotions.
                </p>

                {/* Benefits */}
                {/* <ul className="mt-4 space-y-2 text-sm text-charcoal-100">
            <li>✔ Early access to limited-time offers</li>
            <li>✔ Personalized travel recommendations</li>
            <li>✔ Member-only discounts</li>
            <li>✔ Travel tips & destination guides</li>
          </ul> */}

                {/* Form */}
                <div className="w-full max-w-md space-y-4 mt-6">
                  <input
                    type="email"
                    placeholder="Your Email Address"
                    className="w-full py-2 px-3 rounded-lg border border-[#d9d9d9] text-base focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />

                  <input
                    type="tel"
                    placeholder="Your Phone Number (Optional)"
                    className="w-full py-2 px-3 rounded-lg border border-[#d9d9d9] text-base focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />

                  {/* Button */}
                  <button className="w-full bg-pumpkin-100 hover:bg-pumpkin transition text-white py-2.5 rounded-lg font-medium">
                    Subscribe Now
                  </button>
                </div>

                {/* Trust Line */}
                <p className="mt-3 text-xs text-charcoal-100">
                  By Subscribing you agree to our Privacy Policy and Terms of
                  Service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
