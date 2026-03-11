const express = require('express');
const Student = require('../models/Student');
const Employee = require('../models/Employee');
const Expense = require('../models/Expense');
const Purchase = require('../models/Purchase');
const Scholarship = require('../models/Scholarship');
const Ledger = require('../models/Ledger');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.use(protect);

// @route   GET /api/audit/dashboard
// @desc    Get dashboard overview statistics
router.get('/dashboard', async (req, res) => {
    try {
        const [feesCollected, pendingFees, totalSalary, budgetSpent, scholarshipsDisbursed] = await Promise.all([
            Student.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
            Student.aggregate([{ $match: { status: { $in: ['pending', 'overdue'] } } }, { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }]),
            Employee.aggregate([{ $group: { _id: null, total: { $sum: '$netPay' } } }]),
            Expense.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
            Scholarship.aggregate([{ $match: { status: 'disbursed' } }, { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }])
        ]);
        res.json({
            feesCollected: feesCollected[0]?.total || 0,
            pendingFees: pendingFees[0]?.total || 0,
            pendingStudents: pendingFees[0]?.count || 0,
            totalSalary: totalSalary[0]?.total || 0,
            budgetSpent: budgetSpent[0]?.total || 0,
            scholarshipsDisbursed: scholarshipsDisbursed[0]?.total || 0,
            scholarshipBeneficiaries: scholarshipsDisbursed[0]?.count || 0
        });
    } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// @route   GET /api/audit/reports
// @desc    Get audit summary for reports
router.get('/reports', async (req, res) => {
    try {
        const [revenue, expenses, recentLedger] = await Promise.all([
            Student.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
            Expense.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
            Ledger.find({ entryType: 'general' }).sort({ date: -1 }).limit(20)
        ]);
        res.json({
            totalRevenue: revenue[0]?.total || 0,
            totalExpenses: expenses[0]?.total || 0,
            netSurplus: (revenue[0]?.total || 0) - (expenses[0]?.total || 0),
            recentLedger
        });
    } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
