import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import Loader from "../../components/Loader";
import "../../styles/Cart.css";

const Cart = () => {
    const { user } = useAuth();
    const { cart, loading, updateQuantity, removeFromCart, getCartTotal } = useCart();
    const navigate = useNavigate();

    if (loading) return <Loader />;

    if (!cart || cart.length === 0) {
        return (
            <div className="page-enter" style={{ padding: "100px 0 60px" }}>
                <div className="container" style={{ textAlign: "center", padding: "80px 20px" }}>
                    <FiShoppingBag style={{ fontSize: "4rem", color: "var(--text-muted)", marginBottom: 16 }} />
                    <h2>Your cart is empty</h2>
                    <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>Looks like you haven't added anything yet</p>
                    <Link to="/products" className="btn btn-primary">Browse Products</Link>
                </div>
            </div>
        );
    }

    const total = getCartTotal();
    const deliveryFee = total > 499 ? 0 : 40;
    const grandTotal = total + deliveryFee;

    return (
        <div className="page-enter" style={{ padding: "100px 0 60px" }}>
            <div className="container">
                <h1 style={{ fontSize: "2rem", marginBottom: 28 }}>
                    <FiShoppingBag style={{ verticalAlign: "middle", color: "var(--primary)" }} /> Shopping Cart
                </h1>

                <div className="cart-layout">
                    <div className="cart-items">
                        {cart.map(item => (
                            <div key={item._id} className="cart-item">
                                {item.foodId?.mainImg && (
                                    <img src={item.foodId.mainImg} alt={item.foodId?.title} className="cart-item-img" />
                                )}
                                <div className="cart-item-info">
                                    <h3>{item.foodId?.title}</h3>
                                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                                        {item.foodId?.category}
                                    </p>
                                    <span className="cart-item-price">₹{item.foodId?.price}</span>
                                </div>
                                <div className="cart-item-actions">
                                    <div className="qty-control">
                                        <button onClick={() => updateQuantity(item._id, item.quantity - 1)} disabled={item.quantity <= 1}>
                                            <FiMinus />
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                                            <FiPlus />
                                        </button>
                                    </div>
                                    <div style={{ fontWeight: 700, color: "var(--primary)" }}>
                                        ₹{(item.foodId?.price || 0) * item.quantity}
                                    </div>
                                    <button className="remove-btn" onClick={() => removeFromCart(item._id)}>
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h3>Order Summary</h3>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>₹{total}</span>
                        </div>
                        <div className="summary-row">
                            <span>Delivery Fee</span>
                            <span>{deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}</span>
                        </div>
                        {deliveryFee > 0 && (
                            <p style={{ fontSize: "0.75rem", color: "var(--success)", marginBottom: 12 }}>
                                Add ₹{500 - total} more for free delivery
                            </p>
                        )}
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>₹{grandTotal}</span>
                        </div>
                        <button className="btn btn-primary" style={{ width: "100%", marginTop: 16 }}
                            onClick={() => navigate("/checkout")}>
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
