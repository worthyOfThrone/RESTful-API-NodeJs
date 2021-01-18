const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    organisation_name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
});


module.exports = mongoose.model('Employee', employeeSchema);