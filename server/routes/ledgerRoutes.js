const express = require('express');
const Ledger = require('../models/Ledger');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.use(protect);

// @route   GET /api/ledger
router.get('/', async (req, res) => {
    try {
        const { type } = req.query; // general, cashbook, bank
        let query = {};
        if (type) query.entryType = type;
        const entries = await Ledger.find(query).sort({ date: -1 });
        res.json(entries);
    } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// @route   POST /api/ledger
router.post('/', authorize('accountant', 'admin'), async (req, res) => {
    try {
        const entry = await Ledger.create(req.body);
        res.status(201).json(entry);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

// @route   PUT /api/ledger/:id
router.put('/:id', authorize('accountant', 'admin'), async (req, res) => {
    try {
        const entry = await Ledger.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!entry) return res.status(404).json({ message: 'Entry not found' });
        res.json(entry);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

module.exports = router;
