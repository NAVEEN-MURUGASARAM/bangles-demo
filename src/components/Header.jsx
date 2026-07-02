import React, { useState, useCallback, useMemo, useRef ,useEffect} from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes, FaUser, FaSignInAlt, FaShoppingCart, FaSignOutAlt, FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";

// Static navigation items
const staticNavItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

// Dropdown items
const dropdownItems = {
  Collections: [
    { to: "/collections/bridal", label: "Bridal Collection" },
    { to: "/collections/festive", label: "Festive Collection" },
    { to: "/collections/daily", label: "Daily Wear" },
  ],
  Categories: [
    { to: "/categories/kada", label: "Kada Bangles" },
    { to: "/categories/glass", label: "Glass Bangles" },
    { to: "/categories/gold-plated", label: "Gold-Plated" },
    { to: "/categories/stone-studded", label: "Stone-Studded" },
  ],
};

// Dropdown component for reusability
const DropdownMenu = ({ title, items, isMobile, onItemClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = useCallback(() => setIsOpen((prev) => !prev), []);
  const dropdownRef = useRef(null);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    }
  }, []);

  return (
    <div className={isMobile ? "w-full" : "relative group"} ref={dropdownRef}>
      <button
        className={`flex items-center gap-2 text-gray-600 hover:text-maroon-800 focus:text-maroon-800 transition-colors duration-200 text-base font-medium focus:outline-none focus:ring-2 focus:ring-gold-500 rounded-md p-1 ${
          isMobile ? "w-full justify-between" : ""
        }`}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-controls={`${title}-dropdown`}
        aria-label={`Toggle ${title} dropdown`}
      >
        {title}
        <FaChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            id={`${title}-dropdown`}
            initial={{ opacity: 0, scaleY: 0.95, y: -10 }}
            animate={{ opacity: 1, scaleY: 1, y: 0 }}
            exit={{ opacity: 0, scaleY: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`${
              isMobile
                ? "pl-4 space-y-2 mt-2"
                : "absolute left-0 mt-2 bg-white shadow-xl rounded-xl w-48"
            }`}
            role="menu"
          >
            {items.map((item) => (
              <li key={item.to} role="menuitem">
                <NavLink
                  to={item.to}
                  className="block px-5 py-2.5 text-gray-700 hover:text-maroon-800 hover:bg-gold-100 focus:bg-gold-100 text-sm font-medium transition-colors duration-200"
                  onClick={() => {
                    onItemClick();
                    setIsOpen(false);
                  }}
                  aria-label={item.label}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

// Memoize component to prevent unnecessary re-renders
const Header = React.memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { cart } = useCart();
  const { user, logout } = useUser() || { user: null, logout: () => {} }; // Fallback for undefined useUser
  const userDropdownRef = useRef(null);

  // Memoized toggle functions
  const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), []);
  const toggleUserDropdown = useCallback(() => setIsUserDropdownOpen((prev) => !prev), []);

  // Memoized action items
  const actionItems = useMemo(
    () =>
      user
        ? [{ to: "/logout", label: "Logout", icon: <FaSignOutAlt className="mr-2" />, action: logout }]
        : [
            { to: "/login", label: "Login", icon: <FaSignInAlt className="mr-2" /> },
            { to: "/register", label: "Register", icon: <FaUser className="mr-2" /> },
          ],
    [user, logout]
  );

  // Handle keyboard navigation for user dropdown
  const handleUserKeyDown = useCallback((e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsUserDropdownOpen((prev) => !prev);
    }
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-бли8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <NavLink
            to="/"
            className="flex items-center gap-2 sm:gap-3 font-bold text-xl sm:text-2xl text-gray-800 hover:text-gold-600 transition-colors duration-200 font-serif"
            aria-label="Sparkle Bangles Home"
          >
            <img src="/logo.png" alt="Sparkle Bangles Logo" className="h-14 w-14 sm:h-20 sm:w-20 rounded-full object-cover shadow-md border border-gold-300 transition-all duration-300" />
            <span className="tracking-wide text-lg sm:text-2xl">Sparkle Bangles</span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-x-6 items-center" aria-label="Main navigation">
            {staticNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-gray-600 hover:text-maroon-800 focus:text-maroon-800 transition-colors duration-200 text-base font-medium ${
                    isActive ? "text-maroon-800 border-b-2 border-maroon-800" : ""
                  }`
                }
                aria-label={item.label}
              >
                {item.label}
              </NavLink>
            ))}
            {Object.entries(dropdownItems).map(([title, items]) => (
              <DropdownMenu
                key={title}
                title={title}
                items={items}
                isMobile={false}
                onItemClick={() => {}}
              />
            ))}
            <div className="relative" ref={userDropdownRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-gray-600 hover:text-maroon-800 focus:text-maroon-800 transition-colors duration-200 text-base font-medium focus:outline-none focus:ring-2 focus:ring-gold-500 rounded-md p-1"
                onClick={toggleUserDropdown}
                onKeyDown={handleUserKeyDown}
                aria-haspopup="true"
                aria-expanded={isUserDropdownOpen}
                aria-controls="user-dropdown"
              >
                <FaUser className="w-5 h-5" />
                <span className="hidden lg:inline">{user ? user.name || "User" : "Account"}</span>
                <FaChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isUserDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </motion.button>
              <AnimatePresence>
                {isUserDropdownOpen && (
                  <motion.ul
                    id="user-dropdown"
                    initial={{ opacity: 0, scaleY: 0.95, y: -10 }}
                    animate={{ opacity: 1, scaleY: 1, y: 0 }}
                    exit={{ opacity: 0, scaleY: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-xl"
                    role="menu"
                  >
                    {actionItems.map((item) => (
                      <li key={item.to} role="menuitem" className="hover:bg-gold-100">
                        {item.action ? (
                          <button
                            onClick={() => {
                              item.action();
                              setIsUserDropdownOpen(false);
                            }}
                            className="block w-full text-left px-5 py-2.5 text-gray-700 hover:text-maroon-800 focus:bg-gold-100 text-sm font-medium transition-colors duration-200"
                            aria-label={item.label}
                          >
                            {item.icon}
                            {item.label}
                          </button>
                        ) : (
                          <NavLink
                            to={item.to}
                            className="block px-5 py-2.5 text-gray-700 hover:text-maroon-800 hover:bg-gold-100 focus:bg-gold-100 text-sm font-medium transition-colors duration-200"
                            onClick={() => setIsUserDropdownOpen(false)}
                            aria-label={item.label}
                          >
                            {item.icon}
                            {item.label}
                          </NavLink>
                        )}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
            <NavLink
              to="/cart"
              className="relative flex items-center gap-1 text-gray-600 hover:text-maroon-800 focus:text-maroon-800 transition-colors duration-200 text-base font-medium"
              aria-label={`Cart with ${cart.length} items`}
            >
              <FaShoppingCart className="w-5 h-5" />
              <span>Cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-maroon-800 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </NavLink>
          </nav>

          {/* Mobile Menu Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMenu}
            className="md:hidden text-2xl text-gray-600 hover:text-maroon-800 focus:outline-none focus:ring-2 focus:ring-gold-500 rounded-md p-1"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden bg-white border-t border-gray-200 py-4 overflow-hidden"
              aria-label="Mobile navigation"
            >
              <ul className="flex flex-col gap-y-3 px-4">
                {staticNavItems.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `block text-gray-600 hover:text-maroon-800 focus:text-maroon-800 transition-colors duration-200 text-base font-medium ${
                          isActive ? "text-maroon-800 border-l-4 border-maroon-800 pl-2" : ""
                        }`
                      }
                      onClick={() => setIsMenuOpen(false)}
                      aria-label={item.label}
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
                {Object.entries(dropdownItems).map(([title, items]) => (
                  <li key={title}>
                    <DropdownMenu
                      title={title}
                      items={items}
                      isMobile={true}
                      onItemClick={() => setIsMenuOpen(false)}
                    />
                  </li>
                ))}
                <li>
                  <div className="flex items-center gap-2 text-gray-600 text-base font-medium">
                    <FaUser className="w-5 h-5" />
                    <span>{user ? user.name || "User" : "Account"}</span>
                  </div>
                </li>
                {actionItems.map((item) => (
                  <li key={item.to}>
                    {item.action ? (
                      <button
                        onClick={() => {
                          item.action();
                          setIsMenuOpen(false);
                        }}
                        className="block w-full text-left text-gray-600 hover:text-maroon-800 focus:text-maroon-800 transition-colors duration-200 text-base font-medium pl-7"
                        aria-label={item.label}
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    ) : (
                      <NavLink
                        to={item.to}
                        className="block text-gray-600 hover:text-maroon-800 focus:text-maroon-800 transition-colors duration-200 text-base font-medium pl-7"
                        onClick={() => setIsMenuOpen(false)}
                        aria-label={item.label}
                      >
                        {item.icon}
                        {item.label}
                      </NavLink>
                    )}
                  </li>
                ))}
                <li>
                  <NavLink
                    to="/cart"
                    className="flex items-center gap-1 text-gray-600 hover:text-maroon-800 focus:text-maroon-800 transition-colors duration-200 text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                    aria-label={`Cart with ${cart.length} items`}
                  >
                    <FaShoppingCart className="w-5 h-5" />
                    <span>Cart</span>
                    {cart.length > 0 && (
                      <span className="bg-maroon-800 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-1">
                        {cart.length}
                      </span>
                    )}
                  </NavLink>
                </li>
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
});

export default Header;