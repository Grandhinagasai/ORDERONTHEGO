const express = require("express");
const Restaurant = require("../models/Restaurant");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const restaurants = await Restaurant.find({});
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/", auth, roleCheck("restaurant", "admin"), async (req, res) => {
    try {
        const { title, address, mainImg, menu } = req.body;
        const restaurant = await Restaurant.create({
            ownerId: req.user._id,
            title,
            address,
            mainImg,
            menu,
        });
        res.status(201).json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/:id", auth, roleCheck("restaurant", "admin"), async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        if (
            restaurant.ownerId.toString() !== req.user._id.toString() &&
            req.user.userType !== "admin"
        ) {
            return res.status(403).json({ message: "Not authorized" });
        }
        const updated = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:id", auth, roleCheck("restaurant", "admin"), async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        await Restaurant.findByIdAndDelete(req.params.id);
        res.json({ message: "Restaurant removed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
