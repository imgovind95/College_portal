/* ========================================================================
   Dashboard Module — Fetches data from API
   ======================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
});

async function loadDashboard() {
    try {
        const data = await api('/audit/dashboard');
        if (!data) return;
        renderDashStats(data);
    } catch (err) {
        console.error('Dashboard load error:', err);
        // Fall back to default stat values if API fails
        renderDashStats({
            feesCollected: 4285000, pendingFees: 842000, pendingStudents: 23,
            totalSalary: 1860000, budgetSpent: 12114000, scholarshipsDisbursed: 520000,
            scholarshipBeneficiaries: 48
        });
    }
    renderRevenueChart();
    renderBudgetDoughnut();
    renderAlerts();
    renderRecentTxns();
}

function renderDashStats(d) {
    const c = document.getElementById('dashStats');
    if (!c) return;
    const budgetTotal = 18000000;
    const utilPct = ((d.budgetSpent / budgetTotal) * 100).toFixed(1);

    c.innerHTML = [
        { label: 'Fees Collected', value: '₹' + (d.feesCollected || 0).toLocaleString('en-IN'), sub: '↑ +12.5%', icon: 'fa-indian-rupee-sign', color: 'blue' },
        { label: 'Pending Fees', value: '₹' + (d.pendingFees || 0).toLocaleString('en-IN'), sub: '↓ ' + (d.pendingStudents || 0) + ' students', icon: 'fa-clock', color: 'orange' },
        { label: 'Salary Expenses', value: '₹' + (d.totalSalary || 0).toLocaleString('en-IN'), sub: 'This month', icon: 'fa-users', color: 'teal' },
        { label: 'Budget Utilization', value: utilPct + '%', sub: '↑ ₹' + (d.budgetSpent / 10000000).toFixed(1) + 'Cr of ₹' + (budgetTotal / 10000000).toFixed(1) + 'Cr', icon: 'fa-chart-line', color: 'green' },
        { label: 'Scholarships Disbursed', value: '₹' + (d.scholarshipsDisbursed || 0).toLocaleString('en-IN'), sub: '↑ ' + (d.scholarshipBeneficiaries || 0) + ' students', icon: 'fa-graduation-cap', color: 'blue' },
        { label: 'Pending Approvals', value: '7', sub: '↓ Action needed', icon: 'fa-exclamation-circle', color: 'red' }
    ].map(s => `<div class="stat-card ${s.color}"><div class="stat-icon ${s.color}"><i class="fas ${s.icon}"></i></div><div class="stat-info"><div class="stat-label">${s.label}</div><div class="stat-value">${s.value}</div><div class="stat-sub ${s.sub.startsWith('↓') ? 'down' : 'up'}">${s.sub}</div></div></div>`).join('');
}

function renderRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
            datasets: [
                { label: 'Fees Collected', data: [340, 480, 350, 520, 490, 310, 450, 480, 260, 540, 490, 380], backgroundColor: '#1a73e8', borderRadius: 4 },
                { label: 'Expenses', data: [280, 360, 310, 420, 390, 280, 340, 380, 250, 410, 350, 300], backgroundColor: '#0d9488', borderRadius: 4 }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'top', labels: { usePointStyle: true, font: { family: 'Inter', size: 12 } } } },
            scales: {
                y: { ticks: { callback: v => '₹' + v/100 + 'L', font: { family: 'Inter', size: 11 } }, grid: { color: 'rgba(0,0,0,0.05)' } },
                x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 11 } } }
            }
        }
    });
}

function renderBudgetDoughnut() {
    const ctx = document.getElementById('budgetDoughnut');
    if (!ctx) return;
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Salaries', 'Infrastructure', 'Lab Equipment', 'Library', 'Maintenance', 'Events'],
            datasets: [{ data: [45, 18, 12, 8, 10, 7], backgroundColor: ['#1a73e8', '#0d9488', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'], borderWidth: 2, borderColor: '#fff' }]
        },
        options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 10, font: { family: 'Inter', size: 11 } } } } }
    });
}

function renderAlerts() {
    const panel = document.getElementById('alertsPanel');
    if (!panel) return;
    panel.innerHTML = [
        { text: '23 students have pending fee payments', type: 'warning', icon: 'fa-exclamation-triangle' },
        { text: 'March salary processing deadline approaching', type: 'info', icon: 'fa-info-circle' },
        { text: 'Budget utilization at 67% — on track', type: 'success', icon: 'fa-check-circle' },
        { text: 'Audit report submission by March 31', type: 'warning', icon: 'fa-calendar-alt' }
    ].map(a => `<div class="alert-item ${a.type}"><i class="fas ${a.icon}"></i><span>${a.text}</span></div>`).join('');
}

function renderRecentTxns() {
    const panel = document.getElementById('recentTxns');
    if (!panel) return;
    const colorMap = { 'Fee Collection': 'primary', 'Salary': 'danger', 'Purchase': 'warning', 'Grant': 'success', 'Scholarship': 'accent' };
    panel.innerHTML = [
        { type: 'Fee Collection', desc: 'Sem 4 batch — 12 students', amount: '+₹2,45,000', time: 'Today' },
        { type: 'Salary', desc: 'March partial disbursement', amount: '-₹8,60,000', time: 'Yesterday' },
        { type: 'Purchase', desc: 'Lab equipment — CS Dept', amount: '-₹1,85,000', time: '2 days ago' },
        { type: 'Grant', desc: 'Government grant received', amount: '+₹5,00,000', time: '3 days ago' },
        { type: 'Scholarship', desc: 'National Merit batch', amount: '-₹75,000', time: '4 days ago' }
    ].map(t => `<div class="txn-item"><div class="txn-icon" style="background:var(--${colorMap[t.type]}-light);color:var(--${colorMap[t.type]})"><i class="fas fa-exchange-alt"></i></div><div class="txn-details"><h4>${t.type}</h4><span>${t.desc}</span></div><div class="txn-amount"><span class="${t.amount.startsWith('+') ? 'text-success' : 'text-danger'} fw-600">${t.amount}</span><small>${t.time}</small></div></div>`).join('');
}
