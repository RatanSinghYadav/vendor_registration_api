const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
    name: { type: String, default: null, required: true },
    email: { type: String, default: null, required: true },
    status: { type: String, default: "pending" }, // Default status as Pending
    approveBankDetail: { type: String, default: "pending" },
    vendorApproved: { type: String, default: "pending" },
    formLink: { type: String, default: null, }, // To store form link
    // Company Profile
    vendorCode: { type: String, default: null },
    companyName: { type: String, default: null, },
    proprietorName: { type: String, default: null, },
    businessNature: { type: String, default: null, },
    turnoverInLakhs: { type: String, },
    yearsInBusiness: { type: String, },
    workspaceArea: { type: String, default: null, },
    // Corporate/registerd office Postal Address
    companyMobile: { type: String, default: null, },
    companyTelephone: { type: String, default: null, },
    companyPersonEmail: { type: String, default: null, },
    companyEmail: { type: String, default: null, },
    companyCountry: { type: String, default: null, },
    companyState: { type: String, default: null, },
    companyCity: { type: String, default: null, },
    companyPin: { type: String, default: null, },
    companyAddress: { type: String, default: null, },
    // Name and address of local representative
    branchMobile: { type: String, default: null, },
    branchTelephone: { type: String, default: null, },
    branchPersonEmail: { type: String, default: null, },
    branchEmail: { type: String, default: null, },
    branchCountry: { type: String, default: null, },
    branchState: { type: String, default: null, },
    branchCity: { type: String, default: null, },
    branchPin: { type: String, default: null, },
    branchAddress: { type: String, default: null, },
    // Bank Details
    bankName: { type: String, default: null, },
    accountName: { type: String, default: null, },
    accountNumber: { type: String, default: null, },
    confirmAccountNumber: { type: String, default: null },
    bankIFSC: { type: String, default: null, },
    // Company other Details
    firmType: { type: String, default: null, },
    sisterConcernDetails: { type: String, default: null, },
    otherUnitsDetails: { type: String, default: null, },
    transactionWithOtherUnits: { type: String, default: null, },
    // documents details
    incorporationCertificate: { type: String, default: null, },
    registeredMSME: { type: String, default: null, },
    pan: { type: String, default: null, },
    businessAddressProof: { type: String, default: null, },
    bankAccountDetails: { type: String, default: null, },
    gstCertificate: { type: String, default: null, },
    // 
    // New fields for file uploads
    incorporationCertificateFile: {
        type: String,
        default: null, // Path to the file

    },
    bankAccountCancelChequeFile: {
        type: String,
        default: null,

    },
    gstRegistrationCertificateFile: {
        type: String,
        default: null,

    },
    principalBusinessProofFile: {
        type: String,
        default: null,

    },
    msmeCertificateFile: {
        type: String,
        default: null,

    },
    panFile: {
        type: String,
        default: null,

    },
    // For BBPL use only
    purchaseType: {
        type: String,
        default: null,
    },
    purchaseCategory: {
        type: String,
        default: null,
    },
    paymentTerms: {
        type: String,
        default: null,
    },
    vendorApprovedBy: {
        type: String,
        default: null
    },
    vendorRequestedPerson: {
        type: String,
        default: null
    },
    vendorRequestedPersonNum: {
        type: String,
        default: null
    },
    vendorType: {
        type: String,
        enum: ['LE2', 'BRLY', 'Admin'],
        default: null
    },
    // 
    approvedByFinance: {
        type: String,
        default: null,
    },
    vendorTDS: {
        type: String,
        default: null
    },
    remark: {
        type: String,
        default: null,
    }, 
}, {
    timestamps: true
}
);

const vendor = mongoose.model("vendor_master", vendorSchema);

module.exports = vendor;
