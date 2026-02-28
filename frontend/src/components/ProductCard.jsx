import { useNavigate } from "react-router-dom";
import { FiStar, FiPlus } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import "./ProductCard.css";

const ProductCard = ({ food }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToCart } = useCart();

    const discountedPrice = food.price - (food.price * (food.discount || 0)) / 100;

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        if (!user) {
            toast.error("Please login to add items to cart");
            navigate("/login");
            return;
        }
        if (user.userType !== "customer") {
            toast.error("Only customers can add items to cart");
            return;
        }
        try {
            await addToCart({
                foodItemId: food._id,
                foodItemName: food.title,
                foodItemImg: food.mainImg,
                price: food.price,
                discount: food.discount || 0,
                quantity: 1,
                restaurantId: food.restaurant?._id || food.restaurant,
                restaurantName: food.restaurant?.title || "",
            });
            toast.success(`${food.title} added to cart!`);
        } catch {
            toast.error("Failed to add to cart");
        }
    };

    return (
        <div className="product-card" onClick={() => navigate(`/product/${food._id}`)}>
            <div className="product-card-img-wrap">
                <img src={food.mainImg} alt={food.title} className="product-card-img" />
                <div className="product-card-badges">
                    <span className={`badge ${food.menuType === "veg" ? "badge-veg" : "badge-nonveg"}`}>
                        {food.menuType === "veg" ? "VEG" : food.menuType === "vegan" ? "VEGAN" : "NON-VEG"}
                    </span>
                </div>
                {food.discount > 0 && (
                    <div className="product-card-discount">
                        <span className="badge badge-discount">{food.discount}% OFF</span>
                    </div>
                )}
            </div>
            <div className="product-card-body">
                {food.restaurant?.title && (
                    <div className="product-card-restaurant">{food.restaurant.title}</div>
                )}
                <h3 className="product-card-title">{food.title}</h3>
                <p className="product-card-desc">{food.description}</p>
                <div className="product-card-footer">
                    <div className="product-card-price">
                        <span className="current">₹{Math.round(discountedPrice)}</span>
                        {food.discount > 0 && <span className="original">₹{food.price}</span>}
                    </div>
                    <div className="product-card-rating">
                        <FiStar /> {food.rating?.toFixed(1) || "4.0"}
                    </div>
                </div>
                {(!user || user.userType === "customer") && (
                    <button className="product-card-add" onClick={handleAddToCart} style={{ marginTop: 12, width: "100%" }}>
                        <FiPlus style={{ verticalAlign: "middle" }} /> Add to Cart
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
