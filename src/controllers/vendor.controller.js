const { default: mongoose } = require("mongoose");
const Vendor = require("../models/vendor.model.js");
const nodemailer = require("nodemailer");
const cloudinary = require('cloudinary').v2;

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Add Vendor and Send Email
const addVendor = async (req, res) => {
    const {
        name, email, companyName, proprietorName, businessNature, turnoverInLakhs,
        yearsInBusiness, workspaceArea, companyAddress, companyTelephone, companyMobile,
        companyPersonEmail, companyEmail, companyCountry, companyState, companyCity,
        companyPin, branchAddress, branchTelephone, branchMobile, branchPersonEmail,
        branchEmail, branchCountry, branchState, branchCity, branchPin, firmType,
        sisterConcernDetails, otherUnitsDetails, transactionWithOtherUnits, incorporationCertificate,
        registeredMSME, pan, businessAddressProof, bankAccountDetails, gstCertificate, bankName,
        accountName, accountNumber, bankIFSC, bankAccountCancelChequeFile, incorporationCertificateFile,
        gstRegistrationCertificateFile, principalBusinessProofFile, msmeCertificateFile, purchaseType,
        purchaseCategory, paymentTerms
    } = req.body;
    try {
        console.log(name, email)

        const formLink = `https://vendor-registration-app-avhtgsbccpd5a3hq.centralindia-01.azurewebsites.net/form/${email}`;

        // New vendor object with all fields from the request body
        const newVendor = new Vendor({
            name, email, companyName, proprietorName, businessNature, turnoverInLakhs,
            yearsInBusiness, workspaceArea, companyAddress, companyTelephone, companyMobile,
            companyPersonEmail, companyEmail, companyCountry, companyState, companyCity,
            companyPin, branchAddress, branchTelephone, branchMobile, branchPersonEmail,
            branchEmail, branchCountry, branchState, branchCity, branchPin, firmType,
            sisterConcernDetails, otherUnitsDetails, transactionWithOtherUnits,
            incorporationCertificate, registeredMSME, pan, businessAddressProof,
            bankAccountDetails, gstCertificate, bankName, accountName, accountNumber,
            bankIFSC, bankAccountCancelChequeFile, incorporationCertificateFile,
            gstRegistrationCertificateFile, principalBusinessProofFile, msmeCertificateFile,
            purchaseType, purchaseCategory, paymentTerms,
            formLink // Also adding formLink to the vendor
        });

        const vendor = await newVendor.save();

        // console.log(vendor._id)

        const vendorLink = `https://vendor-registration-app-avhtgsbccpd5a3hq.centralindia-01.azurewebsites.net/vendor/form/${vendor._id}`

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
        return res.status(201).json({ success: true, message: "Vendor added and email sent." }); // Ensure you are sending a response
    } catch (error) {
        return res.status(500).json({ success: false, error: error }); // Ensure you are sending a response in catch block
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

// Vendor Form
const vendorForm = async (req, res) => {
    const { id } = req.params;
    const files = req.files; // Assuming multiple files are uploaded
    const body = req.body; // Other form fields

    try {
        // Upload all required files to Cloudinary
        const incorporationCertificate = files.incorporationCertificateFile ? await cloudinary.uploader.upload(files.incorporationCertificateFile[0].path, { folder: 'vendor_documents' }) : null;
        const bankAccountCancelChequeFile = files.bankAccountCancelChequeFile ? await cloudinary.uploader.upload(files.bankAccountCancelChequeFile[0].path, { folder: 'vendor_documents' }) : null;
        const gstRegistrationCertificate = files.gstRegistrationCertificateFile ? await cloudinary.uploader.upload(files.gstRegistrationCertificateFile[0].path, { folder: 'vendor_documents' }) : null;
        const principalBusinessProof = files.principalBusinessProofFile ? await cloudinary.uploader.upload(files.principalBusinessProofFile[0].path, { folder: 'vendor_documents' }) : null;
        const msmeCertificate = files.msmeCertificateFile ? await cloudinary.uploader.upload(files.msmeCertificateFile[0].path, { folder: 'vendor_documents' }) : null;
        const pan = files.panFile ? await cloudinary.uploader.upload(files.panFile[0].path, { folder: 'vendor_documents' }) : null;

        // console.log("Uploading incorporation certificate:", bankAccountCancelChequeFile);
        // console.log("Incorporation Certificate Upload Result:", incorporationCertificate);



        // Updating vendor record with Cloudinary URLs and other form fields
        const vendor = await Vendor.findByIdAndUpdate(
            { _id: id },
            {
                status: "complete",
                incorporationCertificateFile: incorporationCertificate ? incorporationCertificate.secure_url : undefined,
                bankAccountCancelChequeFile: bankAccountCancelChequeFile ? bankAccountCancelChequeFile.secure_url : undefined,
                gstRegistrationCertificateFile: gstRegistrationCertificate ? gstRegistrationCertificate.secure_url : undefined,
                principalBusinessProofFile: principalBusinessProof ? principalBusinessProof.secure_url : undefined,
                msmeCertificateFile: msmeCertificate ? msmeCertificate.secure_url : undefined,
                panFile: pan ? pan.secure_url : undefined,
                // Other form fields from req.body
                companyName: body.companyName,
                proprietorName: body.proprietorName,
                businessNature: body.businessNature,
                turnoverInLakhs: body.turnoverInLakhs, // Convert to number or handle undefined,
                yearsInBusiness: body.yearsInBusiness,
                workspaceArea: body.workspaceArea,
                companyAddress: body.companyAddress,
                companyTelephone: body.companyTelephone,
                companyMobile: body.companyMobile,
                companyPersonEmail: body.companyPersonEmail,
                companyEmail: body.companyEmail,
                companyCountry: body.companyCountry,
                companyState: body.companyState,
                companyCity: body.companyCity,
                companyPin: body.companyPin,
                branchAddress: body.branchAddress,
                branchTelephone: body.branchTelephone,
                branchMobile: body.branchMobile,
                branchPersonEmail: body.branchPersonEmail,
                branchEmail: body.branchEmail,
                branchCountry: body.branchCountry,
                branchState: body.branchState,
                branchCity: body.branchCity,
                branchPin: body.branchPin,
                firmType: body.firmType,
                sisterConcernDetails: body.sisterConcernDetails,
                otherUnitsDetails: body.otherUnitsDetails,
                transactionWithOtherUnits: body.transactionWithOtherUnits,
                bankName: body.bankName,
                accountName: body.accountName,
                accountNumber: body.accountNumber,
                bankIFSC: body.bankIFSC,
                businessAddressProof: body.businessAddressProof,
                registeredMSME: body.registeredMSME,
                gstCertificate: body.gstCertificate,
            },
            { new: true }
        );

        if (!vendor) return res.status(404).json({ message: "Vendor not found." });
        res.status(200).json({ success: true, message: 'Vendor form submitted successfully...', vendor });

    } catch (error) {
        console.error("Error during vendor form submission:", error);
        res.status(500).json({ success: false, error: error, message: 'Vendor form submission failed...' });
    }
};


const getVendorById = async (req, res) => {
    try {
        const { id } = req.params;
        // console.log(id);

        // Check if the ID format is valid
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid vendor ID format' });
        }

        const vendor = await Vendor.findById(id);
        // console.log(vendor);

        if (!vendor) {
            return res.status(404).json({ success: false, message: 'failed to get vendor data' });
        }

        res.status(200).json({ success: true, message: 'vendor data find successfully...', vendor });
    } catch (error) {
        console.log("failed to get vendor data by id: ", error);
        res.status(500).json({ success: false, message: 'failed to get vendor data by id', error });
    }
}


const downloadVendorFileById = async (req, res) => {
    const { id, field } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid vendor ID format' });
        }

        const vendor = await Vendor.findById(id);
        if (!vendor) {
            return res.status(404).json({ success: false, message: 'Vendor not found' });
        }

        const fileUrl = vendor[field];  // Example: vendor['pdfFile'] or vendor['imageFile']
        if (!fileUrl) {
            return res.status(404).json({ success: false, message: 'File not found' });
        }

        // File extension se type detect karen
        const fileExtension = fileUrl.split('.').pop(); // last part after dot
        let contentType;

        // Dynamically MIME type set kare
        if (fileExtension === 'pdf') {
            contentType = 'application/pdf';
        } else if (['jpg', 'jpeg', 'png'].includes(fileExtension)) {
            contentType = 'image/jpeg'; // or 'image/png' depending on image format
        } else {
            contentType = 'application/octet-stream'; // Fallback for unknown types
        }

        // Set headers for download
        res.setHeader('Content-Disposition', `attachment; filename="${field}.${fileExtension}"`);
        res.setHeader('Content-Type', contentType);

        // File redirect kare Cloudinary par
        res.redirect(fileUrl);

        console.log(fileUrl);

    } catch (error) {
        console.log('Error downloading file:', error);
        res.status(500).json({ success: false, message: 'Error downloading file', error });
    }
};



const deleteVendorById = async (req, res) => {
    try {
        const { id } = req.params;
        const vendor = await Vendor.findByIdAndDelete({ _id: id });
        // console.log(vendor);

        if (!vendor) {
            res.status(404).json({ success: false, message: 'vendor deletion failed.' });
        }
        res.status(201).json({ success: true, message: 'vendor deletion successfully.' });
    } catch (error) {
        console.log("failed to delete vendor by id: ", error);
        res.status(404).json({ success: false, message: 'failed to delete vendor data by id', error })
    }
}

const approvedByPurchase = async (req, res) => {
    try {
        const { id } = req.params;
        const { purchaseType, purchaseCategory, paymentTerms } = req.body;

        console.log(id);
        console.log(purchaseType, purchaseCategory, paymentTerms);

        const vendor = await Vendor.findByIdAndUpdate(
            { _id: id },
            {
                purchaseType: purchaseType,
                purchaseCategory: purchaseCategory,
                paymentTerms: paymentTerms,
                status: "approved"
            },
            { new: true },
        );

        if (!vendor) {
            res.status(404).json({ success: false, message: 'faild to approved purcahase type, category, payment terms' });
            return
        }

        res.status(201).json({ success: true, message: 'approved by purchase department', vendor })

    } catch (error) {
        console.log("faild to approved by purchase ", error);
        res.status(404).json({ success: false, message: 'faild to approved by purchase', error })
    }
}

module.exports = {
    addVendor,
    vendorForm,
    getVendorsData,
    getVendorById,
    deleteVendorById,
    approvedByPurchase,
    downloadVendorFileById
}
