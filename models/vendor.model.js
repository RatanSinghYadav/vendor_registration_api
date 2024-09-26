const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VendorRegistration = sequelize.define('VendorRegistration', {
    VendorID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    CompanyName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    CorporateAddress: DataTypes.STRING,
    OfficeTelephone: DataTypes.STRING,
    OfficeMobile: DataTypes.STRING,
    ContactEmail: DataTypes.STRING,
    FinanceEmail: DataTypes.STRING,
    BusinessNature: DataTypes.STRING,
    TurnoverInLakhs: DataTypes.DECIMAL(18, 2),
    YearsInBusiness: DataTypes.INTEGER,
    WorkspaceAreaSqFt: DataTypes.STRING,
    LocalRepName: DataTypes.STRING,
    LocalRepAddress: DataTypes.STRING,
    LocalRepTelephone: DataTypes.STRING,
    LocalRepMobile: DataTypes.STRING,
    LocalRepEmail: DataTypes.STRING,
    ProprietorNames: DataTypes.STRING,
    FirmType: DataTypes.STRING,
    IncorporationCertificate: DataTypes.STRING,
    BankAccountName: DataTypes.STRING,
    BankName: DataTypes.STRING,
    BankAccountNumber: DataTypes.STRING,
    BankIFSC: DataTypes.STRING,
    MSMERegistered: DataTypes.BOOLEAN,
    MSMERegistrationNumber: DataTypes.STRING,
    PAN: DataTypes.STRING,
    GSTRegistration: DataTypes.STRING,
    BusinessAddressProof: DataTypes.STRING,
    HasSisterConcern: DataTypes.BOOLEAN,
    SisterConcernDetails: DataTypes.STRING,
    TransactionsWithOtherUnits: DataTypes.BOOLEAN,
    OtherUnitsDetails: DataTypes.STRING,
    EmployeeRelation: DataTypes.BOOLEAN,
    EmployeeRelationDetails: DataTypes.STRING,
    SubmissionPlace: DataTypes.STRING,
    SubmissionDate: DataTypes.DATEONLY,
    AuthorizedSignatory: DataTypes.STRING
}, {
    tableName: 'VendorRegistration',
    timestamps: false
});

// module.exports = VendorRegistration;
