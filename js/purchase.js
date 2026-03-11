/* ========================================================================
   Purchase & Vendor Management Module
   ======================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    renderPurchaseStats();
    renderPurchaseTable();
    renderVendorTable();
});

function renderPurchaseStats() {
    const c = document.getElementById('purchaseStats');
    if (!c) return;
    c.innerHTML = [
        { label: 'Total Purchases', value: '₹24,50,000', icon: 'fa-shopping-cart', color: 'blue' },
        { label: 'Active Vendors', value: '18', icon: 'fa-store', color: 'teal' },
        { label: 'Pending Payments', value: '₹4,80,000', icon: 'fa-clock', color: 'orange' },
        { label: 'This Month', value: '₹6,85,000', icon: 'fa-calendar', color: 'green' }
    ].map(s => `<div class="stat-card ${s.color}"><div class="stat-icon ${s.color}"><i class="fas ${s.icon}"></i></div><div class="stat-info"><div class="stat-label">${s.label}</div><div class="stat-value">${s.value}</div></div></div>`).join('');
}

const purchaseData = [
    { po: 'PO-2026-042', date: '2026-03-10', vendor: 'Tech Solutions Pvt Ltd', cat: 'IT Hardware', items: 'Desktop Computers x10', amount: 185000, payment: 'paid' },
    { po: 'PO-2026-041', date: '2026-03-08', vendor: 'Office Supplies Co.', cat: 'Stationery', items: 'Printer cartridges, paper', amount: 12500, payment: 'paid' },
    { po: 'PO-2026-040', date: '2026-03-05', vendor: 'Lab Instruments Ltd', cat: 'Equipment', items: 'Oscilloscopes x5', amount: 96000, payment: 'pending' },
    { po: 'PO-2026-039', date: '2026-03-03', vendor: 'Modern Furnishers', cat: 'Furniture', items: 'Student desks x30', amount: 210000, payment: 'partial' },
    { po: 'PO-2026-038', date: '2026-02-28', vendor: 'Book World Publishers', cat: 'Library', items: 'Textbooks (120 copies)', amount: 58000, payment: 'paid' }
];

function renderPurchaseTable() {
    const tbody = document.getElementById('purchaseTableBody');
    if (!tbody) return;
    const badge = s => ({ paid: 'badge-success', pending: 'badge-warning', partial: 'badge-info' })[s] || 'badge-muted';
    tbody.innerHTML = purchaseData.map((r, i) => `<tr>
        <td><strong>${r.po}</strong></td><td>${r.date}</td><td>${r.vendor}</td><td><span class="badge badge-primary">${r.cat}</span></td>
        <td>${r.items}</td><td class="fw-600">₹${r.amount.toLocaleString('en-IN')}</td>
        <td><span class="badge ${badge(r.payment)}">${r.payment.charAt(0).toUpperCase() + r.payment.slice(1)}</span></td>
        <td>
            <button class="btn btn-xs btn-secondary" title="View Details" onclick="viewPurchase(${i})"><i class="fas fa-eye"></i></button>
            <button class="btn btn-xs btn-secondary" title="Download Invoice" onclick="downloadInvoice(${i})"><i class="fas fa-file-invoice"></i></button>
        </td>
    </tr>`).join('');
}

function renderVendorTable() {
    const tbody = document.getElementById('vendorTableBody');
    if (!tbody) return;
    const data = [
        { id: 'VND-001', company: 'Tech Solutions Pvt Ltd', contact: 'Amit Shah — 9876543210', cat: 'IT Hardware', orders: 14, status: 'active' },
        { id: 'VND-002', company: 'Office Supplies Co.', contact: 'Neha Gupta — 9123456789', cat: 'Stationery', orders: 28, status: 'active' },
        { id: 'VND-003', company: 'Lab Instruments Ltd', contact: 'Dr. R. Menon — 9988776655', cat: 'Equipment', orders: 8, status: 'active' },
        { id: 'VND-004', company: 'Modern Furnishers', contact: 'Rajiv Kapoor — 9876501234', cat: 'Furniture', orders: 5, status: 'active' },
        { id: 'VND-005', company: 'Book World Publishers', contact: 'Sanjay Verma — 9111222333', cat: 'Books', orders: 12, status: 'inactive' }
    ];
    tbody.innerHTML = data.map(r => `<tr>
        <td><strong>${r.id}</strong></td><td>${r.company}</td><td>${r.contact}</td><td><span class="badge badge-primary">${r.cat}</span></td>
        <td>${r.orders}</td>
        <td><span class="badge ${r.status === 'active' ? 'badge-success' : 'badge-muted'}">${r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span></td>
    </tr>`).join('');
}

function viewPurchase(index) {
    const r = purchaseData[index];
    if (!r) return;
    const payBadge = { paid: 'badge-success', pending: 'badge-warning', partial: 'badge-info' };
    document.getElementById('detailModalTitle').textContent = 'Purchase Order — ' + r.po;
    document.getElementById('detailModalBody').innerHTML = `
        <div style="border:1px solid var(--border);border-radius:var(--radius-md);padding:20px;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;font-size:0.88rem;">
                <div><span style="color:var(--text-muted);font-size:0.78rem;display:block">Purchase Order</span><strong>${r.po}</strong></div>
                <div><span style="color:var(--text-muted);font-size:0.78rem;display:block">Date</span><strong>${r.date}</strong></div>
                <div><span style="color:var(--text-muted);font-size:0.78rem;display:block">Vendor</span><strong>${r.vendor}</strong></div>
                <div><span style="color:var(--text-muted);font-size:0.78rem;display:block">Category</span><span class="badge badge-primary">${r.cat}</span></div>
                <div><span style="color:var(--text-muted);font-size:0.78rem;display:block">Items</span><strong>${r.items}</strong></div>
                <div><span style="color:var(--text-muted);font-size:0.78rem;display:block">Amount</span><strong style="font-size:1.1rem;color:var(--primary);">₹${r.amount.toLocaleString('en-IN')}</strong></div>
                <div><span style="color:var(--text-muted);font-size:0.78rem;display:block">Payment Status</span><span class="badge ${payBadge[r.payment] || 'badge-muted'}">${r.payment.charAt(0).toUpperCase() + r.payment.slice(1)}</span></div>
                <div><span style="color:var(--text-muted);font-size:0.78rem;display:block">Invoice</span><i class="fas fa-paperclip text-primary"></i> Attached</div>
            </div>
        </div>
    `;
    const actionBtn = document.getElementById('detailModalAction');
    actionBtn.style.display = 'inline-flex';
    actionBtn.innerHTML = '<i class="fas fa-download"></i> Download Invoice';
    actionBtn.onclick = () => downloadInvoice(index);
    openModal('detailViewModal');
}

function downloadInvoice(index) {
    const r = purchaseData[index];
    if (!r) return;
    const content = `
PURCHASE ORDER INVOICE
========================================
PO Number    : ${r.po}
Date         : ${r.date}
Vendor       : ${r.vendor}
Category     : ${r.cat}
Items        : ${r.items}
Amount       : ₹${r.amount.toLocaleString('en-IN')}
Payment      : ${r.payment.charAt(0).toUpperCase() + r.payment.slice(1)}
========================================
Government College — Accounts Department
    `.trim();
    const blob = new Blob([content], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Invoice_${r.po}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
}
