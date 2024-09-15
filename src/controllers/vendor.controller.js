const Vendor = require("../models/vendor.model.js");
const nodemailer = require("nodemailer");

// Add Vendor and Send Email
const addVendor = async (req, res) => {
    const { name, email } = req.body;
    try {

        const formLink = `http://localhost:3000/form/${email}`;
        const newVendor = new Vendor({ name, email, formLink });
        const vendor = await newVendor.save();

        // console.log(vendor._id)

        const vendorLink = `http://localhost:3000/form/${vendor._id}`

        // Email Send Functionality
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Vendor Form Link",
            html: `<p>Please fill out this form: <a href="${vendorLink}">Form Link</a></p>`,
        };

        await transporter.sendMail(mailOptions);
        return res.status(201).json({ message: "Vendor added and email sent." }); // Ensure you are sending a response
    } catch (error) {
        return res.status(500).json({ error: error.message }); // Ensure you are sending a response in catch block
    }
};

const getVendorsData = async (req, res) => {
    try {
        const vendor = await Vendor.find();
        // console.log(vendor);
        res.status(201).json({ success: true, message: 'vendors data find successfuly...', vendor });
    } catch (error) {
        res.status(404).json({ success: false, message: 'failed to get vendors data.' })
        console.log('failed to get vendors data.', error)
    }
}

// Update Vendor Status
const updateVendorStatus = async (req, res) => {
    const { id } = req.params;
    // console.log(email)
    try {
        const vendor = await Vendor.findOneAndUpdate({ _id: id }, { status: "Complete" }, { new: true });
        if (!vendor) return res.status(404).json({ message: "Vendor not found." });
        res.status(200).json({ success: true, message: 'vendor form submitted successfully...', vendor });
    } catch (error) {
        res.status(500).json({ error: error.message, message: 'vendor form submission failed...' });
    }
};

module.exports = { addVendor, updateVendorStatus, getVendorsData }