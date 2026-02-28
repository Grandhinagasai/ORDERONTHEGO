import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCreditCard } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import API from "../utils/api";
import toast from "react-hot-toast";
import "../styles/Checkout.css";

const Checkout = () => {
    const { cartItems, cartTotal } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: user?.username || "",
        email: user?.email || "",
        mobile: "",
        address: "",
        pincode: "",
        paymentMethod: "COD",
    });
    const [loading, setLoading] = useState(false);

    if (cartItems.length === 0) {
        navigate("/cart");
        return null;
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const deliveryFee = 40;
    const totalAmount = cartTotal + deliveryFee;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.mobile || !form.address || !form.pincode) {
            toast.error("Please fill in all required fields");
            return;
        }
        setLoading(true);
        try {
            const { data } = await API.post("/orders/place", {
                name: form.name,
                email: form.email,
                mobile: form.mobile,
                address: form.address,
                pincode: form.pincode,
                paymentMethod: form.paymentMethod,
                items: cartItems,
            });
            toast.success("Order placed successfully!");
            navigate("/order-confirmation", { state: { orders: data.orders } });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to place order");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-page container page-enter">
            <h1><FiCreditCard style={{ verticalAlign: "middle", color: "var(--primary)" }} /> Checkout</h1>

            <form onSubmit={handleSubmit}>
                <div className="checkout-layout">
                    <div>
                        <div className="checkout-form-card" style={{ marginBottom: 24 }}>
                            <h3>Delivery Details</h3>
                            <div className="checkout-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Full Name *</label>
                                        <input className="input-field" name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
                                    </div>
                                    <div className="form-group">
                                        <label>Mobile Number *</label>
                                        <input className="input-field" name="mobile" value={form.mobile} onChange={handleChange} placeholder="10-digit mobile" required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input className="input-field" name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email address" />
                                </div>
                                <div className="form-group">
                                    <label>Delivery Address *</label>
                                    <input className="input-field" name="address" value={form.address} onChange={handleChange} placeholder="Full delivery address" required />
                                </div>
                                <div className="form-group">
                                    <label>Pincode *</label>
                                    <input className="input-field" name="pincode" value={form.pincode} onChange={handleChange} placeholder="Pincode" required />
                                </div>
                            </div>
                        </div>

                        <div className="checkout-form-card">
                            <h3>Payment Method</h3>
                            <div className="payment-options">
                                {[
                                    { key: "COD", label: "Cash on Delivery", icon: "💵" },
                                    { key: "UPI", label: "UPI", icon: "📱" },
                                    { key: "Card", label: "Credit/Debit Card", icon: "💳" },
                                ].map((opt) => (
                                    <div
                                        key={opt.key}
                                        className={`payment-option ${form.paymentMethod === opt.key ? "selected" : ""}`}
                                        onClick={() => setForm({ ...form, paymentMethod: opt.key })}
                                    >
                                        <div className="icon">{opt.icon}</div>
                                        {opt.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="checkout-order-summary">
                        <h3>Order Summary</h3>
                        {cartItems.map((item) => {
                            const dp = item.price - (item.price * (item.discount || 0)) / 100;
                            return (
                                <div key={item._id} className="checkout-item">
                                    <div className="name">
                                        <span>{item.foodItemName}</span>
                                        <span className="qty">×{item.quantity}</span>
                                    </div>
                                    <span>₹{Math.round(dp * item.quantity)}</span>
                                </div>
                            );
                        })}
                        <div style={{ borderTop: "1px solid var(--border)", marginTop: 12, paddingTop: 12 }}>
                            <div className="checkout-item"><span>Subtotal</span><span>₹{Math.round(cartTotal)}</span></div>
                            <div className="checkout-item"><span>Delivery Fee</span><span>₹{deliveryFee}</span></div>
                            <div className="checkout-item" style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--text-primary)", marginTop: 8 }}>
                                <span>Total</span><span>₹{Math.round(totalAmount)}</span>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: 20 }} disabled={loading}>
                            {loading ? "Placing Order..." : "Place Order"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Checkout;
