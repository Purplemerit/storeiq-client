import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Tools", path: "/tools" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Handle body scroll lock when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        hamburgerButtonRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !hamburgerButtonRef.current.contains(event.target as Node)
      ) {
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black p-3 md:p-4 font-sans">
      <header className="w-full max-w-7xl mx-auto bg-white rounded-full py-3 px-4 md:px-6 flex items-center justify-between shadow-lg">
        <div className="flex items-center">
          <Link to="/" onClick={closeMobileMenu}>
            <div
              style={{
                color: "#000",
                fontFamily: "Orbitron",
                fontSize: "20px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "24px",
              }}
              className="md:text-2xl"
            >
              STORIQ
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
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

        {/* Mobile Hamburger Menu Button */}
        <button
          ref={hamburgerButtonRef}
          onClick={toggleMobileMenu}
          className="md:hidden p-2 hover:bg-gray-200 rounded-full transition-colors duration-300"
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <X size={24} color="#000" />
          ) : (
            <Menu size={24} color="#000" />
          )}
        </button>
      </header>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden mt-3 bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 border border-gray-100"
        >
          <nav className="flex flex-col p-3">
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={closeMobileMenu}
                className={`px-5 py-3.5 text-base font-semibold rounded-2xl transition-all duration-200 ${
                  location.pathname === link.path
                    ? "bg-black text-white shadow-md"
                    : "text-black hover:bg-gray-100 active:scale-95"
                } ${index !== 0 ? "mt-1.5" : ""}`}
              >
                {link.name}
              </Link>
            ))}
            <div className="border-t border-gray-200 my-3"></div>
            <Link
              to="/signup"
              onClick={closeMobileMenu}
              className="px-5 py-3.5 text-base font-semibold text-white bg-[#8638E5] hover:bg-[#6b2bb8] rounded-2xl transition-all duration-200 active:scale-95 shadow-lg text-center"
            >
              SIGN UP
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Header;
