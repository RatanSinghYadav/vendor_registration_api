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
        accountName, accountNumber, confirmAccountNumber, bankIFSC, bankAccountCancelChequeFile, incorporationCertificateFile,
        gstRegistrationCertificateFile, principalBusinessProofFile, msmeCertificateFile, purchaseType,
        purchaseCategory, paymentTerms, vendorApprovedBy, vendorType,
    } = req.body;
    try {
        // console.log(name, email)

        const formLink = `https://vendor-registration-app.onrender.com/vendor/form/${email}`;

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
            confirmAccountNumber, bankIFSC, bankAccountCancelChequeFile, incorporationCertificateFile,
            gstRegistrationCertificateFile, principalBusinessProofFile, msmeCertificateFile,
            purchaseType, purchaseCategory, paymentTerms, vendorApprovedBy, vendorType,
            formLink // Also adding formLink to the vendor
        });

        const vendor = await newVendor.save();


        // console.log(vendor)

        const vendorLink = `https://vendor-registration-app.onrender.com/vendor/form/${vendor._id}`

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
            html: `
            <!DOCTYPE html>
                    <html>
                      <head>
                        <link href="https://fonts.cdnfonts.com/css/coca-cola-ii" rel="stylesheet">
                      </head>
                      <body>
                          <p>Dear Vendor,</p>
                            <p>We hope this email finds you well.</p>
                            <p>Please click on the link below to complete the vendor registration form. Note that this link will be valid for only 24 hours.</p>
                            <p>Please fill out this Vendor Registration Form: <a href="${vendorLink}">Form Link</a></p>
                            
                            <p>Thank you for your cooperation.</p>
                            
                            <!-- Signature Section -->
                            <p style="font-size:16px; font-weight:bold; color:#e60000; margin-top:20px;">
                                Thanks & Regards,
                            </p>
                            
                            <p style="font-size:16px; font-weight:bold; color:#e60000; margin-bottom:0;">
                                B-54-58, Brindavan Beverages Pvt Ltd.<br/>
                                Parsakhera Industrial Area, Parsakhera<br>
                                Bareilly (UP) PIN-243502
                            </p>
                            
                            <!-- Logos/Text Representation -->
                            <div style="margin-top:20px;">
                                <span style="font-size:50px; font-style:italic; color:#e60000; font-family: 'Coca Cola ii', freestyle script; margin-right:10px;">
                                  Coca-Cola
                                </span>
                                <span style="font-size:50px;">|</span>
                                <span style="font-size:50px; color:#ffcc00; font-weight:bold; margin-right:10px;">SLMG Beverages</span>
                                <span style="font-size:50px;">|</span>
                                <span style="font-size:40px; color:#ff0000; font-weight:bold;">We are Great Place To Work Certified™</span>
                            </div>
                      </body>
                    </html>
            `,

        };

        await transporter.sendMail(mailOptions);
        return res.status(201).json({ success: true, message: "Vendor added and email sent." }); // Ensure you are sending a response
    } catch (error) {
        return res.status(500).json({ success: false, error: error }); // Ensure you are sending a response in catch block
    }
};

// Get all vendors data

const getAllVendorsData = async (req, res) => {
    try {
        const vendor = await Vendor.find().sort({ createdAt: -1 });
        // console.log(vendor);
        res.status(201).json({ success: true, message: 'vendors data find successfuly...', vendor });
    } catch (error) {
        res.status(404).json({ success: false, message: 'failed to get vendors data.' })
        console.log('failed to get vendors data.', error)
    }
}

const getVendorsData = async (req, res) => {
    try {
        const userRole = req.params.role;

        // console.log(userRole);

        let filter = {};
        if (userRole === 'LE2') {
            filter.vendorType = 'LE2';
        } else if (userRole === 'BRLY') {
            filter.vendorType = 'BRLY';
        }

        const vendor = await Vendor.find(filter).sort({ createdAt: -1 });
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

    const vendorExist = Vendor.findById({ _id: id });
    console.log(vendorExist);

    try {

        // Upload all required files to Cloudinary
        const incorporationCertificate = files.incorporationCertificateFile
            ? await cloudinary.uploader.upload(files.incorporationCertificateFile[0].path, {
                folder: 'vendor_documents',
                resource_type: "auto" // Ensure auto files like PDFs can be uploaded
            })
            : null;

        const bankAccountCancelChequeFile = files.bankAccountCancelChequeFile
            ? await cloudinary.uploader.upload(files.bankAccountCancelChequeFile[0].path, {
                folder: 'vendor_documents',
                resource_type: "auto"
            })
            : null;

        const gstRegistrationCertificate = files.gstRegistrationCertificateFile
            ? await cloudinary.uploader.upload(files.gstRegistrationCertificateFile[0].path, {
                folder: 'vendor_documents',
                resource_type: "auto"
            })
            : null;

        const principalBusinessProof = files.principalBusinessProofFile
            ? await cloudinary.uploader.upload(files.principalBusinessProofFile[0].path, {
                folder: 'vendor_documents',
                resource_type: "auto"
            })
            : null;

        const msmeCertificate = files.msmeCertificateFile
            ? await cloudinary.uploader.upload(files.msmeCertificateFile[0].path, {
                folder: 'vendor_documents',
                resource_type: "auto"
            })
            : null;

        const pan = files.panFile
            ? await cloudinary.uploader.upload(files.panFile[0].path, {
                folder: 'vendor_documents',
                resource_type: "auto"
            })
            : null;

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
                confirmAccountNumber: body.confirmAccountNumber,
                bankIFSC: body.bankIFSC,
                businessAddressProof: body.businessAddressProof,
                registeredMSME: body.registeredMSME,
                pan: body.pan,
                bankAccountDetails: body.bankAccountDetails,
                incorporationCertificate: body.incorporationCertificate,
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

        // console.log(fileUrl);

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

const bankDetailApproved = async (req, res) => {
    try {
        const { id } = req.params;
        // console.log(id);

        const vendor = await Vendor.findByIdAndUpdate({ _id: id }, { approveBankDetail: "approved" }, { new: true });

        if (!vendor) {
            res.status(404).json({ success: false, message: 'faild to approved bank detail!' });
            return
        }

        res.status(201).json({ success: true, message: 'approved by purchase department', vendor })
    } catch (error) {
        console.log("faild to approve bank details ", error);
        res.status(404).json({ success: false, message: 'faild to approve bank details', error })
    }
}

const vendorApproved = async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;
        // console.log(id);

        const vendor = await Vendor.findByIdAndUpdate(
            { _id: id },
            {
                approvedByFinance: body.approvedByFinance,
                remark: body.remark,
                vendorApproved: "approved",
                status: "approved"
            },
            { new: true });

        if (!vendor) {
            res.status(404).json({ success: false, message: 'faild to approved vendor' });
            return
        }

        res.status(201).json({ success: true, message: 'approved by purchase department', vendor })
    } catch (error) {
        console.log("faild to approve bank details ", error);
        res.status(404).json({ success: false, message: 'faild to approve bank details', error })
    }
}

const approvedByPurchase = async (req, res) => {
    try {
        const { id } = req.params;
        const { purchaseType, purchaseCategory, paymentTerms, vendorApprovedBy } = req.body;

        // console.log(id);
        // console.log(purchaseType, purchaseCategory, paymentTerms, vendorApprovedBy);

        const vendor = await Vendor.findByIdAndUpdate(
            { _id: id },
            {
                purchaseType: purchaseType,
                purchaseCategory: purchaseCategory,
                paymentTerms: paymentTerms,
                vendorApprovedBy: vendorApprovedBy,
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


const editVendorDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;

        console.log(body.vendorName);

        // console.log(
        //     id,
        //     // Company Profile
        //     body.vendorCode,
        //     body.companyName,
        //     body.proprietorName,
        //     body.businessNature,
        //     body.turnoverInLakhs,
        //     body.yearsInBusiness,
        //     body.workspaceArea,
        //     // Corporate/registerd office Postal Address
        //     body.companyMobile,
        //     body.companyTelephone,
        //     body.companyPersonEmail,
        //     body.companyEmail,
        //     body.companyCountry,
        //     body.companyState,
        //     body.companyCity,
        //     body.companyPin,
        //     body.companyAddress,
        //     // Name and address of local representative
        //     body.branchMobile,
        //     body.branchTelephone,
        //     body.branchPersonEmail,
        //     body.branchEmail,
        //     body.branchCountry,
        //     body.branchState,
        //     body.branchCity,
        //     body.branchPin,
        //     body.branchAddress,
        //     // Bank Details
        //     body.bankName,
        //     body.accountName,
        //     body.accountNumber,
        //     body.confirmAccountNumber,
        //     body.bankIFSC,
        //     // Company other Details
        //     body.firmType,
        //     body.sisterConcernDetails, 
        //     body.otherUnitsDetails, 
        //     body.transactionWithOtherUnits,
        //     // documents details 
        //     body.incorporationCertificate,
        //     body.registeredMSME,
        //     body.pan,
        //     body.businessAddressProof,
        //     body.bankAccountDetails,
        //     body.gstCertificate,
        //     // For BBPL use only
        //     body.purchaseType,
        //     body.purchaseCategory,
        //     body.paymentTerms, 
        //     body.vendorApprovedBy,
        // )

        // Ensure that the ID is valid and provided
        if (!id) {
            return res.status(400).json({ success: false, message: 'Vendor ID is required' });
        }

        // Update vendor details with PATCH method
        const vendor = await Vendor.findByIdAndUpdate(
            { _id: id }, // ID filter
            {
                // Company Profile
                vendorCode: req.body.vendorCode,
                name: req.body.vendorName,
                companyName: req.body.companyName,
                proprietorName: req.body.proprietorName,
                businessNature: req.body.businessNature,
                turnoverInLakhs: req.body.turnoverInLakhs,
                yearsInBusiness: req.body.yearsInBusiness,
                workspaceArea: req.body.workspaceArea,
                // Corporate/registerd office Postal Address
                companyMobile: req.body.companyMobile,
                companyTelephone: req.body.companyTelephone,
                companyPersonEmail: req.body.companyPersonEmail,
                companyEmail: req.body.companyEmail,
                companyCountry: req.body.companyCountry,
                companyState: req.body.companyState,
                companyCity: req.body.companyCity,
                companyPin: req.body.companyPin,
                companyAddress: req.body.companyAddress,
                // Name and address of local representative
                branchMobile: req.body.branchMobile,
                branchTelephone: req.body.branchTelephone,
                branchPersonEmail: req.body.branchPersonEmail,
                branchEmail: req.body.branchEmail,
                branchCountry: req.body.branchCountry,
                branchState: req.body.branchState,
                branchCity: req.body.branchCity,
                branchPin: req.body.branchPin,
                branchAddress: req.body.branchAddress,
                // Bank Details
                bankName: req.body.bankName,
                accountName: req.body.accountName,
                accountNumber: req.body.accountNumber,
                confirmAccountNumber: req.body.confirmAccountNumber,
                bankIFSC: req.body.bankIFSC,
                // Company other Details
                firmType: req.body.firmType,
                sisterConcernDetails: req.body.sisterConcernDetails,
                otherUnitsDetails: req.body.otherUnitsDetails,
                transactionWithOtherUnits: req.body.transactionWithOtherUnits,
                // documents details
                incorporationCertificate: req.body.incorporationCertificate,
                registeredMSME: req.body.registeredMSME,
                pan: req.body.pan,
                businessAddressProof: req.body.businessAddressProof,
                bankAccountDetails: req.body.bankAccountDetails,
                gstCertificate: req.body.gstCertificate,
                // For BBPL use only
                purchaseType: req.body.purchaseType,
                purchaseCategory: req.body.purchaseCategory,
                paymentTerms: req.body.paymentTerms,
                vendorApprovedBy: req.body.vendorApprovedBy,
            },
            { new: true, runValidators: true } // Ensures updated doc is returned and validations run
        );

        // If vendor not found
        if (!vendor) {
            return res.status(404).json({ success: false, message: 'Vendor not found' });
        }

        // Successfully updated
        res.status(200).json({ success: true, message: 'Vendor details updated successfully', vendor });

    } catch (error) {
        console.error("Failed to update vendor details", error);
        res.status(500).json({ success: false, message: 'Failed to update vendor details', error });
    }
};


const updateVendorCode = async (req, res) => {
    const { id } = req.params;
    const body = req.body;

    // console.log(id);
    // console.log(body.vendorCode);

    // Ensure that the ID is valid and provided
    if (!id) {
        return res.status(400).json({ success: false, message: 'Vendor ID is required' });
    }

    // Update vendor code with PATCH method

    const vendor = await Vendor.findByIdAndUpdate(
        { _id: id },
        { vendorCode: req.body.vendorCode },
        { new: true, runValidators: true }
    )

    // If vendor not found
    if (!vendor) {
        return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    // Successfully updated
    res.status(200).json({ success: true, message: 'Vendor details updated successfully', vendor });

}


module.exports = {
    addVendor,
    vendorForm,
    getVendorsData,
    getVendorById,
    deleteVendorById,
    approvedByPurchase,
    downloadVendorFileById,
    bankDetailApproved,
    vendorApproved,
    editVendorDetails,
    getAllVendorsData,
    updateVendorCode
}
