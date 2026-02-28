import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlusCircle } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import API from "../../utils/api";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";

const NewProduct = () => {
    const { user } = useAuth();
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "", description: "", mainImg: "", menuType: "veg",
        category: "Main Course", price: "", discount: "0",
    });

    const inputStyle = { padding: "12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: "var(--radius)", color: "var(--text-primary)" };

    useEffect(() => {
        const fetchRests = async () => {
            try {
                const { data } = await API.get("/restaurants");
                const myRests = data.filter(r => r.ownerId === user._id);
                setRestaurants(myRests);
                if (myRests.length > 0) setSelectedRestaurant(myRests[0]._id);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRests();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await API.post("/foods", {
                ...form,
                price: Number(form.price),
                discount: Number(form.discount || 0),
                restaurant: selectedRestaurant,
            });
            toast.success("Food item added!");
            navigate("/restaurant/menu");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add food");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Loader />;

    if (!user?.approval) {
        return (
            <div className="page-enter" style={{ padding: "100px 0 60px" }}>
                <div className="container" style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "3rem", marginBottom: 12 }}>⏳</div>
                    <h2>Pending Approval</h2>
                    <p style={{ color: "var(--text-muted)" }}>You cannot add food items until your restaurant is approved by admin.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-enter" style={{ padding: "100px 0 60px" }}>
            <div className="container" style={{ maxWidth: 700 }}>
                <h1 style={{ fontSize: "2rem", marginBottom: 8 }}>
                    <FiPlusCircle style={{ verticalAlign: "middle", color: "var(--primary)" }} /> Add New Product
                </h1>
                <p style={{ color: "var(--text-muted)", marginBottom: 28 }}>Fill in the details to add a food item</p>

                <form onSubmit={handleSubmit} style={{
                    background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)",
                    padding: 28, display: "flex", flexDirection: "column", gap: 14
                }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        <div className="form-group">
                            <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Title</label>
                            <input className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Image URL</label>
                            <input className="input-field" value={form.mainImg} onChange={(e) => setForm({ ...form, mainImg: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Price (₹)</label>
                            <input className="input-field" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Discount (%)</label>
                            <input className="input-field" type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Category</label>
                            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={inputStyle}>
                                {["Soups", "Breads", "Main Course", "Desserts", "Beverages", "Snacks", "Salads", "Biryani", "Pizza", "Burgers"].map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Type</label>
                            <select value={form.menuType} onChange={(e) => setForm({ ...form, menuType: e.target.value })} style={inputStyle}>
                                <option value="veg">Veg</option>
                                <option value="non-veg">Non-Veg</option>
                                <option value="vegan">Vegan</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Description</label>
                        <input className="input-field" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                    </div>
                    {restaurants.length > 0 && (
                        <div className="form-group">
                            <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Restaurant</label>
                            <select value={selectedRestaurant} onChange={(e) => setSelectedRestaurant(e.target.value)} style={inputStyle}>
                                {restaurants.map(r => <option key={r._id} value={r._id}>{r.title}</option>)}
                            </select>
                        </div>
                    )}
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                        {submitting ? "Adding..." : "Add Food Item"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewProduct;
