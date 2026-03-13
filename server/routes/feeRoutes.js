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

// @route   POST /api/fees/bulk-import
// @desc    Bulk import student fee records from CSV
router.post('/bulk-import', authorize('accountant', 'admin'), async (req, res) => {
    try {
        const { records } = req.body;
        if (!Array.isArray(records) || records.length === 0) {
            return res.status(400).json({ message: 'No records provided. Send { records: [...] }' });
        }

        const requiredFields = ['studentId', 'name', 'department', 'semester', 'feeType', 'amount'];
        const validStatuses = ['paid', 'pending', 'overdue'];
        const errors = [];
        const validRecords = [];

        for (let i = 0; i < records.length; i++) {
            const r = records[i];
            const missing = requiredFields.filter(f => !r[f] && r[f] !== 0);
            if (missing.length > 0) {
                errors.push({ row: i + 1, message: `Missing fields: ${missing.join(', ')}` });
                continue;
            }
            const amount = Number(r.amount);
            if (isNaN(amount) || amount < 0) {
                errors.push({ row: i + 1, message: 'Invalid amount' });
                continue;
            }
            validRecords.push({
                studentId: String(r.studentId).trim(),
                name: String(r.name).trim(),
                department: String(r.department).trim(),
                semester: String(r.semester).trim(),
                feeType: String(r.feeType).trim(),
                amount,
                status: validStatuses.includes(String(r.status || '').toLowerCase()) ? String(r.status).toLowerCase() : 'pending'
            });
        }

        let inserted = 0;
        let duplicates = 0;
        if (validRecords.length > 0) {
            try {
                const result = await Student.insertMany(validRecords, { ordered: false });
                inserted = result.length;
            } catch (bulkErr) {
                if (bulkErr.code === 11000 || (bulkErr.writeErrors && bulkErr.writeErrors.length)) {
                    // Some inserted, some duplicates
                    inserted = bulkErr.insertedDocs ? bulkErr.insertedDocs.length : (validRecords.length - (bulkErr.writeErrors ? bulkErr.writeErrors.length : 0));
                    duplicates = bulkErr.writeErrors ? bulkErr.writeErrors.length : 0;
                } else {
                    throw bulkErr;
                }
            }
        }

        res.json({
            message: 'Bulk import completed',
            total: records.length,
            inserted,
            duplicates,
            validationErrors: errors.length,
            errors: errors.slice(0, 20) // send max 20 error details
        });
    } catch (err) {
        console.error('Bulk import error:', err);
        res.status(500).json({ message: 'Bulk import failed: ' + err.message });
    }
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
