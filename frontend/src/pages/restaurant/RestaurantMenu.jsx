import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingBag, FiTrash2, FiEdit2, FiPlusCircle } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import API from "../../utils/api";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";

const RestaurantMenu = () => {
    const { user } = useAuth();
    const [foods, setFoods] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const isApproved = user?.approval;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [foodsRes, restRes] = await Promise.all([
                    API.get("/foods"),
                    API.get("/restaurants"),
                ]);
                const myRests = restRes.data.filter(r => r.ownerId === user._id);
                setRestaurants(myRests);
                setFoods(foodsRes.data.filter(f => {
                    const rid = f.restaurant?._id || f.restaurant;
                    return myRests.some(r => r._id === rid);
                }));
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const handleDelete = async (id) => {
        try {
            await API.delete(`/foods/${id}`);
            setFoods(foods.filter(f => f._id !== id));
            toast.success("Food item deleted");
        } catch {
            toast.error("Failed to delete");
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="page-enter" style={{ padding: "100px 0 60px" }}>
            <div className="container">
                <h1 style={{ fontSize: "2rem", marginBottom: 8 }}>
                    <FiShoppingBag style={{ verticalAlign: "middle", color: "var(--primary)" }} /> My Menu
                </h1>
                <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>{foods.length} food items</p>

                {isApproved && (
                    <button className="btn btn-primary" style={{ marginBottom: 20 }} onClick={() => navigate("/restaurant/new-product")}>
                        <FiPlusCircle /> Add New Item
                    </button>
                )}

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
                                        {isApproved && (
                                            <div style={{ display: "flex", gap: 6 }}>
                                                <button onClick={() => navigate(`/restaurant/edit-product/${food._id}`)} style={{
                                                    background: "rgba(33,150,243,0.1)", color: "#2196F3", border: "none", padding: 8,
                                                    borderRadius: "var(--radius)", cursor: "pointer", fontSize: "0.9rem"
                                                }}><FiEdit2 /></button>
                                                <button onClick={() => handleDelete(food._id)} style={{
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
        </div>
    );
};

export default RestaurantMenu;
