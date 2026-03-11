const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    scheme: { type: String, required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    eligible: { type: Boolean, default: true },
    status: { type: String, enum: ['disbursed', 'pending', 'rejected'], default: 'pending' },
    department: { type: String },
    semester: { type: String },
    rollNo: { type: String }
}, { timestamps: true });

scholarshipSchema.index({ status: 1 });

module.exports = mongoose.model('Scholarship', scholarshipSchema);
