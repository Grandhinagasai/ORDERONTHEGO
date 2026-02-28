import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdRestaurantMenu } from "react-icons/md";
import { FiPackage, FiShoppingBag, FiPlusCircle } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import API from "../../utils/api";
import Loader from "../../components/Loader";

const RestaurantHome = () => {
    const { user } = useAuth();
    const [restaurants, setRestaurants] = useState([]);
    const [foodCount, setFoodCount] = useState(0);
    const [orderCount, setOrderCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const isApproved = user?.approval;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [restRes, foodsRes] = await Promise.all([
                    API.get("/restaurants"),
                    API.get("/foods"),
                ]);
                const myRests = restRes.data.filter(r => r.ownerId === user._id);
                setRestaurants(myRests);
                const myFoods = foodsRes.data.filter(f => {
                    const rid = f.restaurant?._id || f.restaurant;
                    return myRests.some(r => r._id === rid);
                });
                setFoodCount(myFoods.length);
                try {
                    const ordersRes = await API.get("/orders/my-orders");
                    setOrderCount(ordersRes.data.length);
                } catch { }
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    if (loading) return <Loader />;

    return (
        <div className="page-enter" style={{ padding: "100px 0 60px" }}>
            <div className="container">
                <h1 style={{ fontSize: "2rem", marginBottom: 8 }}>
                    <MdRestaurantMenu style={{ verticalAlign: "middle", color: "var(--primary)" }} /> Restaurant Dashboard
                </h1>
                <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>
                    Welcome back, {user.username}!
                </p>

                {!isApproved && (
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

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 36 }}>
                    <div style={{
                        background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)",
                        padding: 24, display: "flex", alignItems: "center", gap: 16
                    }}>
                        <div style={{ width: 52, height: 52, borderRadius: "var(--radius)", background: "rgba(156,39,176,0.15)", color: "#9C27B0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}><FiShoppingBag /></div>
                        <div>
                            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>My Products</div>
                            <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{foodCount}</div>
                        </div>
                    </div>
                    <div style={{
                        background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)",
                        padding: 24, display: "flex", alignItems: "center", gap: 16
                    }}>
                        <div style={{ width: 52, height: 52, borderRadius: "var(--radius)", background: "rgba(255,152,0,0.15)", color: "#FF9800", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}><FiPackage /></div>
                        <div>
                            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Orders</div>
                            <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{orderCount}</div>
                        </div>
                    </div>
                    <div style={{
                        background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)",
                        padding: 24, display: "flex", alignItems: "center", gap: 16
                    }}>
                        <div style={{ width: 52, height: 52, borderRadius: "var(--radius)", background: "rgba(33,150,243,0.15)", color: "#2196F3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}><MdRestaurantMenu /></div>
                        <div>
                            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Restaurants</div>
                            <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{restaurants.length}</div>
                        </div>
                    </div>
                </div>

                <h3 style={{ fontSize: "1.15rem", marginBottom: 16, color: "var(--text-secondary)" }}>Quick Actions</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
                    <div onClick={() => navigate("/restaurant/menu")} style={{
                        background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)",
                        padding: 20, cursor: "pointer", transition: "var(--transition)", display: "flex", alignItems: "center", gap: 14
                    }}>
                        <div style={{ width: 44, height: 44, borderRadius: "var(--radius)", background: "rgba(255,107,53,0.12)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem" }}><FiShoppingBag /></div>
                        <div>
                            <div style={{ fontWeight: 600 }}>View Menu</div>
                            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Browse your food items</div>
                        </div>
                    </div>
                    {isApproved && (
                        <div onClick={() => navigate("/restaurant/new-product")} style={{
                            background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)",
                            padding: 20, cursor: "pointer", transition: "var(--transition)", display: "flex", alignItems: "center", gap: 14
                        }}>
                            <div style={{ width: 44, height: 44, borderRadius: "var(--radius)", background: "rgba(0,200,83,0.12)", color: "#00C853", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem" }}><FiPlusCircle /></div>
                            <div>
                                <div style={{ fontWeight: 600 }}>Add Product</div>
                                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Add a new food item</div>
                            </div>
                        </div>
                    )}
                    <div onClick={() => navigate("/restaurant/orders")} style={{
                        background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)",
                        padding: 20, cursor: "pointer", transition: "var(--transition)", display: "flex", alignItems: "center", gap: 14
                    }}>
                        <div style={{ width: 44, height: 44, borderRadius: "var(--radius)", background: "rgba(255,152,0,0.12)", color: "#FF9800", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem" }}><FiPackage /></div>
                        <div>
                            <div style={{ fontWeight: 600 }}>View Orders</div>
                            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Track incoming orders</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantHome;
