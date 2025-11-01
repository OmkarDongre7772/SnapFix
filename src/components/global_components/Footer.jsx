import React from "react";

const Footer = () => {
  return (
    <footer className="bg-blue-700 text-white shadow-sm mt-8">
      <div className="w-full max-w-7xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          {/* Logo and Brand */}
          <a
            href="#"
            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-8"
              alt="SnapSure Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap">
              SnapSure
            </span>
          </a>

          {/* Footer Links */}
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium sm:mb-0">
            <li>
              <a
                href="#"
                className="hover:underline me-4 md:me-6 text-gray-100 hover:text-gray-200"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:underline me-4 md:me-6 text-gray-100 hover:text-gray-200"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:underline me-4 md:me-6 text-gray-100 hover:text-gray-200"
              >
                Terms
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:underline text-gray-100 hover:text-gray-200"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Divider */}
        <hr className="my-6 border-blue-500 sm:mx-auto lg:my-8" />

        {/* Copyright */}
        <span className="block text-sm text-gray-100 sm:text-center">
          © {new Date().getFullYear()}{" "}
          <a href="#" className="hover:underline text-white font-medium">
            SnapSure™
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
