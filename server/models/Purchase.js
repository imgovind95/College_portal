const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    poNumber: { type: String, required: true, unique: true, trim: true },
    date: { type: Date, required: true },
    vendor: { type: String, required: true },
    category: { type: String, required: true },
    items: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    payment: { type: String, enum: ['paid', 'pending', 'partial'], default: 'pending' }
}, { timestamps: true });

purchaseSchema.index({ poNumber: 1 });
purchaseSchema.index({ date: -1 });

module.exports = mongoose.model('Purchase', purchaseSchema);
