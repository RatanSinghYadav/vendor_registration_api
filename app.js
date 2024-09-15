require('dotenv').config();
require('./src/db/connect.js');
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const cors = require('cors');
const route = require('./src/routes/router.js')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(route);

app.listen(PORT, () => {
    console.log("server is running...")
}) 