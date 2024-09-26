const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
    name: { type: String, default: '-', required: true },
    email: { type: String, default: '-', required: true },
    status: { type: String, default: "pending" }, // Default status as Pending
    formLink: { type: String, default: '-', }, // To store form link
    companyName: { type: String, default: '-',  },
    proprietorName: { type: String, default: '-',  },
    businessNature: { type: String, default: '-',  },
    turnoverInLakhs: { type: String,  },
    yearsInBusiness: { type: String,  },
    workspaceArea: { type: String, default: '-',  },
    companyAddress: { type: String, default: '-',  },
    companyTelephone: { type: String, default: '-', },
    companyMobile: { type: String, default: '-',  },
    companyPersonEmail: { type: String, default: '-',  },
    companyEmail: { type: String, default: '-',  },
    companyCountry: { type: String, default: '-',  },
    companyState: { type: String, default: '-',  },
    companyCity: { type: String, default: '-',  },
    companyPin: { type: String, default: '-',  },
    branchAddress: { type: String, default: '-', },
    branchTelephone: { type: String, default: '-', },
    branchMobile: { type: String, default: '-', },
    branchPersonEmail: { type: String, default: '-', }, 
    branchEmail: { type: String, default: '-', },
    branchCountry: { type: String, default: '-', }, 
    branchState: { type: String, default: '-', },
    branchCity: { type: String, default: '-', },
    branchPin: { type: String, default: '-', },
    firmType: { type: String, default: '-',  },
    sisterConcernDetails: { type: String, default: '-', },
    otherUnitsDetails: { type: String, default: '-', },
    transactionWithOtherUnits: { type: String, default: '-', },
    incorporationCertificate: { type: String, default: '-', },
    registeredMSME: { type: String, default: '-', },
    pan: { type: String, default: '-', },
    businessAddressProof: { type: String, default: '-', },
    bankAccountDetails: { type: String, default: '-', },
    gstCertificate: { type: String, default: '-', },
    bankName: { type: String, default: '-',  },
    accountName: { type: String, default: '-',  },
    accountNumber: { type: String, default: '-',  },
    bankIFSC: { type: String, default: '-',  },
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
        default: '-',
    },
    purchaseCategory: {
        type: String,
        default: '-',
    },
    paymentTerms: {
        type: String,
        default: '-',
    }
}, {
    timestamps: true
}
);

const vendor = mongoose.model("vendor_master", vendorSchema);

module.exports = vendor;
