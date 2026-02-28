import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";
import API from "../../utils/api";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";

const EditProduct = () => {
    const { id } = useParams();
    const [food, setFood] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const inputStyle = { padding: "12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: "var(--radius)", color: "var(--text-primary)" };

    useEffect(() => {
        const fetchFood = async () => {
            try {
                const { data } = await API.get(`/foods/${id}`);
                setFood(data);
            } catch (error) {
                console.error("Error:", error);
                toast.error("Food item not found");
                navigate("/restaurant/menu");
            } finally {
                setLoading(false);
            }
        };
        fetchFood();
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await API.put(`/foods/${id}`, {
                title: food.title, description: food.description,
                mainImg: food.mainImg, menuType: food.menuType,
                category: food.category, price: Number(food.price),
                discount: Number(food.discount || 0),
            });
            toast.success("Food item updated!");
            navigate("/restaurant/menu");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || !food) return <Loader />;

    return (
        <div className="page-enter" style={{ padding: "100px 0 60px" }}>
            <div className="container" style={{ maxWidth: 700 }}>
                <h1 style={{ fontSize: "2rem", marginBottom: 8 }}>
                    <FiEdit2 style={{ verticalAlign: "middle", color: "var(--primary)" }} /> Edit Product
                </h1>
                <p style={{ color: "var(--text-muted)", marginBottom: 28 }}>Update the food item details</p>

                <form onSubmit={handleSubmit} style={{
                    background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)",
                    padding: 28, display: "flex", flexDirection: "column", gap: 14
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
                    <div style={{ display: "flex", gap: 12 }}>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? "Saving..." : "Save Changes"}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate("/restaurant/menu")}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;
