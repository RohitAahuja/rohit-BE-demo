const mongoose = require('mongoose');
// const mongooseTypePhone = require('mongoose-type-phone');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required!!!',
    },
    phone: {
        type: Number,
        required: 'Phone number should be set correctly!!!',
        allowBlank: false,
        // allowedNumberTypes: [mongooseTypePhone.PhoneNumberType.MOBILE],
        // parseOnGet: false
    },
    password: {
        type: String,   
        required: true,
        trim: true,
    },
    customers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Customer',
            default: []
        }
    ]
})

module.exports = mongoose.model('User', userSchema);