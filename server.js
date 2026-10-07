// 1. Load environment variables FIRST before accessing process.env
require("dotenv").config();

// 2. Configure DNS servers using standard node:dns
const dns = require("node:dns");
dns.setServers(["1.1.1.1", "1.0.0.1"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // 3. Import cors

const studentRoutes = require("./routes/studentRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // 4. Enable cors
app.use(express.json());

// Serve static frontend files from public folder
app.use(express.static("public"));

// Student API routes
app.use("/api/students", studentRoutes);

// Connect to MongoDB Atlas
mongoose
    .connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10000
    })
    .then(() => {
        console.log("Connected to MongoDB");

        // Start server after DB connection succeeds
        app.listen(PORT, () => {
            // 5. Fixed missing backticks in template string
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error.message);
    });