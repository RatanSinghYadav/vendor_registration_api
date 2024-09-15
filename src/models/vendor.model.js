const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    status: { type: String, default: "Pending" }, // Default status as Pending
    formLink: { type: String } // To store form link
}, {
    timestamps: true
}
);

const vendor = mongoose.model("vendor_master", vendorSchema);

module.exports = vendor;
