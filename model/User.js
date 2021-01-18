const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        min: 1,
        max: 255
    },
    last_name: {
        type: String,
        required: true,
        min: 1,
        max: 255
    },
    email: {
        type: String,
        requiredL: true,
        min: 6,
        max: 255
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    }
});

module.exports = mongoose.model('User', userSchema);