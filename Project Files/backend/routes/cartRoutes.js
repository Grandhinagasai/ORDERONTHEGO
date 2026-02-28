const express = require("express");
const Cart = require("../models/Cart");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/", auth, async (req, res) => {
    try {
        const cartItems = await Cart.find({ userId: req.user._id });
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/add", auth, async (req, res) => {
    try {
        const { foodItemId, foodItemName, foodItemImg, price, discount, quantity, restaurantId, restaurantName } = req.body;

        const existingItem = await Cart.findOne({
            userId: req.user._id,
            foodItemId,
        });

        if (existingItem) {
            existingItem.quantity += quantity || 1;
            await existingItem.save();
            return res.json(existingItem);
        }

        const cartItem = await Cart.create({
            userId: req.user._id,
            foodItemId,
            foodItemName,
            foodItemImg,
            price,
            discount,
            quantity: quantity || 1,
            restaurantId,
            restaurantName,
        });

        res.status(201).json(cartItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/update/:id", auth, async (req, res) => {
    try {
        const cartItem = await Cart.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        cartItem.quantity = req.body.quantity;
        if (cartItem.quantity <= 0) {
            await Cart.findByIdAndDelete(req.params.id);
            return res.json({ message: "Item removed from cart" });
        }

        await cartItem.save();
        res.json(cartItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/remove/:id", auth, async (req, res) => {
    try {
        const cartItem = await Cart.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        await Cart.findByIdAndDelete(req.params.id);
        res.json({ message: "Item removed from cart" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/clear", auth, async (req, res) => {
    try {
        await Cart.deleteMany({ userId: req.user._id });
        res.json({ message: "Cart cleared" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
