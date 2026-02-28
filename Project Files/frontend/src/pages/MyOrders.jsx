import { useState, useEffect } from "react";
import { FiPackage, FiClock } from "react-icons/fi";
import API from "../utils/api";
import Loader from "../components/Loader";

const statusColors = {
    Pending: "#FFB300",
    Confirmed: "#2196F3",
    Preparing: "#FF9800",
    "Out for Delivery": "#9C27B0",
    Delivered: "#00C853",
    Cancelled: "#FF3D57",
};

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await API.get("/orders/my-orders");
                setOrders(data);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <Loader />;

    return (
        <div className="page-enter" style={{ padding: "100px 0 60px" }}>
            <div className="container">
                <h1 style={{ fontSize: "2rem", marginBottom: 24 }}>
                    <FiPackage style={{ verticalAlign: "middle", color: "var(--primary)" }} /> My Orders
                </h1>

                {orders.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}>
                        <h3>No orders yet</h3>
                        <p>Start ordering delicious food!</p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                style={{
                                    background: "var(--bg-card)",
                                    border: "1px solid var(--border)",
                                    borderRadius: "var(--radius-lg)",
                                    padding: 20,
                                    display: "flex",
                                    gap: 16,
                                    alignItems: "center",
                                    transition: "var(--transition)",
                                }}
                            >
                                {order.image && (
                                    <img
                                        src={order.image}
                                        alt={order.title}
                                        style={{
                                            width: 80,
                                            height: 80,
                                            objectFit: "cover",
                                            borderRadius: "var(--radius)",
                                            flexShrink: 0,
                                        }}
                                    />
                                )}
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{order.title}</div>
                                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                                        <FiClock /> {new Date(order.orderDate).toLocaleDateString("en-IN", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </div>
                                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 2 }}>
                                        Qty: {order.quantity} · {order.paymentMethod}
                                    </div>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <div style={{ fontWeight: 700, color: "var(--primary)", fontSize: "1.1rem" }}>
                                        ₹{Math.round(order.price * order.quantity)}
                                    </div>
                                    <span
                                        style={{
                                            display: "inline-block",
                                            marginTop: 6,
                                            padding: "4px 12px",
                                            borderRadius: "var(--radius-full)",
                                            fontSize: "0.75rem",
                                            fontWeight: 600,
                                            background: `${statusColors[order.status]}22`,
                                            color: statusColors[order.status],
                                        }}
                                    >
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
