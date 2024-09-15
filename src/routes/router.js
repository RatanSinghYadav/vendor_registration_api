const {Router} = require('express');
const route = Router();
const { addVendor, updateVendorStatus, getVendorsData } = require("../controllers/vendor.controller.js");


route.get("/api/vendors", getVendorsData)
route.post("/api/vendors/add", addVendor);
route.put("/api/vendors/update/:id", updateVendorStatus);

module.exports = route;
