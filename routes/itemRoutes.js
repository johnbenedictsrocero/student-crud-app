const express = require("express");
const router = express.Router();
const {
    createItem,
    getItems,
    getItem,
    updateItem,
    deleteItem
} = require("../controllers/itemController");

router.route("/")
    .get(getItems)
    .post(createItem);

router.route("/:id")
    .get(getItem)
    .put(updateItem)
    .delete(deleteItem);

module.exports = router;