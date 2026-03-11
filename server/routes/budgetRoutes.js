const express = require('express');
const Expense = require('../models/Expense');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.use(protect);

// @route   GET /api/budget
router.get('/', async (req, res) => {
    try {
        const { category, status } = req.query;
        let query = {};
        if (category) query.category = category;
        if (status) query.status = status;
        const expenses = await Expense.find(query).sort({ date: -1 });
        const stats = {
            totalExpenses: await Expense.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
            categoryBreakdown: await Expense.aggregate([{ $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } }])
        };
        res.json({ expenses, stats });
    } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// @route   POST /api/budget
router.post('/', authorize('accountant', 'admin'), async (req, res) => {
    try {
        const expense = await Expense.create(req.body);
        res.status(201).json(expense);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

// @route   PUT /api/budget/:id
router.put('/:id', authorize('accountant', 'admin'), async (req, res) => {
    try {
        const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!expense) return res.status(404).json({ message: 'Expense not found' });
        res.json(expense);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

// @route   DELETE /api/budget/:id
router.delete('/:id', authorize('admin'), async (req, res) => {
    try {
        const expense = await Expense.findByIdAndDelete(req.params.id);
        if (!expense) return res.status(404).json({ message: 'Expense not found' });
        res.json({ message: 'Expense deleted' });
    } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
