const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    studentId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    department: { type: String, required: true },
    semester: { type: String, required: true },
    feeType: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['paid', 'pending', 'overdue'], default: 'pending' },
    paidDate: { type: Date },
    receiptNo: { type: String }
}, { timestamps: true });

studentSchema.index({ studentId: 1 });
studentSchema.index({ department: 1, semester: 1 });
studentSchema.index({ status: 1 });

module.exports = mongoose.model('Student', studentSchema);
