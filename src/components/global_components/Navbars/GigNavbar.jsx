import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import userAvatar from "../../../assets/user-avatar.png";

const GigNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // 🧠 Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🚪 Handle Logout
  const handleLogout = () => {
    localStorage.clear();
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <nav className="bg-white/10 backdrop-blur-xl border-b border-white/10 fixed top-0 left-0 w-full z-50 shadow-md">
      <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo */}
        <Link
          to="/gig"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="App Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
            GigConnect
          </span>
        </Link>

        {/* Right section */}
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {/* Avatar button */}
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            type="button"
            className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
            aria-expanded={dropdownOpen}
          >
            <img
              className="w-8 h-8 rounded-full"
              src={userAvatar}
              alt="user avatar"
            />
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute top-14 right-4 z-50 my-4 w-40 text-base list-none bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg"
            >
              <ul className="py-2">
                <li>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-white/20 rounded-md"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-300 rounded-lg md:hidden hover:bg-white/10 focus:outline-none"
          >
            <FiMenu className="w-5 h-5" />
          </button>
        </div>

        {/* Navbar links */}
        <div
          className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
            menuOpen ? "" : "hidden"
          }`}
        >
          <ul
            className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-white/10 rounded-lg 
            bg-gray-800/60 md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-transparent"
          >
            <li>
              <Link
                to="/gigworker/my-bids"
                className="block py-2 px-3 text-white hover:text-blue-500 md:p-0"
              >
                My Bids
              </Link>
            </li>
            <li>
              <Link
                to="/gigworker"
                className="block py-2 px-3 text-white hover:text-blue-500 md:p-0"
              >
                Report Feed
              </Link>
            </li>
            <li>
              <Link
                to="/gigworker/current-work"
                className="block py-2 px-3 text-white hover:text-blue-500 md:p-0"
              >
                Current Work
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default GigNavbar;
