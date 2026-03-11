/* ========================================================================
   Student Fee Management — API Integrated
   ======================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    loadFees();
    setupFeeFilters();
});

async function loadFees() {
    try {
        const data = await api('/fees');
        if (!data) return;
        renderFeeStats(data.stats);
        window._feeStudents = data.students;
        renderFeeTable(data.students);
    } catch (err) {
        console.error('Fees load error:', err);
        // Fallback to render with defaults
        renderFeeStats({});
        renderFeeTable(getDefaultFeeData());
    }
}

function getDefaultFeeData() {
    return [
        { _id: '1', studentId: 'STU-2026-001', name: 'Aarav Sharma', department: 'Computer Science', semester: 'Semester 4', feeType: 'Tuition Fee', amount: 24500, status: 'paid' },
        { _id: '2', studentId: 'STU-2026-002', name: 'Priya Patel', department: 'Electronics', semester: 'Semester 2', feeType: 'Tuition Fee', amount: 22000, status: 'pending' },
        { _id: '3', studentId: 'STU-2026-003', name: 'Rohit Kumar', department: 'Mechanical', semester: 'Semester 6', feeType: 'Exam Fee', amount: 5500, status: 'paid' },
        { _id: '4', studentId: 'STU-2026-004', name: 'Sanya Gupta', department: 'Computer Science', semester: 'Semester 2', feeType: 'Lab Fee', amount: 8000, status: 'overdue' },
        { _id: '5', studentId: 'STU-2026-005', name: 'Vikram Singh', department: 'Civil', semester: 'Semester 4', feeType: 'Tuition Fee', amount: 24500, status: 'paid' },
        { _id: '6', studentId: 'STU-2026-006', name: 'Neha Agarwal', department: 'Commerce', semester: 'Semester 2', feeType: 'Admission Fee', amount: 15000, status: 'pending' },
        { _id: '7', studentId: 'STU-2026-007', name: 'Amit Verma', department: 'Electronics', semester: 'Semester 4', feeType: 'Tuition Fee', amount: 22000, status: 'paid' },
        { _id: '8', studentId: 'STU-2026-008', name: 'Divya Mishra', department: 'Computer Science', semester: 'Semester 6', feeType: 'Tuition Fee', amount: 24500, status: 'overdue' }
    ];
}

function renderFeeStats(stats) {
    const c = document.getElementById('feeStats');
    if (!c) return;
    const tc = stats.totalCollected?.[0]?.total || 4285000;
    const pa = stats.pendingAmount?.[0]?.total || 842000;
    const od = stats.overdueAmount?.[0]?.total || 315000;
    const ts = stats.totalStudents || 1248;
    c.innerHTML = [
        { label: 'Total Collected', value: '₹' + tc.toLocaleString('en-IN'), sub: 'This semester', icon: 'fa-check-circle', color: 'green' },
        { label: 'Pending Amount', value: '₹' + pa.toLocaleString('en-IN'), sub: '↓ 23 students', icon: 'fa-hourglass-end', color: 'orange' },
        { label: 'Overdue (>30 days)', value: '₹' + od.toLocaleString('en-IN'), sub: '↓ 12 students', icon: 'fa-exclamation-triangle', color: 'red' },
        { label: 'Total Students', value: ts.toLocaleString('en-IN'), sub: '↑ +45 new', icon: 'fa-users', color: 'blue' }
    ].map(s => `<div class="stat-card ${s.color}"><div class="stat-icon ${s.color}"><i class="fas ${s.icon}"></i></div><div class="stat-info"><div class="stat-label">${s.label}</div><div class="stat-value">${s.value}</div><div class="stat-sub ${s.sub.startsWith('↓') ? 'down' : 'up'}">${s.sub}</div></div></div>`).join('');
}

function renderFeeTable(students) {
    const tbody = document.getElementById('feeTableBody');
    if (!tbody) return;
    const badge = s => ({ paid: 'badge-success', pending: 'badge-warning', overdue: 'badge-danger' })[s] || 'badge-muted';
    tbody.innerHTML = students.map(r => `<tr>
        <td><strong>${escapeHtml(r.studentId)}</strong></td><td>${escapeHtml(r.name)}</td><td>${escapeHtml(r.department)}</td><td>${escapeHtml(r.semester)}</td>
        <td>${escapeHtml(r.feeType)}</td><td class="fw-600">₹${r.amount.toLocaleString('en-IN')}</td>
        <td><span class="badge ${badge(r.status)}">${r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span></td>
        <td><button class="btn btn-xs btn-primary">Receipt</button></td>
    </tr>`).join('');
}

function setupFeeFilters() {
    const search = document.getElementById('feeSearch');
    const semFilter = document.getElementById('feeSemFilter');
    const deptFilter = document.getElementById('feeDeptFilter');
    const statusFilter = document.getElementById('feeStatusFilter');

    const applyFilters = () => {
        const data = window._feeStudents || getDefaultFeeData();
        const q = (search?.value || '').toLowerCase();
        const sem = semFilter?.value || '';
        const dept = deptFilter?.value || '';
        const st = statusFilter?.value || '';
        const filtered = data.filter(r =>
            (!q || r.name.toLowerCase().includes(q) || r.studentId.toLowerCase().includes(q)) &&
            (!sem || r.semester === sem) && (!dept || r.department === dept) &&
            (!st || r.status === st)
        );
        renderFeeTable(filtered);
    };

    if (search) search.addEventListener('input', applyFilters);
    if (semFilter) semFilter.addEventListener('change', applyFilters);
    if (deptFilter) deptFilter.addEventListener('change', applyFilters);
    if (statusFilter) statusFilter.addEventListener('change', applyFilters);
}
