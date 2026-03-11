const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    empId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    designation: { type: String, required: true },
    department: { type: String, required: true },
    basicPay: { type: Number, required: true, min: 0 },
    hra: { type: Number, default: 0 },
    da: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    netPay: { type: Number, default: 0 }
}, { timestamps: true });

employeeSchema.index({ empId: 1 });
employeeSchema.index({ department: 1 });

module.exports = mongoose.model('Employee', employeeSchema);
