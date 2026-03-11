/* ========================================================================
   Scholarship Management Module
   ======================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    renderScholarshipStats();
    renderScholarshipChart();
    renderScholarshipStatus();
    renderScholarshipTable();
});

function renderScholarshipStats() {
    const c = document.getElementById('scholarshipStats');
    if (!c) return;
    c.innerHTML = [
        { label: 'Total Fund Received', value: '₹12,00,000', icon: 'fa-hand-holding-usd', color: 'blue' },
        { label: 'Disbursed', value: '₹5,20,000', icon: 'fa-check-circle', color: 'green' },
        { label: 'Pending', value: '₹6,80,000', icon: 'fa-hourglass-half', color: 'orange' },
        { label: 'Beneficiaries', value: '48', icon: 'fa-user-graduate', color: 'teal' }
    ].map(s => `<div class="stat-card ${s.color}"><div class="stat-icon ${s.color}"><i class="fas ${s.icon}"></i></div><div class="stat-info"><div class="stat-label">${s.label}</div><div class="stat-value">${s.value}</div></div></div>`).join('');
}

function renderScholarshipChart() {
    const ctx = document.getElementById('scholarshipChart');
    if (!ctx) return;
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['National Merit', 'SC/ST', 'OBC', 'Minority', 'State Merit'],
            datasets: [{ data: [35, 25, 20, 12, 8], backgroundColor: ['#1a73e8', '#0d9488', '#f59e0b', '#8b5cf6', '#ef4444'], borderWidth: 2, borderColor: '#fff' }]
        },
        options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 12, font: { family: 'Inter', size: 11 } } } } }
    });
}

function renderScholarshipStatus() {
    const panel = document.getElementById('scholarshipStatusPanel');
    if (!panel) return;
    panel.innerHTML = [
        { name: 'National Merit Scholarship', pct: 80, color: 'blue' },
        { name: 'SC/ST Scholarship', pct: 55, color: 'green' },
        { name: 'OBC Scholarship', pct: 40, color: 'orange' },
        { name: 'Minority Scholarship', pct: 30, color: 'red' },
        { name: 'State Merit Scholarship', pct: 65, color: 'blue' }
    ].map(i => `<div class="progress-bar-wrap"><div class="progress-bar-label"><span>${i.name}</span><span>${i.pct}% disbursed</span></div><div class="progress-bar-track"><div class="progress-bar-fill ${i.color}" style="width:${i.pct}%"></div></div></div>`).join('');
}

const scholarshipData = [
    { name: 'Anita Kumari', scheme: 'National Merit Scholarship', cat: 'Merit Based', amount: 15000, eligible: true, status: 'disbursed', dept: 'Computer Science', sem: 'Semester 4', rollNo: 'STU-2026-004' },
    { name: 'Ravi Shankar', scheme: 'SC/ST Scholarship', cat: 'Government', amount: 12000, eligible: true, status: 'disbursed', dept: 'Mechanical', sem: 'Semester 6', rollNo: 'STU-2026-012' },
    { name: 'Fatima Begum', scheme: 'Minority Scholarship', cat: 'Need Based', amount: 10000, eligible: true, status: 'pending', dept: 'Commerce', sem: 'Semester 2', rollNo: 'STU-2026-018' },
    { name: 'Suresh Yadav', scheme: 'State Merit Scholarship', cat: 'Merit Based', amount: 8000, eligible: true, status: 'disbursed', dept: 'Civil', sem: 'Semester 4', rollNo: 'STU-2026-009' },
    { name: 'Kiran Bala', scheme: 'OBC Scholarship', cat: 'Government', amount: 10000, eligible: false, status: 'rejected', dept: 'Electronics', sem: 'Semester 2', rollNo: 'STU-2026-021' },
    { name: 'Arun Das', scheme: 'National Merit Scholarship', cat: 'Merit Based', amount: 15000, eligible: true, status: 'pending', dept: 'Computer Science', sem: 'Semester 6', rollNo: 'STU-2026-025' }
];

function renderScholarshipTable() {
    const tbody = document.getElementById('scholarshipTableBody');
    if (!tbody) return;
    const badge = s => ({ disbursed: 'badge-success', pending: 'badge-warning', rejected: 'badge-danger' })[s] || 'badge-muted';
    tbody.innerHTML = scholarshipData.map((r, i) => `<tr>
        <td>${r.name}</td><td>${r.scheme}</td><td><span class="badge badge-primary">${r.cat}</span></td>
        <td class="fw-600">₹${r.amount.toLocaleString('en-IN')}</td>
        <td>${r.eligible ? '<span class="badge badge-success">Eligible</span>' : '<span class="badge badge-danger">Not Eligible</span>'}</td>
        <td><span class="badge ${badge(r.status)}">${r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span></td>
        <td><button class="btn btn-xs btn-secondary" title="View Details" onclick="viewScholarship(${i})"><i class="fas fa-eye"></i></button></td>
    </tr>`).join('');
}

function viewScholarship(index) {
    const r = scholarshipData[index];
    if (!r) return;
    const statusBadge = { disbursed: 'badge-success', pending: 'badge-warning', rejected: 'badge-danger' };
    document.getElementById('detailModalTitle').textContent = 'Scholarship Details — ' + r.name;
    document.getElementById('detailModalBody').innerHTML = `
        <div style="border:1px solid var(--border);border-radius:var(--radius-md);padding:20px;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;font-size:0.88rem;">
                <div><span style="color:var(--text-muted);font-size:0.78rem;display:block">Student Name</span><strong>${r.name}</strong></div>
                <div><span style="color:var(--text-muted);font-size:0.78rem;display:block">Roll Number</span><strong>${r.rollNo}</strong></div>
                <div><span style="color:var(--text-muted);font-size:0.78rem;display:block">Department</span><strong>${r.dept}</strong></div>
                <div><span style="color:var(--text-muted);font-size:0.78rem;display:block">Semester</span><strong>${r.sem}</strong></div>
                <div><span style="color:var(--text-muted);font-size:0.78rem;display:block">Scholarship Scheme</span><strong>${r.scheme}</strong></div>
                <div><span style="color:var(--text-muted);font-size:0.78rem;display:block">Category</span><span class="badge badge-primary">${r.cat}</span></div>
                <div><span style="color:var(--text-muted);font-size:0.78rem;display:block">Amount</span><strong style="font-size:1.1rem;color:var(--primary);">₹${r.amount.toLocaleString('en-IN')}</strong></div>
                <div><span style="color:var(--text-muted);font-size:0.78rem;display:block">Eligibility</span>${r.eligible ? '<span class="badge badge-success">Eligible</span>' : '<span class="badge badge-danger">Not Eligible</span>'}</div>
                <div style="grid-column:span 2"><span style="color:var(--text-muted);font-size:0.78rem;display:block">Disbursement Status</span><span class="badge ${statusBadge[r.status] || 'badge-muted'}">${r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span></div>
            </div>
        </div>
    `;
    const actionBtn = document.getElementById('detailModalAction');
    actionBtn.style.display = 'none';
    openModal('detailViewModal');
}
