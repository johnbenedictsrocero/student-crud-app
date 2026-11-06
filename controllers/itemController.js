const Item = require("../models/Item");

const createItem = async (req, res) => {
    try {
        const item = await Item.create(req.body);
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateItem = async (req, res) => {
    try {
        const item = await Item.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.status(200).json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteItem = async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createItem,
    getItems,
    getItem,
    updateItem,
    deleteItem
};