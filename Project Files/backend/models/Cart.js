const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        restaurantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
        },
        restaurantName: {
            type: String,
            default: "",
        },
        foodItemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Food",
            required: true,
        },
        foodItemName: {
            type: String,
            required: true,
        },
        foodItemImg: {
            type: String,
            default: "",
        },
        price: {
            type: Number,
            required: true,
        },
        discount: {
            type: Number,
            default: 0,
        },
        quantity: {
            type: Number,
            default: 1,
            min: 1,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
