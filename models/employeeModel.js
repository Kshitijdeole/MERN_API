const mongoose = require('mongoose');
const { isEmail } = require('validator');

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [isEmail, 'Invalid email']
    },
    mobileNo: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /\d{10}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
    },
    designation: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    course: { type: String, required: true },
    image: { type: String },
    createDate: { type: Date, default: Date.now },
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
