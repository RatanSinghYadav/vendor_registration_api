require('dotenv').config();
require('./src/db/connect.js');
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const cors = require('cors');
const route = require('./src/routes/router.js')

const corsOption = {
    // origin: "https://task-management-webapp-kr7n.onrender.com",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie', 'Token', 'token']
}

app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(route);

app.listen(PORT, () => {
    console.log("server is running...")
}) 