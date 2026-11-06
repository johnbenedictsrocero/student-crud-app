const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
    {
        itemname: { type: String, required: true, trim: true },
        name: { type: String, required: true, trim: true },
        contact: { type: String, required: true, trim: true },
        image: { type: String, required: true, trim: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);