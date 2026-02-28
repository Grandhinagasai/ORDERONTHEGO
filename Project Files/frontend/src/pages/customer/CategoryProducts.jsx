import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../../utils/api";
import ProductCard from "../../components/ProductCard";
import Loader from "../../components/Loader";

const CategoryProducts = () => {
    const { category } = useParams();
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFoods = async () => {
            try {
                const { data } = await API.get(`/foods?category=${encodeURIComponent(category)}`);
                setFoods(data);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFoods();
    }, [category]);

    if (loading) return <Loader />;

    return (
        <div className="page-enter" style={{ padding: "100px 0 60px" }}>
            <div className="container">
                <div style={{ marginBottom: 24 }}>
                    <Link to="/products" style={{ color: "var(--primary)", fontSize: "0.85rem", textDecoration: "none" }}>← All Products</Link>
                </div>
                <h1 style={{ fontSize: "2rem", marginBottom: 8 }}>{category}</h1>
                <p style={{ color: "var(--text-muted)", marginBottom: 28 }}>{foods.length} items found</p>

                {foods.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
                        <h3>No items found in this category</h3>
                    </div>
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

export default CategoryProducts;
