import { useState, useEffect } from "react";
import { FiPackage, FiUsers, FiShoppingBag, FiDollarSign, FiPlusCircle, FiTrash2, FiCheck, FiX, FiEdit2 } from "react-icons/fi";
import { MdRestaurantMenu } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import API from "../utils/api";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

const statusColors = {
    Pending: "#FFB300", Confirmed: "#2196F3", Preparing: "#FF9800",
    "Out for Delivery": "#9C27B0", Delivered: "#00C853", Cancelled: "#FF3D57",
};

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [orders, setOrders] = useState([]);
    const [foods, setFoods] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState("overview");
    const [showAdd, setShowAdd] = useState(false);
    const [editingFood, setEditingFood] = useState(null);
    const [newFood, setNewFood] = useState({
        title: "", description: "", mainImg: "", menuType: "veg",
        category: "Main Course", price: "", discount: "0",
    });
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState("");

    const isAdmin = user?.userType === "admin";
    const isApproved = user?.approval;

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (isAdmin) {
                    const [statsRes, ordersRes, foodsRes, restRes, usersRes] = await Promise.all([
                        API.get("/admin/stats"),
                        API.get("/admin/orders"),
                        API.get("/foods"),
                        API.get("/restaurants"),
                        API.get("/admin/users"),
                    ]);
                    setStats(statsRes.data);
                    setOrders(ordersRes.data);
                    setFoods(foodsRes.data);
                    setRestaurants(restRes.data);
                    setUsers(usersRes.data);
                } else {
                    const [foodsRes, restRes] = await Promise.all([
                        API.get("/foods"),
                        API.get("/restaurants"),
                    ]);
                    const myRests = restRes.data.filter(r => r.ownerId === user._id);
                    setRestaurants(myRests);
                    if (myRests.length > 0) {
                        setSelectedRestaurant(myRests[0]._id);
                        setFoods(foodsRes.data.filter(f => {
                            const rid = f.restaurant?._id || f.restaurant;
                            return myRests.some(r => r._id === rid);
                        }));
                    }
                    try {
                        const ordersRes = await API.get("/orders/my-orders");
                        setOrders(ordersRes.data);
                    } catch { }
                }
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [isAdmin, user]);

    const handleAddFood = async (e) => {
        e.preventDefault();
        try {
            const rest = selectedRestaurant || restaurants[0]?._id;
            if (!rest) {
                toast.error("No restaurant selected");
                return;
            }
            await API.post("/foods", {
                ...newFood,
                price: Number(newFood.price),
                discount: Number(newFood.discount || 0),
                restaurant: rest,
            });
            toast.success("Food item added!");
            setShowAdd(false);
            setNewFood({ title: "", description: "", mainImg: "", menuType: "veg", category: "Main Course", price: "", discount: "0" });
            const { data } = await API.get("/foods");
            if (isAdmin) {
                setFoods(data);
            } else {
                setFoods(data.filter(f => {
                    const rid = f.restaurant?._id || f.restaurant;
                    return restaurants.some(r => r._id === rid);
                }));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add food");
        }
    };

    const handleEditFood = async (e) => {
        e.preventDefault();
        try {
            await API.put(`/foods/${editingFood._id}`, {
                title: editingFood.title,
                description: editingFood.description,
                mainImg: editingFood.mainImg,
                menuType: editingFood.menuType,
                category: editingFood.category,
                price: Number(editingFood.price),
                discount: Number(editingFood.discount || 0),
            });
            toast.success("Food item updated!");
            setEditingFood(null);
            const { data } = await API.get("/foods");
            if (isAdmin) {
                setFoods(data);
            } else {
                setFoods(data.filter(f => {
                    const rid = f.restaurant?._id || f.restaurant;
                    return restaurants.some(r => r._id === rid);
                }));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update food");
        }
    };

    const handleDeleteFood = async (id) => {
        try {
            await API.delete(`/foods/${id}`);
            setFoods(foods.filter(f => f._id !== id));
            toast.success("Food item deleted");
        } catch {
            toast.error("Failed to delete");
        }
    };

    const handleUpdateStatus = async (orderId, status) => {
        try {
            await API.put(`/orders/${orderId}/status`, { status });
            setOrders(orders.map(o => o._id === orderId ? { ...o, status } : o));
            toast.success(`Order ${status}`);
        } catch {
            toast.error("Failed to update status");
        }
    };

    const handleApproval = async (userId, approval) => {
        try {
            await API.put(`/admin/users/${userId}/approval`, { approval });
            setUsers(users.map(u => u._id === userId ? { ...u, approval } : u));
            toast.success(`User ${approval ? "approved" : "rejected"} successfully`);
        } catch {
            toast.error("Failed to update approval");
        }
    };

    if (loading) return <Loader />;

    const statCards = isAdmin && stats ? [
        { label: "Total Users", value: stats.totalUsers, icon: <FiUsers />, color: "#2196F3" },
        { label: "Total Orders", value: stats.totalOrders, icon: <FiPackage />, color: "#FF9800" },
        { label: "Products", value: stats.totalProducts, icon: <FiShoppingBag />, color: "#9C27B0" },
        { label: "Revenue", value: `₹${stats.totalRevenue?.toLocaleString() || 0}`, icon: <FiDollarSign />, color: "#00C853" },
    ] : [];

    const tabs = isAdmin
        ? [{ key: "overview", label: "Overview" }, { key: "users", label: "Users" }, { key: "orders", label: "Orders" }, { key: "products", label: "Products" }]
        : [{ key: "products", label: "My Products" }, { key: "orders", label: "Orders" }];

    const pendingRestaurants = users.filter(u => u.userType === "restaurant" && !u.approval);

    const inputStyle = { padding: "12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: "var(--radius)", color: "var(--text-primary)" };

    const foodForm = (food, setFood, onSubmit, buttonText) => (
        <form onSubmit={onSubmit} style={{
            background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)",
            padding: 28, marginBottom: 24, display: "flex", flexDirection: "column", gap: 14
        }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div className="form-group">
                    <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Title</label>
                    <input className="input-field" value={food.title} onChange={(e) => setFood({ ...food, title: e.target.value })} required />
                </div>
                <div className="form-group">
                    <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Image URL</label>
                    <input className="input-field" value={food.mainImg} onChange={(e) => setFood({ ...food, mainImg: e.target.value })} />
                </div>
                <div className="form-group">
                    <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Price (₹)</label>
                    <input className="input-field" type="number" value={food.price} onChange={(e) => setFood({ ...food, price: e.target.value })} required />
                </div>
                <div className="form-group">
                    <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Discount (%)</label>
                    <input className="input-field" type="number" value={food.discount} onChange={(e) => setFood({ ...food, discount: e.target.value })} />
                </div>
                <div className="form-group">
                    <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Category</label>
                    <select value={food.category} onChange={(e) => setFood({ ...food, category: e.target.value })} style={inputStyle}>
                        {["Soups", "Breads", "Main Course", "Desserts", "Beverages", "Snacks", "Salads", "Biryani", "Pizza", "Burgers"].map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Type</label>
                    <select value={food.menuType} onChange={(e) => setFood({ ...food, menuType: e.target.value })} style={inputStyle}>
                        <option value="veg">Veg</option>
                        <option value="non-veg">Non-Veg</option>
                        <option value="vegan">Vegan</option>
                    </select>
                </div>
            </div>
            <div className="form-group">
                <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Description</label>
                <input className="input-field" value={food.description} onChange={(e) => setFood({ ...food, description: e.target.value })} />
            </div>
            {!editingFood && restaurants.length > 0 && (
                <div className="form-group">
                    <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Restaurant</label>
                    <select value={selectedRestaurant} onChange={(e) => setSelectedRestaurant(e.target.value)} style={inputStyle}>
                        {restaurants.map(r => <option key={r._id} value={r._id}>{r.title}</option>)}
                    </select>
                </div>
            )}
            <div style={{ display: "flex", gap: 12 }}>
                <button type="submit" className="btn btn-primary">{buttonText}</button>
                {editingFood && (
                    <button type="button" className="btn btn-secondary" onClick={() => setEditingFood(null)}>Cancel</button>
                )}
            </div>
        </form>
    );

    return (
        <div className="page-enter" style={{ padding: "100px 0 60px" }}>
            <div className="container">
                <h1 style={{ fontSize: "2rem", marginBottom: 8 }}>
                    <MdRestaurantMenu style={{ verticalAlign: "middle", color: "var(--primary)" }} />{" "}
                    {isAdmin ? "Admin" : "Restaurant"} Dashboard
                </h1>

                {!isAdmin && !isApproved && (
                    <div style={{
                        background: "rgba(255,179,0,0.12)", border: "1px solid rgba(255,179,0,0.3)",
                        borderRadius: "var(--radius-lg)", padding: "20px 24px", marginBottom: 24,
                        display: "flex", alignItems: "center", gap: 12, color: "#FFB300"
                    }}>
                        <span style={{ fontSize: "1.4rem" }}>⏳</span>
                        <div>
                            <div style={{ fontWeight: 600, marginBottom: 2 }}>Pending Approval</div>
                            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                                Your restaurant account is awaiting admin approval. You cannot add or edit food items until approved.
                            </div>
                        </div>
                    </div>
                )}

                {isAdmin && pendingRestaurants.length > 0 && (
                    <div style={{
                        background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.2)",
                        borderRadius: "var(--radius-lg)", padding: "14px 20px", marginBottom: 24,
                        display: "flex", alignItems: "center", gap: 10, color: "var(--primary)", fontSize: "0.9rem"
                    }}>
                        <span style={{ fontWeight: 600 }}>🔔 {pendingRestaurants.length} restaurant(s)</span> pending approval
                        <button className="btn btn-outline btn-sm" style={{ marginLeft: "auto" }} onClick={() => setTab("users")}>
                            Review
                        </button>
                    </div>
                )}

                <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
                    {tabs.map(t => (
                        <button key={t.key} onClick={() => setTab(t.key)}
                            style={{
                                padding: "10px 24px", borderRadius: "var(--radius-full)", fontWeight: 600, fontSize: "0.9rem",
                                background: tab === t.key ? "var(--primary)" : "var(--bg-card)",
                                color: tab === t.key ? "white" : "var(--text-secondary)",
                                border: `1px solid ${tab === t.key ? "var(--primary)" : "var(--border)"}`,
                                cursor: "pointer", transition: "var(--transition)",
                            }}
                        >{t.label}
                            {t.key === "users" && pendingRestaurants.length > 0 && (
                                <span style={{
                                    marginLeft: 8, background: "var(--danger)", color: "white", borderRadius: "50%",
                                    display: "inline-flex", alignItems: "center", justifyContent: "center", width: 20, height: 20,
                                    fontSize: "0.7rem", fontWeight: 700
                                }}>{pendingRestaurants.length}</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* ADMIN OVERVIEW TAB */}
                {tab === "overview" && isAdmin && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 32 }}>
                        {statCards.map((s, i) => (
                            <div key={i} style={{
                                background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)",
                                padding: 24, display: "flex", alignItems: "center", gap: 16
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
                )}

                {/* ADMIN USERS TAB */}
                {tab === "users" && isAdmin && (
                    <div>
                        <h3 style={{ fontSize: "1.15rem", marginBottom: 16, color: "var(--text-secondary)" }}>
                            All Users ({users.length})
                        </h3>

                        <div style={{
                            background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)",
                            overflow: "hidden"
                        }}>
                            <div style={{
                                display: "grid", gridTemplateColumns: "1fr 1.2fr 100px 100px 120px",
                                padding: "12px 20px", background: "rgba(255,255,255,0.03)", fontWeight: 600, fontSize: "0.8rem",
                                color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5
                            }}>
                                <span>Username</span>
                                <span>Email</span>
                                <span>Role</span>
                                <span>Status</span>
                                <span>Actions</span>
                            </div>
                            {users.map(u => (
                                <div key={u._id} style={{
                                    display: "grid", gridTemplateColumns: "1fr 1.2fr 100px 100px 120px",
                                    padding: "14px 20px", borderTop: "1px solid var(--border)", alignItems: "center",
                                    fontSize: "0.9rem"
                                }}>
                                    <span style={{ fontWeight: 500 }}>{u.username}</span>
                                    <span style={{ color: "var(--text-secondary)" }}>{u.email}</span>
                                    <span>
                                        <span style={{
                                            padding: "3px 10px", borderRadius: "var(--radius-full)", fontSize: "0.75rem", fontWeight: 600,
                                            background: u.userType === "admin" ? "rgba(33,150,243,0.15)" :
                                                u.userType === "restaurant" ? "rgba(255,152,0,0.15)" : "rgba(0,200,83,0.15)",
                                            color: u.userType === "admin" ? "#2196F3" :
                                                u.userType === "restaurant" ? "#FF9800" : "#00C853"
                                        }}>{u.userType}</span>
                                    </span>
                                    <span>
                                        <span style={{
                                            padding: "3px 10px", borderRadius: "var(--radius-full)", fontSize: "0.75rem", fontWeight: 600,
                                            background: u.approval ? "rgba(0,200,83,0.15)" : "rgba(255,61,87,0.15)",
                                            color: u.approval ? "#00C853" : "#FF3D57"
                                        }}>{u.approval ? "Approved" : "Pending"}</span>
                                    </span>
                                    <span>
                                        {u.userType === "restaurant" && (
                                            <div style={{ display: "flex", gap: 6 }}>
                                                {!u.approval ? (
                                                    <button onClick={() => handleApproval(u._id, true)} title="Approve"
                                                        style={{
                                                            background: "rgba(0,200,83,0.15)", color: "#00C853", border: "none",
                                                            padding: "6px 10px", borderRadius: "var(--radius)", cursor: "pointer", fontSize: "0.85rem",
                                                            display: "flex", alignItems: "center", gap: 4
                                                        }}><FiCheck /> Approve</button>
                                                ) : (
                                                    <button onClick={() => handleApproval(u._id, false)} title="Revoke"
                                                        style={{
                                                            background: "rgba(255,61,87,0.1)", color: "#FF3D57", border: "none",
                                                            padding: "6px 10px", borderRadius: "var(--radius)", cursor: "pointer", fontSize: "0.85rem",
                                                            display: "flex", alignItems: "center", gap: 4
                                                        }}><FiX /> Revoke</button>
                                                )}
                                            </div>
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ORDERS TAB */}
                {tab === "orders" && (
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
                                    {isAdmin ? (
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
                                    ) : (
                                        <span style={{
                                            padding: "4px 14px", borderRadius: "var(--radius-full)", fontSize: "0.8rem", fontWeight: 600,
                                            background: `${statusColors[order.status]}22`,
                                            color: statusColors[order.status]
                                        }}>{order.status}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* PRODUCTS TAB */}
                {tab === "products" && (
                    <div>
                        {(isAdmin || isApproved) && (
                            <button className="btn btn-primary" style={{ marginBottom: 20 }} onClick={() => { setShowAdd(!showAdd); setEditingFood(null); }}>
                                <FiPlusCircle /> {showAdd ? "Cancel" : "Add New Item"}
                            </button>
                        )}

                        {showAdd && !editingFood && foodForm(newFood, setNewFood, handleAddFood, "Add Food Item")}

                        {editingFood && foodForm(editingFood, setEditingFood, handleEditFood, "Save Changes")}

                        {foods.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
                                <div style={{ fontSize: "3rem", marginBottom: 12, opacity: 0.3 }}>🍽️</div>
                                <h3>No food items yet</h3>
                                <p>Start adding food items to your menu</p>
                            </div>
                        ) : (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                                {foods.map(food => (
                                    <div key={food._id} style={{
                                        background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)",
                                        overflow: "hidden", transition: "var(--transition)"
                                    }}>
                                        {food.mainImg && <img src={food.mainImg} alt={food.title} style={{ width: "100%", height: 160, objectFit: "cover" }} />}
                                        <div style={{ padding: 16 }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                                                <div>
                                                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{food.title}</div>
                                                    <span style={{ color: "var(--primary)", fontWeight: 700 }}>₹{food.price}</span>
                                                    {food.discount > 0 && <span style={{ marginLeft: 8, fontSize: "0.8rem", color: "var(--success)" }}>{food.discount}% off</span>}
                                                </div>
                                                {(isAdmin || isApproved) && (
                                                    <div style={{ display: "flex", gap: 6 }}>
                                                        <button onClick={() => { setEditingFood({ ...food }); setShowAdd(false); }} style={{
                                                            background: "rgba(33,150,243,0.1)", color: "#2196F3", border: "none", padding: 8,
                                                            borderRadius: "var(--radius)", cursor: "pointer", fontSize: "0.9rem"
                                                        }}><FiEdit2 /></button>
                                                        <button onClick={() => handleDeleteFood(food._id)} style={{
                                                            background: "rgba(255,61,87,0.1)", color: "var(--danger)", border: "none", padding: 8,
                                                            borderRadius: "var(--radius)", cursor: "pointer", fontSize: "0.9rem"
                                                        }}><FiTrash2 /></button>
                                                    </div>
                                                )}
                                            </div>
                                            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 6 }}>
                                                {food.category} · {food.menuType}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
