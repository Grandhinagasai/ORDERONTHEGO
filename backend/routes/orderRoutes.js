const express = require("express");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/place", auth, async (req, res) => {
    try {
        const { name, mobile, email, address, pincode, paymentMethod, items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "No items in order" });
        }

        const orders = [];
        for (const item of items) {
            const order = await Order.create({
                userId: req.user._id,
                name,
                mobile,
                email,
                address,
                pincode,
                title: item.foodItemName,
                desc: item.desc || "",
                image: item.foodItemImg || "",
                restaurantId: item.restaurantId,
                quantity: item.quantity,
                price: item.price,
                discount: item.discount || 0,
                paymentMethod: paymentMethod || "COD",
                orderDate: new Date(),
                status: "Confirmed",
            });
            orders.push(order);
        }

        await Cart.deleteMany({ userId: req.user._id });

        res.status(201).json({
            message: "Order placed successfully",
            orders,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/my-orders", auth, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id }).sort({
            orderDate: -1,
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/:id", auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (
            order.userId.toString() !== req.user._id.toString() &&
            req.user.userType !== "admin" &&
            req.user.userType !== "restaurant"
        ) {
            return res.status(403).json({ message: "Not authorized" });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/:id/status", auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        order.status = req.body.status;
        if (req.body.status === "Delivered") {
            order.deliveryDate = new Date();
        }
        await order.save();
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
