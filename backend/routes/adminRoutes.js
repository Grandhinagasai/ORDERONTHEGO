const express = require("express");
const Order = require("../models/Order");
const User = require("../models/User");
const Food = require("../models/Food");
const Restaurant = require("../models/Restaurant");
const Admin = require("../models/Admin");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const router = express.Router();

router.get("/stats", auth, roleCheck("admin"), async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalProducts = await Food.countDocuments();
        const totalRestaurants = await Restaurant.countDocuments();
        const totalRevenue = await Order.aggregate([
            { $group: { _id: null, total: { $sum: { $multiply: ["$price", "$quantity"] } } } },
        ]);

        res.json({
            totalUsers,
            totalOrders,
            totalProducts,
            totalRestaurants,
            totalRevenue: totalRevenue[0]?.total || 0,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/orders", auth, roleCheck("admin"), async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ orderDate: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/users", auth, roleCheck("admin"), async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/users/:id/approval", auth, roleCheck("admin"), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.approval = req.body.approval;
        await user.save();
        res.json({ message: `User ${req.body.approval ? "approved" : "rejected"} successfully`, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/config", async (req, res) => {
    try {
        let config = await Admin.findOne({});
        if (!config) {
            config = await Admin.create({});
        }
        res.json(config);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/config", auth, roleCheck("admin"), async (req, res) => {
    try {
        let config = await Admin.findOne({});
        if (!config) {
            config = await Admin.create(req.body);
        } else {
            Object.assign(config, req.body);
            await config.save();
        }
        res.json(config);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
