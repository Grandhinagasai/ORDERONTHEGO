import { useState, useEffect } from "react";
import { FiShoppingBag, FiPlusCircle, FiTrash2, FiEdit2 } from "react-icons/fi";
import API from "../../utils/api";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";

const AllProducts = () => {
    const [foods, setFoods] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [editingFood, setEditingFood] = useState(null);
    const [selectedRestaurant, setSelectedRestaurant] = useState("");
    const [newFood, setNewFood] = useState({
        title: "", description: "", mainImg: "", menuType: "veg",
        category: "Main Course", price: "", discount: "0",
    });

    const inputStyle = { padding: "12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: "var(--radius)", color: "var(--text-primary)" };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [foodsRes, restRes] = await Promise.all([
                    API.get("/foods"),
                    API.get("/restaurants"),
                ]);
                setFoods(foodsRes.data);
                setRestaurants(restRes.data);
                if (restRes.data.length > 0) setSelectedRestaurant(restRes.data[0]._id);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAddFood = async (e) => {
        e.preventDefault();
        try {
            await API.post("/foods", {
                ...newFood,
                price: Number(newFood.price),
                discount: Number(newFood.discount || 0),
                restaurant: selectedRestaurant,
            });
            toast.success("Food item added!");
            setShowAdd(false);
            setNewFood({ title: "", description: "", mainImg: "", menuType: "veg", category: "Main Course", price: "", discount: "0" });
            const { data } = await API.get("/foods");
            setFoods(data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add food");
        }
    };

    const handleEditFood = async (e) => {
        e.preventDefault();
        try {
            await API.put(`/foods/${editingFood._id}`, {
                title: editingFood.title, description: editingFood.description,
                mainImg: editingFood.mainImg, menuType: editingFood.menuType,
                category: editingFood.category, price: Number(editingFood.price),
                discount: Number(editingFood.discount || 0),
            });
            toast.success("Food item updated!");
            setEditingFood(null);
            const { data } = await API.get("/foods");
            setFoods(data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update");
        }
    };

    const handleDelete = async (id) => {
        try {
            await API.delete(`/foods/${id}`);
            setFoods(foods.filter(f => f._id !== id));
            toast.success("Food item deleted");
        } catch {
            toast.error("Failed to delete");
        }
    };

    const renderForm = (food, setFood, onSubmit, buttonText) => (
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
                {editingFood && <button type="button" className="btn btn-secondary" onClick={() => setEditingFood(null)}>Cancel</button>}
            </div>
        </form>
    );

    if (loading) return <Loader />;

    return (
        <div className="page-enter" style={{ padding: "100px 0 60px" }}>
            <div className="container">
                <h1 style={{ fontSize: "2rem", marginBottom: 8 }}>
                    <FiShoppingBag style={{ verticalAlign: "middle", color: "var(--primary)" }} /> All Products
                </h1>
                <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>{foods.length} food items</p>

                <button className="btn btn-primary" style={{ marginBottom: 20 }} onClick={() => { setShowAdd(!showAdd); setEditingFood(null); }}>
                    <FiPlusCircle /> {showAdd ? "Cancel" : "Add New Item"}
                </button>

                {showAdd && !editingFood && renderForm(newFood, setNewFood, handleAddFood, "Add Food Item")}
                {editingFood && renderForm(editingFood, setEditingFood, handleEditFood, "Save Changes")}

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                    {foods.map(food => (
                        <div key={food._id} style={{
                            background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)",
                            overflow: "hidden", transition: "var(--transition)"
                        }}>
                            {food.mainImg && <img src={food.mainImg} alt={food.title} style={{ width: "100%", height: 160, objectFit: "cover" }} />}
                            <div style={{ padding: 16, display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                                <div>
                                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{food.title}</div>
                                    <span style={{ color: "var(--primary)", fontWeight: 700 }}>₹{food.price}</span>
                                    {food.discount > 0 && <span style={{ marginLeft: 8, fontSize: "0.8rem", color: "var(--success)" }}>{food.discount}% off</span>}
                                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 4 }}>{food.category} · {food.menuType}</div>
                                </div>
                                <div style={{ display: "flex", gap: 6 }}>
                                    <button onClick={() => { setEditingFood({ ...food }); setShowAdd(false); }} style={{
                                        background: "rgba(33,150,243,0.1)", color: "#2196F3", border: "none", padding: 8,
                                        borderRadius: "var(--radius)", cursor: "pointer", fontSize: "0.9rem"
                                    }}><FiEdit2 /></button>
                                    <button onClick={() => handleDelete(food._id)} style={{
                                        background: "rgba(255,61,87,0.1)", color: "var(--danger)", border: "none", padding: 8,
                                        borderRadius: "var(--radius)", cursor: "pointer", fontSize: "0.9rem"
                                    }}><FiTrash2 /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AllProducts;
