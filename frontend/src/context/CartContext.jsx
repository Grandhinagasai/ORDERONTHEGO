import { createContext, useContext, useState, useEffect, useCallback } from "react";
import API from "../utils/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const fetchCart = useCallback(async () => {
        if (!user) {
            setCartItems([]);
            return;
        }
        try {
            setLoading(true);
            const { data } = await API.get("/cart");
            setCartItems(data);
        } catch (error) {
            console.error("Error fetching cart:", error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (item) => {
        try {
            await API.post("/cart/add", item);
            await fetchCart();
        } catch (error) {
            throw error;
        }
    };

    const updateQuantity = async (cartItemId, quantity) => {
        try {
            await API.put(`/cart/update/${cartItemId}`, { quantity });
            await fetchCart();
        } catch (error) {
            throw error;
        }
    };

    const removeFromCart = async (cartItemId) => {
        try {
            await API.delete(`/cart/remove/${cartItemId}`);
            await fetchCart();
        } catch (error) {
            throw error;
        }
    };

    const clearCart = async () => {
        try {
            await API.delete("/cart/clear");
            setCartItems([]);
        } catch (error) {
            throw error;
        }
    };

    const cartTotal = cartItems.reduce((total, item) => {
        const discountedPrice = item.price - (item.price * (item.discount || 0)) / 100;
        return total + discountedPrice * item.quantity;
    }, 0);

    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                loading,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
                fetchCart,
                cartTotal,
                cartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
