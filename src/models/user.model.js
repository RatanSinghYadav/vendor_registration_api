const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        default: null
    },
    email: {
        type: String,
        required: true,
        trim: true,
        default: null
    },
    phone: {
        type: String,
        trim: true,
        default: null
    },
    password: {
        type: String,
        trim: true,
        required: true,
        default: null
    },
    role: {
        type: String,
        enum: ['LE2', 'BRLY', "Admin"],
        default: null
    },
    vendors: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vendor_master'
    }
},
    {
        timestamps: true
    }
)

const users = mongoose.model("user_master", userSchema)

module.exports = users;