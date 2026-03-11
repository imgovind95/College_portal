/* ========================================================================
   Payroll Management Module
   ======================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    renderPayrollStats();
    renderPayrollTable();

    // Run Payroll button
    const runPayrollBtn = document.getElementById('runPayrollBtn');
    if (runPayrollBtn) {
        runPayrollBtn.addEventListener('click', runPayroll);
    }

    // Payroll search
    const searchInput = document.getElementById('payrollSearch');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const q = searchInput.value.toLowerCase();
            const filtered = payrollData.filter(r =>
                r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.dept.toLowerCase().includes(q)
            );
            renderPayrollTableFiltered(filtered);
        });
    }
});

function renderPayrollStats() {
    const c = document.getElementById('payrollStats');
    if (!c) return;
    c.innerHTML = [
        { label: 'Total Payroll', value: '₹18,60,000', icon: 'fa-money-bill-wave', color: 'blue' },
        { label: 'Total Employees', value: '86', icon: 'fa-users', color: 'teal' },
        { label: 'Total Deductions', value: '₹3,42,000', icon: 'fa-minus-circle', color: 'orange' },
        { label: 'Pending Payments', value: '3', icon: 'fa-clock', color: 'red' }
    ].map(s => `<div class="stat-card ${s.color}"><div class="stat-icon ${s.color}"><i class="fas ${s.icon}"></i></div><div class="stat-info"><div class="stat-label">${s.label}</div><div class="stat-value">${s.value}</div></div></div>`).join('');
}

const payrollData = [
    { id: 'EMP-001', name: 'Dr. Rajesh Gupta', desig: 'Professor', dept: 'Computer Science', basic: 95000, hra: 19000, da: 14250, deductions: 18500, net: 109750 },
    { id: 'EMP-002', name: 'Dr. Priya Mehta', desig: 'Associate Professor', dept: 'Electronics', basic: 78000, hra: 15600, da: 11700, deductions: 15200, net: 90100 },
    { id: 'EMP-003', name: 'Mr. Anil Verma', desig: 'Assistant Professor', dept: 'Mechanical', basic: 62000, hra: 12400, da: 9300, deductions: 12100, net: 71600 },
    { id: 'EMP-004', name: 'Ms. Sunita Roy', desig: 'Lab Assistant', dept: 'Computer Science', basic: 35000, hra: 7000, da: 5250, deductions: 6800, net: 40450 },
    { id: 'EMP-005', name: 'Mr. Deepak Jha', desig: 'Professor', dept: 'Civil', basic: 95000, hra: 19000, da: 14250, deductions: 18500, net: 109750 },
    { id: 'EMP-006', name: 'Ms. Kavita Nair', desig: 'Clerk', dept: 'Administration', basic: 28000, hra: 5600, da: 4200, deductions: 5400, net: 32400 },
    { id: 'EMP-007', name: 'Dr. Suresh Iyer', desig: 'Professor', dept: 'Electronics', basic: 95000, hra: 19000, da: 14250, deductions: 18500, net: 109750 },
    { id: 'EMP-008', name: 'Mr. Ramesh Patil', desig: 'Assistant Professor', dept: 'Mechanical', basic: 62000, hra: 12400, da: 9300, deductions: 12100, net: 71600 }
];

function renderPayrollTable() {
    const tbody = document.getElementById('payrollTableBody');
    if (!tbody) return;
    tbody.innerHTML = payrollData.map((r, i) => `<tr>
        <td><strong>${r.id}</strong></td><td>${r.name}</td><td><span class="badge badge-primary">${r.desig}</span></td><td>${r.dept}</td>
        <td>₹${r.basic.toLocaleString('en-IN')}</td><td>₹${r.hra.toLocaleString('en-IN')}</td><td>₹${r.da.toLocaleString('en-IN')}</td>
        <td class="text-danger">-₹${r.deductions.toLocaleString('en-IN')}</td><td class="fw-700">₹${r.net.toLocaleString('en-IN')}</td>
        <td>
            <button class="btn btn-xs btn-secondary" title="Salary Slip" onclick="viewSalarySlip(${i})"><i class="fas fa-file-alt"></i></button>
            <button class="btn btn-xs btn-secondary" title="Edit" onclick="editEmployee(${i})"><i class="fas fa-edit"></i></button>
        </td>
    </tr>`).join('');
}

// Current slip data for download
let currentSlipData = null;

function viewSalarySlip(index) {
    const r = payrollData[index];
    if (!r) return;
    currentSlipData = r;
    const gross = r.basic + r.hra + r.da;
    const pf = Math.round(r.basic * 0.12);
    const profTax = 200;
    const incomeTax = r.deductions - pf - profTax;
    const month = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

    document.getElementById('salarySlipBody').innerHTML = `
        <div style="border:2px solid var(--primary);border-radius:var(--radius-md);padding:24px;">
            <div style="text-align:center;margin-bottom:20px;border-bottom:2px solid var(--border);padding-bottom:16px;">
                <h3 style="color:var(--primary);font-size:1.1rem;">Government College — Salary Slip</h3>
                <p style="color:var(--text-muted);font-size:0.82rem;">Month: ${month}</p>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 24px;font-size:0.85rem;margin-bottom:20px;">
                <div><strong>Employee ID:</strong> ${r.id}</div>
                <div><strong>Name:</strong> ${r.name}</div>
                <div><strong>Designation:</strong> ${r.desig}</div>
                <div><strong>Department:</strong> ${r.dept}</div>
            </div>
            <table class="data-table" style="margin-bottom:16px;">
                <thead><tr><th colspan="2">Earnings</th><th colspan="2">Deductions</th></tr></thead>
                <tbody>
                    <tr><td>Basic Pay</td><td class="text-right fw-600">₹${r.basic.toLocaleString('en-IN')}</td><td>Provident Fund (12%)</td><td class="text-right fw-600 text-danger">₹${pf.toLocaleString('en-IN')}</td></tr>
                    <tr><td>HRA</td><td class="text-right fw-600">₹${r.hra.toLocaleString('en-IN')}</td><td>Professional Tax</td><td class="text-right fw-600 text-danger">₹${profTax.toLocaleString('en-IN')}</td></tr>
                    <tr><td>DA</td><td class="text-right fw-600">₹${r.da.toLocaleString('en-IN')}</td><td>Income Tax (TDS)</td><td class="text-right fw-600 text-danger">₹${incomeTax.toLocaleString('en-IN')}</td></tr>
                    <tr style="border-top:2px solid var(--border);font-weight:700"><td>Gross Earnings</td><td class="text-right text-success">₹${gross.toLocaleString('en-IN')}</td><td>Total Deductions</td><td class="text-right text-danger">₹${r.deductions.toLocaleString('en-IN')}</td></tr>
                </tbody>
            </table>
            <div style="background:var(--primary-light);padding:14px 20px;border-radius:var(--radius);display:flex;justify-content:space-between;align-items:center;">
                <span style="font-weight:700;font-size:1rem;">Net Salary Payable</span>
                <span style="font-weight:800;font-size:1.2rem;color:var(--primary);">₹${r.net.toLocaleString('en-IN')}</span>
            </div>
        </div>
    `;
    openModal('salarySlipModal');
}

function downloadSalarySlip() {
    if (!currentSlipData) return;
    const r = currentSlipData;
    const month = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    const gross = r.basic + r.hra + r.da;
    const pf = Math.round(r.basic * 0.12);
    const profTax = 200;
    const incomeTax = r.deductions - pf - profTax;

    const content = `
GOVERNMENT COLLEGE — SALARY SLIP
Month: ${month}
========================================
Employee ID : ${r.id}
Name        : ${r.name}
Designation : ${r.desig}
Department  : ${r.dept}
========================================
EARNINGS
  Basic Pay              : ₹${r.basic.toLocaleString('en-IN')}
  HRA                    : ₹${r.hra.toLocaleString('en-IN')}
  DA                     : ₹${r.da.toLocaleString('en-IN')}
  Gross Earnings         : ₹${gross.toLocaleString('en-IN')}
----------------------------------------
DEDUCTIONS
  Provident Fund (12%)   : ₹${pf.toLocaleString('en-IN')}
  Professional Tax       : ₹${profTax.toLocaleString('en-IN')}
  Income Tax (TDS)       : ₹${incomeTax.toLocaleString('en-IN')}
  Total Deductions       : ₹${r.deductions.toLocaleString('en-IN')}
========================================
NET SALARY PAYABLE       : ₹${r.net.toLocaleString('en-IN')}
========================================
This is a system-generated document.
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `SalarySlip_${r.id}_${month.replace(/ /g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
}

function editEmployee(index) {
    const r = payrollData[index];
    if (!r) return;
    document.getElementById('detailModalTitle').textContent = 'Edit Employee — ' + r.name;
    document.getElementById('detailModalBody').innerHTML = `
        <div class="form-row"><div class="form-group"><label>Employee ID</label><input type="text" value="${r.id}" readonly style="background:var(--bg-body)"></div><div class="form-group"><label>Full Name</label><input type="text" value="${r.name}"></div></div>
        <div class="form-row"><div class="form-group"><label>Designation</label><select><option ${r.desig==='Professor'?'selected':''}>Professor</option><option ${r.desig==='Associate Professor'?'selected':''}>Associate Professor</option><option ${r.desig==='Assistant Professor'?'selected':''}>Assistant Professor</option><option ${r.desig==='Lab Assistant'?'selected':''}>Lab Assistant</option><option ${r.desig==='Clerk'?'selected':''}>Clerk</option></select></div><div class="form-group"><label>Department</label><select><option ${r.dept==='Computer Science'?'selected':''}>Computer Science</option><option ${r.dept==='Electronics'?'selected':''}>Electronics</option><option ${r.dept==='Mechanical'?'selected':''}>Mechanical</option><option ${r.dept==='Civil'?'selected':''}>Civil</option><option ${r.dept==='Administration'?'selected':''}>Administration</option></select></div></div>
        <div class="form-row"><div class="form-group"><label>Basic Pay (₹)</label><input type="number" value="${r.basic}"></div><div class="form-group"><label>HRA (₹)</label><input type="number" value="${r.hra}"></div></div>
        <div class="form-row"><div class="form-group"><label>DA (₹)</label><input type="number" value="${r.da}"></div><div class="form-group"><label>Deductions (₹)</label><input type="number" value="${r.deductions}"></div></div>
    `;
    const actionBtn = document.getElementById('detailModalAction');
    actionBtn.style.display = 'inline-flex';
    actionBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
    actionBtn.onclick = () => { closeModal('detailViewModal'); };
    openModal('detailViewModal');
}
