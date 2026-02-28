const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Please provide a food item title"],
            trim: true,
        },
        description: {
            type: String,
            default: "",
        },
        mainImg: {
            type: String,
            default: "",
        },
        menuType: {
            type: String,
            enum: ["veg", "non-veg", "vegan"],
            default: "veg",
        },
        category: {
            type: String,
            required: [true, "Please provide a category"],
        },
        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
            required: true,
        },
        restaurantId: {
            type: String,
            default: "",
        },
        price: {
            type: Number,
            required: [true, "Please provide a price"],
        },
        discount: {
            type: Number,
            default: 0,
        },
        rating: {
            type: Number,
            default: 4.0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Food", foodSchema);
