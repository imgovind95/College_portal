const express = require('express');
const Employee = require('../models/Employee');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.use(protect);

// @route   GET /api/payroll
router.get('/', async (req, res) => {
    try {
        const { department, search } = req.query;
        let query = {};
        if (department) query.department = department;
        if (search) query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { empId: { $regex: search, $options: 'i' } }
        ];
        const employees = await Employee.find(query).sort({ empId: 1 });
        const stats = {
            totalPayroll: await Employee.aggregate([{ $group: { _id: null, total: { $sum: '$netPay' } } }]),
            totalEmployees: await Employee.countDocuments(),
            totalDeductions: await Employee.aggregate([{ $group: { _id: null, total: { $sum: '$deductions' } } }])
        };
        res.json({ employees, stats });
    } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// @route   POST /api/payroll
router.post('/', authorize('accountant', 'admin'), async (req, res) => {
    try {
        const emp = await Employee.create(req.body);
        res.status(201).json(emp);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

// @route   PUT /api/payroll/:id
router.put('/:id', authorize('accountant', 'admin'), async (req, res) => {
    try {
        const emp = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!emp) return res.status(404).json({ message: 'Employee not found' });
        res.json(emp);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

// @route   DELETE /api/payroll/:id
router.delete('/:id', authorize('admin'), async (req, res) => {
    try {
        const emp = await Employee.findByIdAndDelete(req.params.id);
        if (!emp) return res.status(404).json({ message: 'Employee not found' });
        res.json({ message: 'Employee deleted' });
    } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
