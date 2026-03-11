const express = require('express');
const Student = require('../models/Student');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/fees
router.get('/', async (req, res) => {
    try {
        const { department, semester, status, search } = req.query;
        let query = {};
        if (department) query.department = department;
        if (semester) query.semester = semester;
        if (status) query.status = status;
        if (search) query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { studentId: { $regex: search, $options: 'i' } }
        ];
        const students = await Student.find(query).sort({ createdAt: -1 });
        const stats = {
            totalCollected: await Student.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
            pendingAmount: await Student.aggregate([{ $match: { status: 'pending' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
            overdueAmount: await Student.aggregate([{ $match: { status: 'overdue' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
            totalStudents: await Student.countDocuments()
        };
        res.json({ students, stats });
    } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// @route   POST /api/fees
router.post('/', authorize('accountant', 'admin'), async (req, res) => {
    try {
        const student = await Student.create(req.body);
        res.status(201).json(student);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

// @route   PUT /api/fees/:id
router.put('/:id', authorize('accountant', 'admin'), async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.json(student);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

// @route   DELETE /api/fees/:id
router.delete('/:id', authorize('admin'), async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.json({ message: 'Record deleted' });
    } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
