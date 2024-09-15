require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URL = process.env.MONGODB_URL;

const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

async function connectToDatabase() {
    try {
        await mongoose.connect(MONGODB_URL, mongooseOptions);
        console.log("connected to MongoDB Database...")
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

connectToDatabase();