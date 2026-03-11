const express = require('express');
const Scholarship = require('../models/Scholarship');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.use(protect);

// @route   GET /api/scholarships
router.get('/', async (req, res) => {
    try {
        const scholarships = await Scholarship.find().sort({ createdAt: -1 });
        const stats = {
            totalDisbursed: await Scholarship.aggregate([{ $match: { status: 'disbursed' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
            totalPending: await Scholarship.aggregate([{ $match: { status: 'pending' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
            beneficiaries: await Scholarship.countDocuments({ status: 'disbursed' }),
            schemeBreakdown: await Scholarship.aggregate([{ $group: { _id: '$scheme', total: { $sum: '$amount' }, count: { $sum: 1 } } }])
        };
        res.json({ scholarships, stats });
    } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// @route   POST /api/scholarships
router.post('/', authorize('accountant', 'admin'), async (req, res) => {
    try {
        const scholarship = await Scholarship.create(req.body);
        res.status(201).json(scholarship);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

// @route   PUT /api/scholarships/:id
router.put('/:id', authorize('accountant', 'admin'), async (req, res) => {
    try {
        const scholarship = await Scholarship.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!scholarship) return res.status(404).json({ message: 'Scholarship not found' });
        res.json(scholarship);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

// @route   DELETE /api/scholarships/:id
router.delete('/:id', authorize('admin'), async (req, res) => {
    try {
        const scholarship = await Scholarship.findByIdAndDelete(req.params.id);
        if (!scholarship) return res.status(404).json({ message: 'Scholarship not found' });
        res.json({ message: 'Scholarship deleted' });
    } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
