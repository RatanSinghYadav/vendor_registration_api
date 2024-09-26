const { Router } = require('express');
const route = Router();
const { addVendor, vendorForm, getVendorsData, getVendorById, deleteVendorById, approvedByPurchase, downloadVendorFileById } = require("../controllers/vendor.controller.js");

// Multer setup for handling file uploads
const multer = require('multer');
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Route definitions
route.get("/api/vendors", getVendorsData);

// Add vendor route (without file uploads)
route.post("/api/vendors/add", addVendor);

route.get("/api/vendor/details/:id", getVendorById)

route.delete("/api/vendor/delete/:id", deleteVendorById);

route.post("/api/vendor/purchase/:id", approvedByPurchase)

route.get("/api/vendor/download/:field/:id", downloadVendorFileById)

// Vendor form submission route (with file uploads)
route.post("/api/vendors/form/:id", upload.fields([
    { name: 'incorporationCertificateFile', maxCount: 1 },
    { name: 'bankAccountCancelChequeFile', maxCount: 1 },
    { name: 'gstRegistrationCertificateFile', maxCount: 1 },
    { name: 'principalBusinessProofFile', maxCount: 1 },
    { name: 'msmeCertificateFile', maxCount: 1 },
    { name: 'panFile', maxCount: 1 }
]), vendorForm);

module.exports = route;
