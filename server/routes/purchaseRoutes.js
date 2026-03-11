const express = require('express');
const Purchase = require('../models/Purchase');
const Vendor = require('../models/Vendor');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.use(protect);

// @route   GET /api/purchases
router.get('/', async (req, res) => {
    try {
        const purchases = await Purchase.find().sort({ date: -1 });
        const stats = {
            totalPurchases: await Purchase.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
            pendingPayments: await Purchase.aggregate([{ $match: { payment: 'pending' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
            activeVendors: await Vendor.countDocuments({ status: 'active' })
        };
        res.json({ purchases, stats });
    } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// @route   GET /api/purchases/vendors
router.get('/vendors', async (req, res) => {
    try {
        const vendors = await Vendor.find().sort({ vendorId: 1 });
        res.json(vendors);
    } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// @route   POST /api/purchases
router.post('/', authorize('accountant', 'admin'), async (req, res) => {
    try {
        const purchase = await Purchase.create(req.body);
        res.status(201).json(purchase);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

// @route   POST /api/purchases/vendors
router.post('/vendors', authorize('accountant', 'admin'), async (req, res) => {
    try {
        const vendor = await Vendor.create(req.body);
        res.status(201).json(vendor);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

// @route   PUT /api/purchases/:id
router.put('/:id', authorize('accountant', 'admin'), async (req, res) => {
    try {
        const purchase = await Purchase.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!purchase) return res.status(404).json({ message: 'Purchase not found' });
        res.json(purchase);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

// @route   DELETE /api/purchases/:id
router.delete('/:id', authorize('admin'), async (req, res) => {
    try {
        const purchase = await Purchase.findByIdAndDelete(req.params.id);
        if (!purchase) return res.status(404).json({ message: 'Purchase not found' });
        res.json({ message: 'Purchase deleted' });
    } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
