const express = require("express");
const Food = require("../models/Food");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const { category, restaurant, search, sort, menuType } = req.query;
        let query = {};

        if (category) query.category = category;
        if (restaurant) query.restaurant = restaurant;
        if (menuType) query.menuType = menuType;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } },
            ];
        }

        let sortOption = {};
        if (sort === "price_asc") sortOption.price = 1;
        else if (sort === "price_desc") sortOption.price = -1;
        else if (sort === "rating") sortOption.rating = -1;
        else sortOption.createdAt = -1;

        const foods = await Food.find(query)
            .populate("restaurant", "title address mainImg")
            .sort(sortOption);
        res.json(foods);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/categories", async (req, res) => {
    try {
        const categories = await Food.distinct("category");
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const food = await Food.findById(req.params.id).populate(
            "restaurant",
            "title address mainImg"
        );
        if (!food) {
            return res.status(404).json({ message: "Food item not found" });
        }
        res.json(food);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/", auth, roleCheck("restaurant", "admin"), async (req, res) => {
    try {
        if (req.user.userType === "restaurant" && !req.user.approval) {
            return res.status(403).json({ message: "Your restaurant is pending admin approval. You cannot add items yet." });
        }
        const food = await Food.create(req.body);
        res.status(201).json(food);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/:id", auth, roleCheck("restaurant", "admin"), async (req, res) => {
    try {
        const food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!food) {
            return res.status(404).json({ message: "Food item not found" });
        }
        res.json(food);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:id", auth, roleCheck("restaurant", "admin"), async (req, res) => {
    try {
        const food = await Food.findById(req.params.id);
        if (!food) {
            return res.status(404).json({ message: "Food item not found" });
        }
        await Food.findByIdAndDelete(req.params.id);
        res.json({ message: "Food item removed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
