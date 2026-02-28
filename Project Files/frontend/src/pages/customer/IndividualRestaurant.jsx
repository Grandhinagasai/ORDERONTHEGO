import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../../utils/api";
import ProductCard from "../../components/ProductCard";
import Loader from "../../components/Loader";

const IndividualRestaurant = () => {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [restRes, foodsRes] = await Promise.all([
                    API.get(`/restaurants/${id}`),
                    API.get(`/foods?restaurant=${id}`),
                ]);
                setRestaurant(restRes.data);
                setFoods(foodsRes.data);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <Loader />;

    if (!restaurant) {
        return (
            <div className="page-enter" style={{ padding: "100px 0 60px" }}>
                <div className="container" style={{ textAlign: "center" }}>
                    <h2>Restaurant not found</h2>
                    <Link to="/" style={{ color: "var(--primary)" }}>Go Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page-enter" style={{ padding: "100px 0 60px" }}>
            <div className="container">
                <div style={{ marginBottom: 24 }}>
                    <Link to="/" style={{ color: "var(--primary)", fontSize: "0.85rem", textDecoration: "none" }}>← Back</Link>
                </div>

                <div style={{
                    borderRadius: "var(--radius-lg)", overflow: "hidden", marginBottom: 32,
                    background: "var(--bg-card)", border: "1px solid var(--border)"
                }}>
                    <img src={restaurant.mainImg} alt={restaurant.title}
                        style={{ width: "100%", height: 250, objectFit: "cover" }} />
                    <div style={{ padding: 24 }}>
                        <h1 style={{ fontSize: "1.8rem", marginBottom: 6 }}>{restaurant.title}</h1>
                        <p style={{ color: "var(--text-muted)", marginBottom: 12 }}>{restaurant.address}</p>
                        {restaurant.menu && restaurant.menu.length > 0 && (
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                {restaurant.menu.map((m, i) => (
                                    <span key={i} style={{
                                        padding: "4px 12px", borderRadius: "var(--radius-full)", fontSize: "0.75rem",
                                        background: "rgba(255,107,53,0.1)", color: "var(--primary)", fontWeight: 500
                                    }}>{m}</span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <h2 style={{ fontSize: "1.3rem", marginBottom: 20 }}>Menu ({foods.length} items)</h2>

                {foods.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", textAlign: "center", padding: 40 }}>No food items available</p>
                ) : (
                    <div className="product-grid">
                        {foods.map(food => (
                            <ProductCard key={food._id} food={food} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default IndividualRestaurant;
