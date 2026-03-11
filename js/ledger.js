/* ========================================================================
   Financial Records & Ledger Module
   ======================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    renderLedgerTable();
    renderCashbookTable();
    renderBankTable();
});

function renderLedgerTable() {
    const tbody = document.getElementById('ledgerTableBody');
    if (!tbody) return;
    const data = [
        { date: '2026-03-10', voucher: 'VCH-0451', desc: 'Student fee collection — Sem 4 batch', debit: 0, credit: 245000, balance: 3485000 },
        { date: '2026-03-09', voucher: 'VCH-0450', desc: 'Salary payment — March (partial)', debit: 860000, credit: 0, balance: 3240000 },
        { date: '2026-03-08', voucher: 'VCH-0449', desc: 'Lab equipment purchase — CS Dept', debit: 185000, credit: 0, balance: 4100000 },
        { date: '2026-03-07', voucher: 'VCH-0448', desc: 'Government grant received', debit: 0, credit: 500000, balance: 4285000 },
        { date: '2026-03-06', voucher: 'VCH-0447', desc: 'Scholarship disbursement', debit: 75000, credit: 0, balance: 3785000 },
        { date: '2026-03-05', voucher: 'VCH-0446', desc: 'Student fee collection — Sem 2 batch', debit: 0, credit: 196000, balance: 3860000 },
        { date: '2026-03-04', voucher: 'VCH-0445', desc: 'Electricity & water bills', debit: 48000, credit: 0, balance: 3664000 },
        { date: '2026-03-03', voucher: 'VCH-0444', desc: 'Stationery purchase', debit: 8200, credit: 0, balance: 3712000 }
    ];
    tbody.innerHTML = data.map(r => `<tr>
        <td>${r.date}</td><td><strong>${r.voucher}</strong></td><td>${r.desc}</td>
        <td class="${r.debit ? 'text-danger fw-600' : 'text-muted'}">${r.debit ? '₹' + r.debit.toLocaleString('en-IN') : '—'}</td>
        <td class="${r.credit ? 'text-success fw-600' : 'text-muted'}">${r.credit ? '₹' + r.credit.toLocaleString('en-IN') : '—'}</td>
        <td class="fw-700">₹${r.balance.toLocaleString('en-IN')}</td>
    </tr>`).join('');
}

function renderCashbookTable() {
    const tbody = document.getElementById('cashbookTableBody');
    if (!tbody) return;
    const data = [
        { date: '2026-03-10', receipt: 'RCT-312', desc: 'Miscellaneous fee — walk-in', cashIn: 5500, cashOut: 0, balance: 142500 },
        { date: '2026-03-09', receipt: 'RCT-311', desc: 'Travel reimbursement — Prof. Gupta', cashIn: 0, cashOut: 3200, balance: 137000 },
        { date: '2026-03-08', receipt: 'RCT-310', desc: 'Canteen lease payment received', cashIn: 15000, cashOut: 0, balance: 140200 },
        { date: '2026-03-07', receipt: 'RCT-309', desc: 'Petty cash — office supplies', cashIn: 0, cashOut: 2800, balance: 125200 },
        { date: '2026-03-06', receipt: 'RCT-308', desc: 'Library fine collection', cashIn: 1800, cashOut: 0, balance: 128000 }
    ];
    tbody.innerHTML = data.map(r => `<tr>
        <td>${r.date}</td><td><strong>${r.receipt}</strong></td><td>${r.desc}</td>
        <td class="${r.cashIn ? 'text-success fw-600' : 'text-muted'}">${r.cashIn ? '₹' + r.cashIn.toLocaleString('en-IN') : '—'}</td>
        <td class="${r.cashOut ? 'text-danger fw-600' : 'text-muted'}">${r.cashOut ? '₹' + r.cashOut.toLocaleString('en-IN') : '—'}</td>
        <td class="fw-700">₹${r.balance.toLocaleString('en-IN')}</td>
    </tr>`).join('');
}

function renderBankTable() {
    const tbody = document.getElementById('bankTableBody');
    if (!tbody) return;
    const data = [
        { date: '2026-03-10', txn: 'TXN-88541', bank: 'SBI — Main A/C', type: 'NEFT Credit', amount: 500000, balance: 4285000 },
        { date: '2026-03-09', txn: 'TXN-88540', bank: 'SBI — Main A/C', type: 'RTGS Debit', amount: -860000, balance: 3785000 },
        { date: '2026-03-08', txn: 'TXN-88539', bank: 'SBI — Main A/C', type: 'UPI Credit', amount: 24500, balance: 4645000 },
        { date: '2026-03-07', txn: 'TXN-88538', bank: 'PNB — Scholarship A/C', type: 'NEFT Debit', amount: -75000, balance: 680000 },
        { date: '2026-03-06', txn: 'TXN-88537', bank: 'SBI — Main A/C', type: 'Cheque Credit', amount: 196000, balance: 4620500 }
    ];
    tbody.innerHTML = data.map(r => `<tr>
        <td>${r.date}</td><td><strong>${r.txn}</strong></td><td>${r.bank}</td>
        <td><span class="badge ${r.amount > 0 ? 'badge-success' : 'badge-danger'}">${r.type}</span></td>
        <td class="fw-600 ${r.amount > 0 ? 'text-success' : 'text-danger'}">${r.amount > 0 ? '+' : ''}₹${Math.abs(r.amount).toLocaleString('en-IN')}</td>
        <td class="fw-700">₹${r.balance.toLocaleString('en-IN')}</td>
    </tr>`).join('');
}

// Generate and download financial statement
function generateStatement() {
    const now = new Date();
    const month = now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    const content = `
GOVERNMENT COLLEGE — FINANCIAL STATEMENT
Generated: ${now.toLocaleDateString('en-IN')} ${now.toLocaleTimeString('en-IN')}
Period: ${month}
================================================================

GENERAL LEDGER SUMMARY
----------------------------------------------------------------
Date          Voucher     Particulars                    Debit         Credit        Balance
2026-03-10    VCH-0451    Fee collection Sem 4           —             ₹2,45,000     ₹34,85,000
2026-03-09    VCH-0450    Salary March (partial)         ₹8,60,000    —             ₹32,40,000
2026-03-08    VCH-0449    Lab equipment CS Dept          ₹1,85,000    —             ₹41,00,000
2026-03-07    VCH-0448    Government grant               —             ₹5,00,000     ₹42,85,000
2026-03-06    VCH-0447    Scholarship disbursement       ₹75,000      —             ₹37,85,000
2026-03-05    VCH-0446    Fee collection Sem 2           —             ₹1,96,000     ₹38,60,000
2026-03-04    VCH-0445    Electricity & water            ₹48,000      —             ₹36,64,000
2026-03-03    VCH-0444    Stationery purchase            ₹8,200       —             ₹37,12,000
----------------------------------------------------------------

CASH BOOK SUMMARY
Balance: ₹1,42,500

BANK ACCOUNT SUMMARY
SBI Main A/C Balance   : ₹42,85,000
PNB Scholarship A/C    : ₹6,80,000

================================================================
Prepared by: Accounts Department
Verified by: ________________________
This is a system-generated document.
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Financial_Statement_${month.replace(/ /g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
}
