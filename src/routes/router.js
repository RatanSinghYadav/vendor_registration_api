const { Router } = require('express');
const route = Router();
const { addVendor, vendorForm,
    getVendorsData, getVendorById,
    deleteVendorById, approvedByPurchase,
    downloadVendorFileById, bankDetailApproved, vendorApproved,
    editVendorDetails, 
    getAllVendorsData,
    updateVendorCode} = require("../controllers/vendor.controller.js");
const { userSignup, userLogin } = require('../controllers/auth.controller.js');
const verifyToken = require('../middleware/verifyToken.js');
const verifyUser = require('../middleware/verifyUser.js');

// Multer setup for handling file uploads
const multer = require('multer');
const storage = multer.diskStorage({});
const upload = multer({ storage });

//  verification route
route.post('/api/v1/verifyuser', verifyToken, verifyUser);

// user login routes

route.post("/api/v1/user/signup", userSignup);
route.post("/api/v1/user/login", userLogin);

// // // //

// Route definitions

// api for fetch all vendors 

route.get("/api/vendors", verifyToken, getAllVendorsData);

route.get("/api/vendors/:role", verifyToken, getVendorsData);

// Add vendor route (without file uploads)
route.post("/api/vendors/add", verifyToken, addVendor);

// api for fetch vendor details
route.get("/api/vendor/details/:id", verifyToken, getVendorById);

// api for vendor delete
route.delete("/api/vendor/delete/:id", verifyToken, deleteVendorById);

// api for vendor approval
route.patch("/api/vendor/purchase/:id", verifyToken, approvedByPurchase);

// api for vendor bank details approval
route.post("/api/vendor/purchase/bankDetailApproved/:id", verifyToken, bankDetailApproved);

route.post("/api/vendor/purchase/approvedVendor/:id", verifyToken, vendorApproved);

route.get("/api/vendor/download/:field/:id", downloadVendorFileById);

// Vendor form submission route (with file uploads)
route.post("/api/vendors/form/:id", upload.fields([
    { name: 'incorporationCertificateFile', maxCount: 1 },
    { name: 'bankAccountCancelChequeFile', maxCount: 1 },
    { name: 'gstRegistrationCertificateFile', maxCount: 1 },
    { name: 'principalBusinessProofFile', maxCount: 1 },
    { name: 'msmeCertificateFile', maxCount: 1 },
    { name: 'panFile', maxCount: 1 }
]), vendorForm);

// api for vendor edit details
route.patch("/api/vendor/editDetails/:id", verifyToken, editVendorDetails);

// update vendor code
route.patch("/api/vendor/updateVendorCode/:id", verifyToken, updateVendorCode);

module.exports = route;
