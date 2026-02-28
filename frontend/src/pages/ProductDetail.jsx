import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiStar, FiShoppingCart, FiArrowLeft } from "react-icons/fi";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import "../styles/Products.css";

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToCart } = useCart();
    const [food, setFood] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFood = async () => {
            try {
                const { data } = await API.get(`/foods/${id}`);
                setFood(data);
            } catch (error) {
                toast.error("Food item not found");
                navigate("/products");
            } finally {
                setLoading(false);
            }
        };
        fetchFood();
    }, [id, navigate]);

    const handleAddToCart = async () => {
        if (!user) {
            toast.error("Please login to add items to cart");
            navigate("/login");
            return;
        }
        try {
            await addToCart({
                foodItemId: food._id,
                foodItemName: food.title,
                foodItemImg: food.mainImg,
                price: food.price,
                discount: food.discount || 0,
                quantity,
                restaurantId: food.restaurant?._id || food.restaurant,
                restaurantName: food.restaurant?.title || "",
            });
            toast.success(`${food.title} added to cart!`);
        } catch {
            toast.error("Failed to add to cart");
        }
    };

    if (loading) return <Loader />;
    if (!food) return null;

    const discountedPrice = food.price - (food.price * (food.discount || 0)) / 100;

    return (
        <div className="product-detail-page container page-enter">
            <button
                onClick={() => navigate(-1)}
                className="btn btn-secondary btn-sm"
                style={{ marginBottom: 24 }}
            >
                <FiArrowLeft /> Back
            </button>

            <div className="product-detail-grid">
                <img src={food.mainImg} alt={food.title} className="product-detail-img" />
                <div className="product-detail-info">
                    {food.restaurant?.title && (
                        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: 1 }}>
                            {food.restaurant.title}
                        </p>
                    )}
                    <h1>{food.title}</h1>

                    <div className="product-detail-meta">
                        <span className={`badge ${food.menuType === "veg" ? "badge-veg" : "badge-nonveg"}`}>
                            {food.menuType === "veg" ? "VEG" : food.menuType === "vegan" ? "VEGAN" : "NON-VEG"}
                        </span>
                        <span className="badge" style={{ background: "rgba(255,201,71,0.15)", color: "var(--secondary)" }}>
                            <FiStar style={{ marginRight: 4 }} /> {food.rating?.toFixed(1) || "4.0"}
                        </span>
                        <span className="badge" style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)" }}>
                            {food.category}
                        </span>
                        {food.discount > 0 && (
                            <span className="badge badge-discount">{food.discount}% OFF</span>
                        )}
                    </div>

                    <p className="product-detail-desc">{food.description}</p>

                    <div className="product-detail-price">
                        <span className="current">₹{Math.round(discountedPrice * quantity)}</span>
                        {food.discount > 0 && (
                            <span className="original">₹{food.price * quantity}</span>
                        )}
                    </div>

                    {(!user || user.userType === "customer") && (
                        <div className="product-detail-actions">
                            <div className="quantity-control">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                                <span>{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)}>+</button>
                            </div>
                            <button className="btn btn-primary btn-lg" onClick={handleAddToCart}>
                                <FiShoppingCart /> Add to Cart
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
