import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdRestaurantMenu } from "react-icons/md";
import API from "../../utils/api";
import Loader from "../../components/Loader";

const AllRestaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const { data } = await API.get("/restaurants");
                setRestaurants(data);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRestaurants();
    }, []);

    if (loading) return <Loader />;

    return (
        <div className="page-enter" style={{ padding: "100px 0 60px" }}>
            <div className="container">
                <h1 style={{ fontSize: "2rem", marginBottom: 8 }}>
                    <MdRestaurantMenu style={{ verticalAlign: "middle", color: "var(--primary)" }} /> All Restaurants
                </h1>
                <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>{restaurants.length} restaurants</p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
                    {restaurants.map(r => (
                        <div key={r._id} onClick={() => navigate(`/products?restaurant=${r._id}`)} style={{
                            background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)",
                            overflow: "hidden", cursor: "pointer", transition: "var(--transition)"
                        }}>
                            <img src={r.mainImg} alt={r.title} style={{ width: "100%", height: 180, objectFit: "cover" }} />
                            <div style={{ padding: 16 }}>
                                <h3 style={{ fontSize: "1.15rem", marginBottom: 6 }}>{r.title}</h3>
                                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{r.address}</p>
                                {r.menu && r.menu.length > 0 && (
                                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
                                        {r.menu.map((m, i) => (
                                            <span key={i} style={{
                                                padding: "3px 10px", borderRadius: "var(--radius-full)", fontSize: "0.7rem",
                                                background: "rgba(255,107,53,0.1)", color: "var(--primary)", fontWeight: 500
                                            }}>{m}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AllRestaurants;
