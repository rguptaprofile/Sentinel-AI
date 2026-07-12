const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
app.use(express.json());

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function connectDB() {
    try {
        await client.connect();
        console.log("✅ Successfully connected to MongoDB!");
    } catch (error) {
        console.error("❌ Connection failed:", error);
        process.exit(1);
    }
}
connectDB();

// Example API Endpoint to fetch data for your frontend website
app.get('/api/data', async (req, res) => {
    try {
        const database = client.db('myDatabaseName');
        const collection = database.collection('myCollection');
        const data = await collection.find({}).toArray();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Paste this inside your frontend JavaScript file
async function loadWebsiteData() {
    try {
        const response = await fetch('https://sentinel-in.vercel.app/api/data');
        const data = await response.json();
        console.log("Data from MongoDB:", data);
        // Map this data onto your HTML DOM components here
    } catch (error) {
        console.error("Error loading web page data:", error);
    }
}
loadWebsiteData();
