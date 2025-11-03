import React from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Tools", path: "/tools" },
  ];

  return (
    <div className="bg-transparent p-4 font-sans">
      <header className="w-full max-w-7xl mx-auto bg-white rounded-full py-3 px-6 flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex items-center">
            <Link to="/">
              <div
                style={{
                  color: "#000",
                  fontFamily: "Orbitron",
                  fontSize: "24px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "24px",
                }}
              >
                STORIQ
              </div>
            </Link>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-5 py-2 rounded-full text-base font-semibold transition-colors duration-300 ${
                  location.pathname === link.path
                    ? "bg-black text-white"
                    : "bg-transparent text-black hover:bg-gray-200"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center">
            <Link
              to="/signup"
              className="text-black text-base font-semibold px-5 py-2 rounded-full hover:bg-gray-200 transition-colors duration-300"
            >
              SIGN UP
            </Link>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Header;
