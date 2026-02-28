import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

const PopularRestaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const { data } = await API.get("/restaurants");
                setRestaurants(data.slice(0, 6));
            } catch (error) {
                console.error("Error:", error);
            }
        };
        fetchRestaurants();
    }, []);

    if (restaurants.length === 0) return null;

    return (
        <section style={{ padding: "40px 0" }}>
            <div className="container">
                <h2 style={{ fontSize: "1.5rem", marginBottom: 24, textAlign: "center" }}>
                    Popular Restaurants
                </h2>
                <div style={{
                    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20
                }}>
                    {restaurants.map(r => (
                        <div key={r._id} onClick={() => navigate(`/view-restaurant/${r._id}`)}
                            style={{
                                background: "var(--bg-card)", border: "1px solid var(--border)",
                                borderRadius: "var(--radius-lg)", overflow: "hidden",
                                cursor: "pointer", transition: "var(--transition)"
                            }}>
                            <img src={r.mainImg} alt={r.title}
                                style={{ width: "100%", height: 180, objectFit: "cover" }} />
                            <div style={{ padding: 16 }}>
                                <h3 style={{ fontSize: "1.1rem", marginBottom: 4 }}>{r.title}</h3>
                                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{r.address}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PopularRestaurants;
