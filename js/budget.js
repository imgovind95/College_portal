/* ========================================================================
   Budget & Expense Management Module
   ======================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    renderBudgetStats();
    renderBudgetBarChart();
    renderBudgetUtilization();
    renderExpenseTable();
});

function renderBudgetStats() {
    const c = document.getElementById('budgetStats');
    if (!c) return;
    c.innerHTML = [
        { label: 'Total Budget', value: '₹1,80,00,000', icon: 'fa-wallet', color: 'blue' },
        { label: 'Total Spent', value: '₹1,21,14,000', icon: 'fa-credit-card', color: 'teal' },
        { label: 'Remaining', value: '₹58,86,000', icon: 'fa-piggy-bank', color: 'green' },
        { label: 'Pending Bills', value: '₹4,25,000', icon: 'fa-file-invoice', color: 'orange' }
    ].map(s => `<div class="stat-card ${s.color}"><div class="stat-icon ${s.color}"><i class="fas ${s.icon}"></i></div><div class="stat-info"><div class="stat-label">${s.label}</div><div class="stat-value">${s.value}</div></div></div>`).join('');
}

function renderBudgetBarChart() {
    const ctx = document.getElementById('budgetBarChart');
    if (!ctx) return;
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Salaries', 'Infrastructure', 'Lab Equipment', 'Library', 'Maintenance', 'Events', 'IT', 'Misc'],
            datasets: [
                { label: 'Allocated', data: [810000, 324000, 216000, 144000, 180000, 126000, 90000, 90000], backgroundColor: 'rgba(26,115,232,0.3)', borderColor: '#1a73e8', borderWidth: 1, borderRadius: 4 },
                { label: 'Spent', data: [620000, 280000, 195000, 98000, 145000, 72000, 65000, 36400], backgroundColor: 'rgba(13,148,136,0.7)', borderRadius: 4 }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false, indexAxis: 'y',
            plugins: { legend: { position: 'top', labels: { usePointStyle: true, font: { family: 'Inter', size: 11 } } } },
            scales: { x: { ticks: { callback: v => '₹' + (v/100000).toFixed(1) + 'L', font: { family: 'Inter', size: 11 } }, grid: { color: 'rgba(0,0,0,0.05)' } }, y: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 11 } } } }
        }
    });
}

function renderBudgetUtilization() {
    const panel = document.getElementById('budgetUtilPanel');
    if (!panel) return;
    const items = [
        { name: 'Salaries', pct: 76, color: 'blue' },
        { name: 'Infrastructure', pct: 86, color: 'green' },
        { name: 'Lab Equipment', pct: 90, color: 'orange' },
        { name: 'Library', pct: 68, color: 'blue' },
        { name: 'Maintenance', pct: 81, color: 'green' },
        { name: 'Events & Activities', pct: 57, color: 'orange' }
    ];
    panel.innerHTML = items.map(i => `
        <div class="progress-bar-wrap">
            <div class="progress-bar-label"><span>${i.name}</span><span>${i.pct}%</span></div>
            <div class="progress-bar-track"><div class="progress-bar-fill ${i.color}" style="width:${i.pct}%"></div></div>
        </div>
    `).join('');
}

function renderExpenseTable() {
    const tbody = document.getElementById('expenseTableBody');
    if (!tbody) return;
    const data = [
        { date: '2026-03-10', cat: 'Lab Equipment', dept: 'Computer Science', desc: 'Desktop computers (10 units)', amount: 185000, invoice: true, status: 'approved' },
        { date: '2026-03-08', cat: 'Maintenance', dept: 'General', desc: 'Building repair — Block A', amount: 52000, invoice: true, status: 'approved' },
        { date: '2026-03-07', cat: 'Library', dept: 'General', desc: 'New textbooks and journals', amount: 28000, invoice: false, status: 'pending' },
        { date: '2026-03-05', cat: 'Infrastructure', dept: 'Electronics', desc: 'Smart board installation', amount: 96000, invoice: true, status: 'approved' },
        { date: '2026-03-03', cat: 'Utilities', dept: 'General', desc: 'Electricity bill — February', amount: 48000, invoice: true, status: 'approved' },
        { date: '2026-03-01', cat: 'Events', dept: 'General', desc: 'Annual tech fest arrangements', amount: 35000, invoice: false, status: 'pending' }
    ];
    const badge = s => s === 'approved' ? 'badge-success' : 'badge-warning';
    tbody.innerHTML = data.map(r => `<tr>
        <td>${r.date}</td><td><span class="badge badge-primary">${r.cat}</span></td><td>${r.dept}</td><td>${r.desc}</td>
        <td class="fw-600">₹${r.amount.toLocaleString('en-IN')}</td>
        <td>${r.invoice ? '<i class="fas fa-paperclip text-primary"></i> Attached' : '<span class="text-muted">—</span>'}</td>
        <td><span class="badge ${badge(r.status)}">${r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span></td>
    </tr>`).join('');
}
