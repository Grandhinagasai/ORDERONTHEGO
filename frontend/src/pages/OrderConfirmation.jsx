import { useLocation, Link, Navigate } from "react-router-dom";
import { FiCheckCircle, FiPackage } from "react-icons/fi";

const OrderConfirmation = () => {
    const location = useLocation();
    const orders = location.state?.orders;

    if (!orders) return <Navigate to="/" />;

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 24px 40px" }}>
            <div className="page-enter" style={{ textAlign: "center", maxWidth: 600 }}>
                <div style={{ fontSize: "5rem", color: "var(--success)", marginBottom: 16, animation: "scaleIn 0.5s ease" }}>
                    <FiCheckCircle />
                </div>
                <h1 style={{ fontSize: "2rem", marginBottom: 8 }}>Order Confirmed!</h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", marginBottom: 32 }}>
                    Your order has been placed successfully. You'll receive a notification with the estimated delivery time.
                </p>

                <div style={{
                    background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)",
                    padding: 24, textAlign: "left", marginBottom: 24
                }}>
                    <h3 style={{ marginBottom: 16, fontSize: "1.1rem" }}>Order Details</h3>
                    {orders.map((order, i) => (
                        <div key={i} style={{
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            padding: "10px 0", borderBottom: i < orders.length - 1 ? "1px solid var(--border)" : "none"
                        }}>
                            <div>
                                <div style={{ fontWeight: 600 }}>{order.title}</div>
                                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Qty: {order.quantity}</div>
                            </div>
                            <span style={{ fontWeight: 600, color: "var(--primary)" }}>₹{Math.round(order.price * order.quantity)}</span>
                        </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, paddingTop: 12, borderTop: "1px solid var(--border)", fontWeight: 700, fontSize: "1.1rem" }}>
                        <span>Total</span>
                        <span style={{ color: "var(--primary)" }}>
                            ₹{Math.round(orders.reduce((s, o) => s + o.price * o.quantity, 0))}
                        </span>
                    </div>
                </div>

                <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                    <Link to="/my-orders" className="btn btn-primary">
                        <FiPackage /> View My Orders
                    </Link>
                    <Link to="/products" className="btn btn-secondary">
                        Continue Browsing
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
