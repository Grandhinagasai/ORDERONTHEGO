import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX, FiPackage, FiSettings, FiHome, FiGrid } from "react-icons/fi";
import { MdRestaurantMenu } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const [scrolled, setScrolled] = useState(false);
    const [dropdown, setDropdown] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
        setDropdown(false);
    }, [location]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
            <Link to="/" className="nav-brand">
                <MdRestaurantMenu className="brand-icon" />
                <span>NS Foods</span>
            </Link>

            <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <FiX /> : <FiMenu />}
            </button>

            <div className={`nav-links ${mobileOpen ? "open" : ""}`}>
                <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
                    <FiHome /> Home
                </Link>
                <Link to="/products" className={`nav-link ${isActive("/products") ? "active" : ""}`}>
                    <FiGrid /> Menu
                </Link>

                {!user ? (
                    <>
                        <Link to="/login" className={`nav-link ${isActive("/login") ? "active" : ""}`}>
                            Login
                        </Link>
                        <Link to="/register" className="btn btn-primary btn-sm">
                            Sign Up
                        </Link>
                    </>
                ) : (
                    <>
                        {user.userType === "customer" && (
                            <button className="nav-cart" onClick={() => navigate("/cart")}>
                                <FiShoppingCart />
                                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                            </button>
                        )}
                        <div className="nav-user" ref={dropdownRef}>
                            <div className="nav-avatar" onClick={() => setDropdown(!dropdown)}>
                                {user.username?.[0]?.toUpperCase() || "U"}
                            </div>
                            {dropdown && (
                                <div className="nav-dropdown">
                                    <div style={{ padding: "8px 14px", borderBottom: `1px solid var(--border)`, marginBottom: 4 }}>
                                        <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{user.username}</div>
                                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{user.email}</div>
                                    </div>
                                    <button className="nav-dropdown-item" onClick={() => navigate("/profile")}>
                                        <FiUser /> Profile
                                    </button>
                                    {user.userType === "customer" && (
                                        <button className="nav-dropdown-item" onClick={() => navigate("/my-orders")}>
                                            <FiPackage /> My Orders
                                        </button>
                                    )}
                                    {(user.userType === "admin" || user.userType === "restaurant") && (
                                        <button className="nav-dropdown-item" onClick={() => navigate(user.userType === "admin" ? "/admin" : "/restaurant")}>
                                            <FiSettings /> Dashboard
                                        </button>
                                    )}
                                    <div className="nav-dropdown-divider" />
                                    <button className="nav-dropdown-item danger" onClick={handleLogout}>
                                        <FiLogOut /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
