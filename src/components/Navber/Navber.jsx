import { Link } from "react-router";
import {
  FaBars,
  FaMoon,
  FaSun,
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";

const Navber = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logOut } = useAuth();
  const [themIcon, setThemIcon] = useState("light")

  const currentTheme =
    document.documentElement.getAttribute("data-theme") || "light";

  const toggleTheme = () => {
    const html = document.documentElement;
    const theme = html.getAttribute("data-theme");

    html.setAttribute(
      "data-theme",
      theme === "light" ? "dark" : "light"
    );
    setThemIcon(theme);
  };

  const handleLogout = () => {
    logOut()
      .then(() => { })
      .catch(console.error);
  };

  return (
    // <header className="navbar bg-base-100 border-b shadow-sm sticky top-0 z-40 px-4">
    <header className="navbar bg-base-100 shadow-sm sticky top-0 z-40 px-4">

      {/* Left */}
      <div className="flex-1 flex items-center gap-3">

        {/* Mobile Drawer Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="btn btn-ghost btn-circle lg:hidden"
        >
          <FaBars className="text-lg" />
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/pms-logo.png"
            alt="PMS ERP"
            className="h-10 w-auto"
          />

          <div className="hidden md:block">
            <h2 className="font-bold text-lg">
              PMS ERP
            </h2>

            <p className="text-xs opacity-60">
              Project Management System
            </p>
          </div>
        </Link>

      </div>

      {/* Right */}
      <div className="flex items-center gap-2">

        {/* Theme */}
        <button
          onClick={toggleTheme}
          className="btn btn-ghost btn-circle"
        >
          {currentTheme === "light" ? (
            <FaMoon className="text-lg" />
          ) : (
            <FaSun className="text-lg text-warning" />
          )}
        </button>

        {/* Notification */}
        <button className="btn btn-ghost btn-circle">
          <div className="indicator">

            <FaBell className="text-lg" />

            <span className="badge badge-xs badge-primary indicator-item">
              3
            </span>

          </div>
        </button>

        {/* User */}
        <div className="dropdown dropdown-end">

          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost"
          >
            <div className="flex items-center gap-2">

              <FaUserCircle className="text-3xl text-primary" />

              <div className="hidden md:block text-left">

                <p className="font-semibold leading-4">
                  {user?.displayName || "Administrator"}
                </p>

                <small className="opacity-70">
                  {user?.email}
                </small>

              </div>

            </div>
          </div>

          <ul
            tabIndex={0}
            className="menu dropdown-content mt-3 z-[100] w-56 rounded-box bg-base-100 shadow-lg border"
          >

            <li>
              <Link to="/profile">
                👤 Profile
              </Link>
            </li>

            <li>
              <Link to="/settings">
                ⚙️ Settings
              </Link>
            </li>

            <li>
              <Link to="/change-password">
                🔒 Change Password
              </Link>
            </li>

            <div className="divider my-1"></div>

            <li>

              <button onClick={handleLogout}>
                <FaSignOutAlt />
                Logout
              </button>

            </li>

          </ul>

        </div>

      </div>

    </header>
  );
};

export default Navber;