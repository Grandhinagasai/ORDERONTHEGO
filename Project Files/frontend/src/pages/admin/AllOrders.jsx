import { useState, useEffect } from "react";
import { FiPackage } from "react-icons/fi";
import API from "../../utils/api";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";

const statusColors = {
    Pending: "#FFB300", Confirmed: "#2196F3", Preparing: "#FF9800",
    "Out for Delivery": "#9C27B0", Delivered: "#00C853", Cancelled: "#FF3D57",
};

const AllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await API.get("/admin/orders");
                setOrders(data);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleUpdateStatus = async (orderId, status) => {
        try {
            await API.put(`/orders/${orderId}/status`, { status });
            setOrders(orders.map(o => o._id === orderId ? { ...o, status } : o));
            toast.success(`Order ${status}`);
        } catch {
            toast.error("Failed to update status");
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="page-enter" style={{ padding: "100px 0 60px" }}>
            <div className="container">
                <h1 style={{ fontSize: "2rem", marginBottom: 8 }}>
                    <FiPackage style={{ verticalAlign: "middle", color: "var(--primary)" }} /> All Orders
                </h1>
                <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>{orders.length} orders total</p>

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
                                    {order.name} · {order.address} · Qty: {order.quantity}
                                </div>
                                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>
                                    {new Date(order.orderDate).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                                    {" · "}{order.paymentMethod}
                                </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <span style={{ fontWeight: 700, color: "var(--primary)", fontSize: "1.05rem" }}>₹{order.price * order.quantity}</span>
                                <select
                                    value={order.status}
                                    onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                                    style={{
                                        padding: "6px 12px", borderRadius: "var(--radius)", background: "var(--bg-dark)",
                                        border: "1px solid var(--border)", color: "var(--text-primary)", fontSize: "0.85rem"
                                    }}
                                >
                                    {["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"].map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AllOrders;
