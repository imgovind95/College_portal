const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    voucher: { type: String, required: true, trim: true },
    particulars: { type: String, required: true },
    debit: { type: Number, default: 0 },
    credit: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    entryType: { type: String, enum: ['general', 'cashbook', 'bank'], default: 'general' },
    // For bank transactions
    txnId: { type: String },
    bank: { type: String },
    txnType: { type: String }
}, { timestamps: true });

ledgerSchema.index({ date: -1 });
ledgerSchema.index({ entryType: 1 });

module.exports = mongoose.model('Ledger', ledgerSchema);
