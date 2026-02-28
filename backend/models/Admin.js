const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
    {
        banner: {
            type: [String],
            default: [],
        },
        categories: {
            type: [String],
            default: [
                "Soups",
                "Breads",
                "Main Course",
                "Desserts",
                "Beverages",
                "Snacks",
                "Salads",
                "Biryani",
                "Pizza",
                "Burgers",
            ],
        },
        promotedRestaurants: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "Restaurant",
            default: [],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
