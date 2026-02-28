const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
    {
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: [true, "Please provide a restaurant name"],
            trim: true,
        },
        address: {
            type: String,
            required: [true, "Please provide an address"],
        },
        mainImg: {
            type: String,
            default: "",
        },
        menu: {
            type: [String],
            default: [],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
