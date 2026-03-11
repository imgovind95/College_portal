// ==========================================
// Seed Script — Populates database with sample data
// Run: npm run seed
// ==========================================

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Student = require('./models/Student');
const Employee = require('./models/Employee');
const Expense = require('./models/Expense');
const Purchase = require('./models/Purchase');
const Vendor = require('./models/Vendor');
const Scholarship = require('./models/Scholarship');
const Ledger = require('./models/Ledger');

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await Promise.all([
            User.deleteMany(), Student.deleteMany(), Employee.deleteMany(),
            Expense.deleteMany(), Purchase.deleteMany(), Vendor.deleteMany(),
            Scholarship.deleteMany(), Ledger.deleteMany()
        ]);
        console.log('🗑️  Cleared existing data');

        // === USERS (Passwords hashed by pre-save hook) ===
        await User.create([
            { name: 'Admin User', email: 'admin@college.edu', password: 'Admin@123', role: 'admin' },
            { name: 'Accountant', email: 'accountant@college.edu', password: 'Account@123', role: 'accountant' },
            { name: 'Auditor', email: 'auditor@college.edu', password: 'Audit@123', role: 'auditor' }
        ]);
        console.log('✅ Users seeded (3)');

        // === STUDENTS ===
        await Student.create([
            { studentId: 'STU-2026-001', name: 'Aarav Sharma', department: 'Computer Science', semester: 'Semester 4', feeType: 'Tuition Fee', amount: 24500, status: 'paid' },
            { studentId: 'STU-2026-002', name: 'Priya Patel', department: 'Electronics', semester: 'Semester 2', feeType: 'Tuition Fee', amount: 22000, status: 'pending' },
            { studentId: 'STU-2026-003', name: 'Rohit Kumar', department: 'Mechanical', semester: 'Semester 6', feeType: 'Exam Fee', amount: 5500, status: 'paid' },
            { studentId: 'STU-2026-004', name: 'Sanya Gupta', department: 'Computer Science', semester: 'Semester 2', feeType: 'Lab Fee', amount: 8000, status: 'overdue' },
            { studentId: 'STU-2026-005', name: 'Vikram Singh', department: 'Civil', semester: 'Semester 4', feeType: 'Tuition Fee', amount: 24500, status: 'paid' },
            { studentId: 'STU-2026-006', name: 'Neha Agarwal', department: 'Commerce', semester: 'Semester 2', feeType: 'Admission Fee', amount: 15000, status: 'pending' },
            { studentId: 'STU-2026-007', name: 'Amit Verma', department: 'Electronics', semester: 'Semester 4', feeType: 'Tuition Fee', amount: 22000, status: 'paid' },
            { studentId: 'STU-2026-008', name: 'Divya Mishra', department: 'Computer Science', semester: 'Semester 6', feeType: 'Tuition Fee', amount: 24500, status: 'overdue' }
        ]);
        console.log('✅ Students seeded (8)');

        // === EMPLOYEES ===
        await Employee.create([
            { empId: 'EMP-001', name: 'Dr. Rajesh Gupta', designation: 'Professor', department: 'Computer Science', basicPay: 95000, hra: 19000, da: 14250, deductions: 18500, netPay: 109750 },
            { empId: 'EMP-002', name: 'Dr. Priya Mehta', designation: 'Associate Professor', department: 'Electronics', basicPay: 78000, hra: 15600, da: 11700, deductions: 15200, netPay: 90100 },
            { empId: 'EMP-003', name: 'Mr. Anil Verma', designation: 'Assistant Professor', department: 'Mechanical', basicPay: 62000, hra: 12400, da: 9300, deductions: 12100, netPay: 71600 },
            { empId: 'EMP-004', name: 'Ms. Sunita Roy', designation: 'Lab Assistant', department: 'Computer Science', basicPay: 35000, hra: 7000, da: 5250, deductions: 6800, netPay: 40450 },
            { empId: 'EMP-005', name: 'Mr. Deepak Jha', designation: 'Professor', department: 'Civil', basicPay: 95000, hra: 19000, da: 14250, deductions: 18500, netPay: 109750 },
            { empId: 'EMP-006', name: 'Ms. Kavita Nair', designation: 'Clerk', department: 'Administration', basicPay: 28000, hra: 5600, da: 4200, deductions: 5400, netPay: 32400 },
            { empId: 'EMP-007', name: 'Dr. Suresh Iyer', designation: 'Professor', department: 'Electronics', basicPay: 95000, hra: 19000, da: 14250, deductions: 18500, netPay: 109750 },
            { empId: 'EMP-008', name: 'Mr. Ramesh Patil', designation: 'Assistant Professor', department: 'Mechanical', basicPay: 62000, hra: 12400, da: 9300, deductions: 12100, netPay: 71600 }
        ]);
        console.log('✅ Employees seeded (8)');

        // === EXPENSES ===
        await Expense.create([
            { date: '2026-03-08', category: 'Infrastructure', department: 'General', description: 'Building repair — Block B', amount: 85000, invoiceNo: 'INV-301', status: 'approved' },
            { date: '2026-03-06', category: 'Lab Equipment', department: 'Electronics', description: 'Oscilloscopes and multimeters', amount: 120000, invoiceNo: 'INV-302', status: 'approved' },
            { date: '2026-03-04', category: 'Library', department: 'General', description: 'New textbooks — Semester 2', amount: 45000, invoiceNo: 'INV-303', status: 'pending' },
            { date: '2026-03-02', category: 'Maintenance', department: 'General', description: 'Electricity & water bills — Feb', amount: 78000, invoiceNo: 'INV-304', status: 'approved' },
            { date: '2026-02-28', category: 'Events', department: 'General', description: 'Annual sports day expenses', amount: 35000, invoiceNo: 'INV-305', status: 'approved' }
        ]);
        console.log('✅ Expenses seeded (5)');

        // === PURCHASES ===
        await Purchase.create([
            { poNumber: 'PO-2026-042', date: '2026-03-10', vendor: 'Tech Solutions Pvt Ltd', category: 'IT Hardware', items: 'Desktop Computers x10', amount: 185000, payment: 'paid' },
            { poNumber: 'PO-2026-041', date: '2026-03-08', vendor: 'Office Supplies Co.', category: 'Stationery', items: 'Printer cartridges, paper', amount: 12500, payment: 'paid' },
            { poNumber: 'PO-2026-040', date: '2026-03-05', vendor: 'Lab Instruments Ltd', category: 'Equipment', items: 'Oscilloscopes x5', amount: 96000, payment: 'pending' },
            { poNumber: 'PO-2026-039', date: '2026-03-03', vendor: 'Modern Furnishers', category: 'Furniture', items: 'Student desks x30', amount: 210000, payment: 'partial' },
            { poNumber: 'PO-2026-038', date: '2026-02-28', vendor: 'Book World Publishers', category: 'Library', items: 'Textbooks (120 copies)', amount: 58000, payment: 'paid' }
        ]);
        console.log('✅ Purchases seeded (5)');

        // === VENDORS ===
        await Vendor.create([
            { vendorId: 'VND-001', company: 'Tech Solutions Pvt Ltd', contact: 'Amit Shah — 9876543210', category: 'IT Hardware', totalOrders: 14, status: 'active' },
            { vendorId: 'VND-002', company: 'Office Supplies Co.', contact: 'Neha Gupta — 9123456789', category: 'Stationery', totalOrders: 28, status: 'active' },
            { vendorId: 'VND-003', company: 'Lab Instruments Ltd', contact: 'Dr. R. Menon — 9988776655', category: 'Equipment', totalOrders: 8, status: 'active' },
            { vendorId: 'VND-004', company: 'Modern Furnishers', contact: 'Rajiv Kapoor — 9876501234', category: 'Furniture', totalOrders: 5, status: 'active' },
            { vendorId: 'VND-005', company: 'Book World Publishers', contact: 'Sanjay Verma — 9111222333', category: 'Books', totalOrders: 12, status: 'inactive' }
        ]);
        console.log('✅ Vendors seeded (5)');

        // === SCHOLARSHIPS ===
        await Scholarship.create([
            { name: 'Anita Kumari', scheme: 'National Merit Scholarship', category: 'Merit Based', amount: 15000, eligible: true, status: 'disbursed', department: 'Computer Science', semester: 'Semester 4', rollNo: 'STU-2026-004' },
            { name: 'Ravi Shankar', scheme: 'SC/ST Scholarship', category: 'Government', amount: 12000, eligible: true, status: 'disbursed', department: 'Mechanical', semester: 'Semester 6', rollNo: 'STU-2026-012' },
            { name: 'Fatima Begum', scheme: 'Minority Scholarship', category: 'Need Based', amount: 10000, eligible: true, status: 'pending', department: 'Commerce', semester: 'Semester 2', rollNo: 'STU-2026-018' },
            { name: 'Suresh Yadav', scheme: 'State Merit Scholarship', category: 'Merit Based', amount: 8000, eligible: true, status: 'disbursed', department: 'Civil', semester: 'Semester 4', rollNo: 'STU-2026-009' },
            { name: 'Kiran Bala', scheme: 'OBC Scholarship', category: 'Government', amount: 10000, eligible: false, status: 'rejected', department: 'Electronics', semester: 'Semester 2', rollNo: 'STU-2026-021' },
            { name: 'Arun Das', scheme: 'National Merit Scholarship', category: 'Merit Based', amount: 15000, eligible: true, status: 'pending', department: 'Computer Science', semester: 'Semester 6', rollNo: 'STU-2026-025' }
        ]);
        console.log('✅ Scholarships seeded (6)');

        // === LEDGER ENTRIES ===
        await Ledger.create([
            { date: '2026-03-10', voucher: 'VCH-0451', particulars: 'Student fee collection — Sem 4 batch', debit: 0, credit: 245000, balance: 3485000, entryType: 'general' },
            { date: '2026-03-09', voucher: 'VCH-0450', particulars: 'Salary payment — March (partial)', debit: 860000, credit: 0, balance: 3240000, entryType: 'general' },
            { date: '2026-03-08', voucher: 'VCH-0449', particulars: 'Lab equipment purchase — CS Dept', debit: 185000, credit: 0, balance: 4100000, entryType: 'general' },
            { date: '2026-03-07', voucher: 'VCH-0448', particulars: 'Government grant received', debit: 0, credit: 500000, balance: 4285000, entryType: 'general' },
            { date: '2026-03-06', voucher: 'VCH-0447', particulars: 'Scholarship disbursement', debit: 75000, credit: 0, balance: 3785000, entryType: 'general' },
            { date: '2026-03-05', voucher: 'VCH-0446', particulars: 'Student fee collection — Sem 2 batch', debit: 0, credit: 196000, balance: 3860000, entryType: 'general' },
            { date: '2026-03-04', voucher: 'VCH-0445', particulars: 'Electricity & water bills', debit: 48000, credit: 0, balance: 3664000, entryType: 'general' },
            { date: '2026-03-03', voucher: 'VCH-0444', particulars: 'Stationery purchase', debit: 8200, credit: 0, balance: 3712000, entryType: 'general' },
            // Cashbook entries
            { date: '2026-03-10', voucher: 'RCT-312', particulars: 'Miscellaneous fee — walk-in', debit: 0, credit: 5500, balance: 142500, entryType: 'cashbook' },
            { date: '2026-03-09', voucher: 'RCT-311', particulars: 'Travel reimbursement — Prof. Gupta', debit: 3200, credit: 0, balance: 137000, entryType: 'cashbook' },
            { date: '2026-03-08', voucher: 'RCT-310', particulars: 'Canteen lease payment received', debit: 0, credit: 15000, balance: 140200, entryType: 'cashbook' },
            // Bank entries
            { date: '2026-03-10', voucher: 'TXN-88541', particulars: 'NEFT Credit — Government grant', debit: 0, credit: 500000, balance: 4285000, entryType: 'bank', txnId: 'TXN-88541', bank: 'SBI — Main A/C', txnType: 'NEFT Credit' },
            { date: '2026-03-09', voucher: 'TXN-88540', particulars: 'RTGS Debit — Salary disbursement', debit: 860000, credit: 0, balance: 3785000, entryType: 'bank', txnId: 'TXN-88540', bank: 'SBI — Main A/C', txnType: 'RTGS Debit' },
            { date: '2026-03-08', voucher: 'TXN-88539', particulars: 'UPI Credit — Student fee', debit: 0, credit: 24500, balance: 4645000, entryType: 'bank', txnId: 'TXN-88539', bank: 'SBI — Main A/C', txnType: 'UPI Credit' }
        ]);
        console.log('✅ Ledger entries seeded (14)');

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📋 Default login credentials:');
        console.log('   Admin:      admin@college.edu     / Admin@123');
        console.log('   Accountant: accountant@college.edu / Account@123');
        console.log('   Auditor:    auditor@college.edu    / Audit@123\n');

        process.exit(0);
    } catch (err) {
        console.error('❌ Seed error:', err);
        process.exit(1);
    }
};

seedData();
