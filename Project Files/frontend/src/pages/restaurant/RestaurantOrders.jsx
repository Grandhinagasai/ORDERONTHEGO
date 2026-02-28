import { useState, useEffect } from "react";
import { FiPackage } from "react-icons/fi";
import API from "../../utils/api";
import Loader from "../../components/Loader";

const statusColors = {
    Pending: "#FFB300", Confirmed: "#2196F3", Preparing: "#FF9800",
    "Out for Delivery": "#9C27B0", Delivered: "#00C853", Cancelled: "#FF3D57",
};

const RestaurantOrders = () => {
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
                <h1 style={{ fontSize: "2rem", marginBottom: 8 }}>
                    <FiPackage style={{ verticalAlign: "middle", color: "var(--primary)" }} /> Orders
                </h1>
                <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>{orders.length} orders</p>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {orders.length === 0 ? (
                        <p style={{ color: "var(--text-muted)", textAlign: "center", padding: 40 }}>No orders found</p>
                    ) : orders.map(order => (
                        <div key={order._id} style={{
                            background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)",
                            padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12
                        }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, marginBottom: 4 }}>{order.title}</div>
                                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                                    {order.name} · Qty: {order.quantity}
                                </div>
                                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>
                                    {new Date(order.orderDate).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                                </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <span style={{ fontWeight: 700, color: "var(--primary)", fontSize: "1.05rem" }}>₹{order.price * order.quantity}</span>
                                <span style={{
                                    padding: "4px 14px", borderRadius: "var(--radius-full)", fontSize: "0.8rem", fontWeight: 600,
                                    background: `${statusColors[order.status]}22`, color: statusColors[order.status]
                                }}>{order.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RestaurantOrders;
