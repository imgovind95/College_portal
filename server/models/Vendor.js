const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    vendorId: { type: String, required: true, unique: true, trim: true },
    company: { type: String, required: true, trim: true },
    contact: { type: String, required: true },
    category: { type: String, required: true },
    totalOrders: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

vendorSchema.index({ vendorId: 1 });

module.exports = mongoose.model('Vendor', vendorSchema);
