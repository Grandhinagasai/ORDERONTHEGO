import { useState, useEffect } from "react";
import { FiPackage, FiUsers, FiShoppingBag, FiDollarSign } from "react-icons/fi";
import { MdRestaurantMenu } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import Loader from "../../components/Loader";

const Admin = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await API.get("/admin/stats");
                setStats(data);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <Loader />;

    const statCards = stats ? [
        { label: "Total Users", value: stats.totalUsers, icon: <FiUsers />, color: "#2196F3", link: "/admin/users" },
        { label: "Total Orders", value: stats.totalOrders, icon: <FiPackage />, color: "#FF9800", link: "/admin/orders" },
        { label: "Products", value: stats.totalProducts, icon: <FiShoppingBag />, color: "#9C27B0", link: "/admin/products" },
        { label: "Revenue", value: `₹${stats.totalRevenue?.toLocaleString() || 0}`, icon: <FiDollarSign />, color: "#00C853", link: "/admin/orders" },
    ] : [];

    const quickLinks = [
        { label: "Manage Users", desc: "Approve restaurants, view user list", path: "/admin/users", icon: <FiUsers /> },
        { label: "Manage Orders", desc: "Track and update order status", path: "/admin/orders", icon: <FiPackage /> },
        { label: "Manage Products", desc: "Add, edit, or remove food items", path: "/admin/products", icon: <FiShoppingBag /> },
        { label: "Restaurants", desc: "View all partner restaurants", path: "/admin/restaurants", icon: <MdRestaurantMenu /> },
    ];

    return (
        <div className="page-enter" style={{ padding: "100px 0 60px" }}>
            <div className="container">
                <h1 style={{ fontSize: "2rem", marginBottom: 8 }}>
                    <MdRestaurantMenu style={{ verticalAlign: "middle", color: "var(--primary)" }} /> Admin Dashboard
                </h1>
                <p style={{ color: "var(--text-muted)", marginBottom: 32 }}>
                    Overview of your food ordering platform
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 40 }}>
                    {statCards.map((s, i) => (
                        <div key={i} onClick={() => navigate(s.link)} style={{
                            background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)",
                            padding: 24, display: "flex", alignItems: "center", gap: 16, cursor: "pointer", transition: "var(--transition)"
                        }}>
                            <div style={{
                                width: 52, height: 52, borderRadius: "var(--radius)", background: `${s.color}22`,
                                color: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem"
                            }}>{s.icon}</div>
                            <div>
                                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{s.label}</div>
                                <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{s.value}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <h3 style={{ fontSize: "1.15rem", marginBottom: 16, color: "var(--text-secondary)" }}>Quick Actions</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
                    {quickLinks.map((item, i) => (
                        <div key={i} onClick={() => navigate(item.path)} style={{
                            background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)",
                            padding: 20, cursor: "pointer", transition: "var(--transition)", display: "flex", alignItems: "center", gap: 14
                        }}>
                            <div style={{
                                width: 44, height: 44, borderRadius: "var(--radius)", background: "rgba(255,107,53,0.12)",
                                color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem"
                            }}>{item.icon}</div>
                            <div>
                                <div style={{ fontWeight: 600 }}>{item.label}</div>
                                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{item.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Admin;
