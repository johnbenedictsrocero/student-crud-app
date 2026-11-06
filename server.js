require("dotenv").config();

const dns = require("node:dns");
dns.setServers(["1.1.1.1", "1.0.0.1"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const itemRoutes = require("./routes/itemRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware - INCREASE THE LIMIT HERE FOR BASE64 IMAGES
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Item API routes (Place API routes BEFORE static files)
app.use("/api/Items", itemRoutes);

// Serve static frontend files from public folder
app.use(express.static("public"));

// Connect to MongoDB Atlas
mongoose
    .connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10000
    })
    .then(() => {
        console.log("Connected to MongoDB");

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error.message);
    });