/* ========================================================================
   Audit & Reporting Module
   ======================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    renderAuditStats();
    renderAuditLineChart();
    renderQuickReports();
    renderAuditLog();
});

function renderAuditStats() {
    const c = document.getElementById('auditStats');
    if (!c) return;
    c.innerHTML = [
        { label: 'Total Revenue (FY)', value: '₹52,10,000', icon: 'fa-arrow-trend-up', color: 'green' },
        { label: 'Total Expenses (FY)', value: '₹38,45,000', icon: 'fa-arrow-trend-down', color: 'red' },
        { label: 'Net Surplus', value: '₹13,65,000', icon: 'fa-scale-balanced', color: 'blue' },
        { label: 'Audit Score', value: '94%', icon: 'fa-shield-halved', color: 'teal' }
    ].map(s => `<div class="stat-card ${s.color}"><div class="stat-icon ${s.color}"><i class="fas ${s.icon}"></i></div><div class="stat-info"><div class="stat-label">${s.label}</div><div class="stat-value">${s.value}</div></div></div>`).join('');
}

function renderAuditLineChart() {
    const ctx = document.getElementById('auditLineChart');
    if (!ctx) return;
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
            datasets: [
                { label: 'Revenue', data: [380, 420, 350, 510, 480, 390, 440, 460, 370, 520, 490, 400], borderColor: '#16a34a', backgroundColor: 'rgba(22,163,74,0.1)', fill: true, tension: 0.4, pointRadius: 4 },
                { label: 'Expenses', data: [250, 310, 280, 340, 300, 260, 290, 320, 270, 350, 330, 295], borderColor: '#dc2626', backgroundColor: 'rgba(220,38,38,0.1)', fill: true, tension: 0.4, pointRadius: 4 }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'top', labels: { usePointStyle: true, font: { family: 'Inter', size: 12 } } } },
            scales: {
                y: { ticks: { callback: v => '₹' + v/10 + 'L', font: { family: 'Inter', size: 11 } }, grid: { color: 'rgba(0,0,0,0.05)' } },
                x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 11 } } }
            }
        }
    });
}

function renderQuickReports() {
    const panel = document.getElementById('quickReportsPanel');
    if (!panel) return;
    const reports = [
        { icon: 'fa-file-invoice-dollar', title: 'Monthly Financial Summary', desc: 'March 2026', color: 'blue', key: 'monthly' },
        { icon: 'fa-users', title: 'Payroll Report', desc: 'March 2026', color: 'teal', key: 'payroll' },
        { icon: 'fa-graduation-cap', title: 'Scholarship Report', desc: 'FY 2025-26', color: 'orange', key: 'scholarship' },
        { icon: 'fa-chart-pie', title: 'Budget Utilization Report', desc: 'FY 2025-26', color: 'green', key: 'budget' },
        { icon: 'fa-clipboard-check', title: 'Annual Audit Report', desc: 'FY 2025-26', color: 'red', key: 'audit' }
    ];
    const colorMap = { blue: 'primary', teal: 'accent', orange: 'warning', green: 'success', red: 'danger' };
    panel.innerHTML = reports.map(r => `
        <div class="txn-item" style="cursor:pointer">
            <div class="txn-icon" style="background:var(--${colorMap[r.color]}-light); color:var(--${colorMap[r.color]})"><i class="fas ${r.icon}"></i></div>
            <div class="txn-details"><h4>${r.title}</h4><span>${r.desc}</span></div>
            <button class="btn btn-xs btn-primary" onclick="downloadReport('${r.key}','${r.title}')"><i class="fas fa-download"></i> PDF</button>
        </div>
    `).join('');
}

function renderAuditLog() {
    const tbody = document.getElementById('auditLogBody');
    if (!tbody) return;
    const data = [
        { time: '2026-03-10 14:32', type: 'Fee Collection', desc: 'Processed fee payment for STU-2026-001', amount: 24500, user: 'accountant@college.edu', status: 'completed' },
        { time: '2026-03-10 11:15', type: 'Payroll', desc: 'Generated salary slips for March 2026', amount: 1860000, user: 'accountant@college.edu', status: 'completed' },
        { time: '2026-03-09 16:45', type: 'Purchase', desc: 'Approved PO-2026-042 for IT hardware', amount: 185000, user: 'admin@college.edu', status: 'approved' },
        { time: '2026-03-08 10:20', type: 'Scholarship', desc: 'Disbursed National Merit scholarship batch', amount: 75000, user: 'accountant@college.edu', status: 'completed' },
        { time: '2026-03-07 09:00', type: 'Budget', desc: 'Updated budget allocation for Q4', amount: 0, user: 'admin@college.edu', status: 'modified' },
        { time: '2026-03-06 15:30', type: 'Expense', desc: 'Recorded electricity bill payment', amount: 48000, user: 'accountant@college.edu', status: 'completed' }
    ];
    const badge = s => ({ completed: 'badge-success', approved: 'badge-info', modified: 'badge-warning' })[s] || 'badge-muted';
    tbody.innerHTML = data.map(r => `<tr>
        <td style="white-space:nowrap">${r.time}</td><td><span class="badge badge-primary">${r.type}</span></td><td>${r.desc}</td>
        <td class="fw-600">${r.amount ? '₹' + r.amount.toLocaleString('en-IN') : '—'}</td>
        <td style="font-size:0.78rem">${r.user}</td>
        <td><span class="badge ${badge(r.status)}">${r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span></td>
    </tr>`).join('');
}

// Download specific report
function downloadReport(key, title) {
    const now = new Date();
    const reports = {
        monthly: `
GOVERNMENT COLLEGE — MONTHLY FINANCIAL SUMMARY
Period: March 2026
Generated: ${now.toLocaleDateString('en-IN')}
================================================================
REVENUE
  Student Fee Collection         : ₹4,28,500
  Government Grants              : ₹5,00,000
  Other Income                   : ₹82,000
  TOTAL REVENUE                  : ₹10,10,500
----------------------------------------------------------------
EXPENSES
  Salaries & Payroll             : ₹18,60,000
  Infrastructure                 : ₹2,80,000
  Lab Equipment                  : ₹1,85,000
  Library                        : ₹28,000
  Utilities                      : ₹48,000
  Maintenance                    : ₹52,000
  Events                         : ₹35,000
  TOTAL EXPENSES                 : ₹24,88,000
================================================================
NET POSITION                     : -₹14,77,500
(Covered by annual budget allocation)
`,
        payroll: `
GOVERNMENT COLLEGE — PAYROLL REPORT
Period: March 2026
Generated: ${now.toLocaleDateString('en-IN')}
================================================================
Total Employees     : 86
Total Gross Pay     : ₹22,02,000
Total Deductions    : ₹3,42,000
Total Net Pay       : ₹18,60,000
----------------------------------------------------------------
DEPARTMENT WISE BREAKDOWN
  Computer Science   : ₹4,50,200 (12 employees)
  Electronics        : ₹3,99,850 (10 employees)
  Mechanical         : ₹3,43,200 (9 employees)
  Civil              : ₹2,19,500 (6 employees)
  Administration     : ₹4,47,250 (49 employees)
================================================================`,
        scholarship: `
GOVERNMENT COLLEGE — SCHOLARSHIP REPORT
Financial Year: 2025-26
Generated: ${now.toLocaleDateString('en-IN')}
================================================================
Total Fund Received    : ₹12,00,000
Total Disbursed        : ₹5,20,000
Pending Disbursement   : ₹6,80,000
Total Beneficiaries    : 48 students
----------------------------------------------------------------
SCHEME WISE BREAKDOWN
  National Merit       : ₹4,20,000  (28 students)
  SC/ST Scholarship    : ₹3,00,000  (25 students)
  OBC Scholarship      : ₹2,40,000  (20 students)
  Minority             : ₹1,44,000  (12 students)
  State Merit          : ₹96,000    (8 students)
================================================================`,
        budget: `
GOVERNMENT COLLEGE — BUDGET UTILIZATION REPORT
Financial Year: 2025-26
Generated: ${now.toLocaleDateString('en-IN')}
================================================================
Total Allocated Budget  : ₹1,80,00,000
Total Spent            : ₹1,21,14,000
Remaining              : ₹58,86,000
Utilization Rate       : 67.3%
----------------------------------------------------------------
CATEGORY WISE UTILIZATION
  Salaries          : 76% (₹61.56L of ₹81.0L)
  Infrastructure    : 86% (₹27.86L of ₹32.4L)
  Lab Equipment     : 90% (₹19.44L of ₹21.6L)
  Library           : 68% (₹9.79L of ₹14.4L)
  Maintenance       : 81% (₹14.58L of ₹18.0L)
  Events            : 57% (₹7.18L of ₹12.6L)
================================================================`,
        audit: `
GOVERNMENT COLLEGE — ANNUAL AUDIT REPORT
Financial Year: 2025-26
Generated: ${now.toLocaleDateString('en-IN')}
================================================================
AUDIT SCORE: 94/100 — EXCELLENT

FINDINGS:
1. All transactions properly documented  ✓
2. Budget utilization within limits       ✓
3. Salary disbursements on time          ✓
4. Scholarship funds properly tracked    ✓
5. Invoice documentation complete        ✓

SUMMARY:
  Total Revenue (FY)    : ₹52,10,000
  Total Expenses (FY)   : ₹38,45,000
  Net Surplus           : ₹13,65,000

RECOMMENDATIONS:
- Digitize remaining manual records
- Implement quarterly internal audits
- Update vendor contracts annually
================================================================`
    };

    const content = (reports[key] || reports.monthly).trim();
    const blob = new Blob([content], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${title.replace(/ /g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
}

// Generate full audit report (header button)
function generateAuditReport() {
    downloadReport('audit', 'Annual_Audit_Report_FY2025-26');
}
