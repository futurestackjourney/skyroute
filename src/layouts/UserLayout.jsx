import { Link, Outlet } from "react-router-dom";
import { useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

import {
  Plane,
  LayoutGrid,
  ChartColumnDecreasing,
  Settings,
  TicketsPlane,
  ArrowDown,
  Plus,
  Minus,
  Pencil,
  Trash,
  FilePlusCorner,
  ArrowRightLeft,
  PanelLeftOpen,
  PanelLeftClose,
  ArrowLeft,
  MessageSquareWarning,
  Percent,
  BadgePercent,
  Hotel,
  Bell,
  Mail,
  Info,
} from "lucide-react";

const UserLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [aircraftOpen, setAircraftOpen] = useState(false);
  const [flightsOpen, setFlightsOpen] = useState(false);
  const { user } = useContext(AuthContext);
  return (
    <>
      <div className="relatuve min-h-screen flex bg-[#f1f1f1]">
        {/* Sidebar */}
        <aside
          className={`h-screen sticky  top-0 left-0 shadow-lg overflow-hidden z-10 bg-[#f1f1f1] text-charcoal font-semibold font-lg transition-all duration-300 
        ${collapsed ? "w-12 sm:w-20" : "w-64"}`}
        >
          <div className="p-4">
            {!collapsed && (
              <h1 className="sm:text-2xl font-bold text-charcoal mb-2">
                Profile
              </h1>
            )}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full overflow-hidden object-fill">
                {user.image ? (
                  <img
                    src={user.image}
                    alt="profile"
                    className="h-full w-full"
                  />
                ) : (
                  <div className="h-full w-full bg-[#d9d9d9]"></div>
                )}
              </div>
              <div className="">
                {!collapsed && <h3>{user.fullName}</h3>}
                {!collapsed && (
                  <p className="text-charcoal-100 text-sm">{user.email}</p>
                )}
              </div>
            </div>
          </div>
          <div className="p-4 flex justify-between items-center">
            {!collapsed && (
              <img src="/images/logo.png" width={80} alt="" />
              // <div className="logo text-charcoal bg-linear-to-l from-orange-100 to bg-blue-200 text-Charcoal text-xl font-semibold font-tech rounded-4xl py-2 px-4 flex items-center gap-2">
              //   </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className={`text-pumpkin  transition ${collapsed ? "rotate-180" : "rotate-0"}`}
            >
              <ArrowLeft />
              {/* {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />} */}
              {/* <PanelLeftOpen />
              <ArrowRightLeft className="text-pumpkin "/> */}
            </button>
          </div>

          <nav className="px-2 space-y-2">
            <Link
              to=""
              className="flex gap-2 p-2 rounded hover:bg-charcoal-100 hover:text-creame transition"
            >
              <LayoutGrid className="text-pumpkin " /> {!collapsed && "Home"}
            </Link>

            <Link
              to="promotions"
              className="flex gap-2 p-2 rounded hover:bg-charcoal-100 hover:text-creame transition"
            >
              <BadgePercent className="text-pumpkin " />{" "}
              {!collapsed && "Promotions"}
            </Link>

            {/* booking Dropdown */}
            <div>
              {/* Main Button */}
              <button
                onClick={() => setFlightsOpen(!flightsOpen)}
                className="flex items-center justify-between w-full gap-2 p-2 rounded hover:bg-charcoal-100 hover:text-creame"
              >
                <Link to="my-bookings" className="flex items-center gap-2">
                  <TicketsPlane className="text-pumpkin " />
                  {!collapsed && "My Bookings"}
                </Link>

                {/* Arrow */}
                {!collapsed && (
                  <span
                    className={`transition-transform duration-200 ease-in-out ${
                      flightsOpen ? "rotate-180" : ""
                    }`}
                  >
                    {flightsOpen ? (
                      <Minus className="size-5" />
                    ) : (
                      <Plus className="size-5" />
                    )}
                  </span>
                )}
              </button>

              {/* Dropdown Items */}
              <div
                className={`
                            overflow-hidden transition-all duration-300 ease-in-out
                            ${flightsOpen && !collapsed ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}
                          `}
              >
                <div className="bg-white rounded mt-1">
                  <Link
                    to="booking/create"
                    className="flex gap-2 p-2 rounded hover:bg-charcoal-100 hover:text-creame text-sm"
                  >
                    <FilePlusCorner className="size-4" /> Book a Flight
                  </Link>

                  <Link
                    to="booking/edit"
                    className="flex gap-2 p-2 rounded hover:bg-charcoal-100 hover:text-creame text-sm"
                  >
                    <Pencil className="size-4" /> Extend Booking
                  </Link>

                  <Link
                    to="booking/delete"
                    className="flex gap-2 p-2 rounded hover:bg-charcoal-100 hover:text-creame text-sm"
                  >
                    <Trash className="size-4" /> Cancle Booking
                  </Link>
                </div>
              </div>
            </div>

            {/* complaint Dropdown */}
            <div>
              {/* Main Button */}
              <button
                onClick={() => setAircraftOpen(!aircraftOpen)}
                className="flex items-center justify-between w-full gap-2 p-2 rounded hover:bg-charcoal-100 hover:text-creame"
              >
                <Link to="aircrafts/create" className="flex items-center gap-2">
                  <MessageSquareWarning className="text-pumpkin " />
                  {!collapsed && "Raise a Complaint"}
                </Link>

                {/* Arrow */}
                {!collapsed && (
                  <span
                    className={`transition-transform ease-linear ${
                      aircraftOpen ? "rotate-180" : ""
                    }`}
                  >
                    {aircraftOpen ? (
                      <Minus className="size-5" />
                    ) : (
                      <Plus className="size-5" />
                    )}
                  </span>
                )}
              </button>

              {/* Dropdown Items */}
              <div
                className={`
                            overflow-hidden transition-all duration-300 ease-in-out
                            ${aircraftOpen && !collapsed ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}
                          `}
              >
                <div className="bg-white rounded mt-1">
                  <Link
                    to="complaints/create"
                    className="flex gap-2 p-2 rounded hover:bg-charcoal-100 hover:text-creame text-sm"
                  >
                    <FilePlusCorner className="size-4" /> Raise a Complaint
                  </Link>

                  <Link
                    to="aircrafts/:id/edit"
                    className="flex gap-2 p-2 rounded hover:bg-charcoal-100 hover:text-creame text-sm"
                  >
                    <Pencil className="size-4" /> Track Complaint
                  </Link>

                  <Link
                    to="aircrafts/delete"
                    className="flex gap-2 p-2 rounded hover:bg-charcoal-100 hover:text-creame text-sm"
                  >
                    <Trash className="size-4" /> Delete Complaint
                  </Link>
                </div>
              </div>
            </div>

            <Link
              to="hotel"
              className="flex gap-2 p-2 rounded hover:bg-charcoal-100 hover:text-creame transition"
            >
              <Hotel className="text-pumpkin " />{" "}
              {!collapsed && "Hotel Booking"}
            </Link>

            <div className="bg-[#f1f1f1] z-10 absolute bottom-0 py-4 w-full border-t border-[#d9d9d9]">
              <Link
                to="help"
                className="flex gap-2 p-2 rounded hover:bg-charcoal-100 hover:text-creame transition"
              >
                <Info className="text-pumpkin " />{" "}
                {!collapsed && "Help"}
              </Link>
              <Link
                to="settings"
                className="flex gap-2 p-2 rounded hover:bg-charcoal-100 hover:text-creame transition"
              >
                <Settings className="text-pumpkin " />{" "}
                {!collapsed && "Settings"}
              </Link>
            </div>
          </nav>
        </aside>
        {/* <div className="sticky top-0 left-0 h-screen">
      </div> */}
        <div className="min-h-screen flex-1 flex flex-col w-full">
          <header className="">
            {/* Top Navbar */}
            <div className="bg-charcoal text-creame p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="logo text-charcoal bg-linear-to-l from-orange-100 to bg-blue-200 text-Charcoal text-xl font-semibold font-tech rounded-4xl py-2 px-4 flex items-center gap-2">
                  <img src="/images/logo.png" width={80} alt="" />
                </div>
                <p className="text-sm text-creame/80 hidden sm:block">
                  Welcome back, {user.fullName}!
                </p>
              </div>
              <div>
                <button className="mr-4">
                  <Mail />
                </button>
                <button className="mr-4">
                  <Bell />
                </button>
              </div>
            </div>
          </header>
          {/* Dynamic Content */}
          <main className="flex-1 p-6 bg-gray-100 ">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default UserLayout;
