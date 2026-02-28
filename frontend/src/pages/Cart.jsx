import { useNavigate } from "react-router-dom";
import { FiTrash2, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import "../styles/Cart.css";

const Cart = () => {
    const { cartItems, loading, updateQuantity, removeFromCart, cartTotal } = useCart();
    const navigate = useNavigate();

    const handleQuantity = async (id, qty) => {
        try {
            if (qty <= 0) {
                await removeFromCart(id);
                toast.success("Item removed");
            } else {
                await updateQuantity(id, qty);
            }
        } catch {
            toast.error("Failed to update");
        }
    };

    const handleRemove = async (id) => {
        try {
            await removeFromCart(id);
            toast.success("Item removed from cart");
        } catch {
            toast.error("Failed to remove");
        }
    };

    if (loading) return <Loader />;

    const deliveryFee = cartTotal > 0 ? 40 : 0;
    const totalWithDelivery = cartTotal + deliveryFee;

    return (
        <div className="cart-page container page-enter">
            <h1>Your <span style={{ color: "var(--primary)" }}>Cart</span></h1>

            {cartItems.length === 0 ? (
                <div className="cart-empty">
                    <div className="icon"><FiShoppingBag /></div>
                    <h3>Your cart is empty</h3>
                    <p>Add some delicious food to your cart!</p>
                    <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => navigate("/products")}>
                        Browse Menu <FiArrowRight />
                    </button>
                </div>
            ) : (
                <div className="cart-layout">
                    <div className="cart-items">
                        {cartItems.map((item) => {
                            const discounted = item.price - (item.price * (item.discount || 0)) / 100;
                            return (
                                <div key={item._id} className="cart-item">
                                    <img src={item.foodItemImg} alt={item.foodItemName} className="cart-item-img" />
                                    <div className="cart-item-info">
                                        <div>
                                            <div className="cart-item-name">{item.foodItemName}</div>
                                            {item.restaurantName && (
                                                <div className="cart-item-restaurant">{item.restaurantName}</div>
                                            )}
                                        </div>
                                        <div className="cart-item-bottom">
                                            <div>
                                                <span className="cart-item-price">₹{Math.round(discounted * item.quantity)}</span>
                                                {item.discount > 0 && (
                                                    <span className="cart-item-original">₹{item.price * item.quantity}</span>
                                                )}
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                <div className="cart-item-qty">
                                                    <button onClick={() => handleQuantity(item._id, item.quantity - 1)}>−</button>
                                                    <span>{item.quantity}</span>
                                                    <button onClick={() => handleQuantity(item._id, item.quantity + 1)}>+</button>
                                                </div>
                                                <button className="cart-item-remove" onClick={() => handleRemove(item._id)}>
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="cart-summary">
                        <h3>Order Summary</h3>
                        <div className="cart-summary-row">
                            <span>Subtotal ({cartItems.length} items)</span>
                            <span>₹{Math.round(cartTotal)}</span>
                        </div>
                        <div className="cart-summary-row">
                            <span>Delivery Fee</span>
                            <span>₹{deliveryFee}</span>
                        </div>
                        {cartTotal > 0 && (
                            <div className="cart-summary-row" style={{ color: "var(--success)", fontSize: "0.85rem" }}>
                                <span>Discount Savings</span>
                                <span>
                                    −₹{Math.round(
                                        cartItems.reduce((s, i) => s + (i.price * (i.discount || 0) / 100) * i.quantity, 0)
                                    )}
                                </span>
                            </div>
                        )}
                        <div className="cart-summary-row total">
                            <span>Total</span>
                            <span>₹{Math.round(totalWithDelivery)}</span>
                        </div>
                        <button className="btn btn-primary btn-lg" onClick={() => navigate("/checkout")}>
                            Proceed to Checkout <FiArrowRight />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
