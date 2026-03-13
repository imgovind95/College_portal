/* ========================================================================
   Student Fee Management — API Integrated
   ======================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    loadFees();
    setupFeeFilters();

    // Export button — download CSV
    const exportBtn = document.getElementById('exportFeesBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const data = window._feeStudents || getDefaultFeeData();
            const header = 'Student ID,Name,Department,Semester,Fee Type,Amount,Status\n';
            const csv = header + data.map(r =>
                `${r.studentId},${r.name},${r.department},${r.semester},${r.feeType},${r.amount},${r.status}`
            ).join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'student_fees_export.csv';
            a.click();
            URL.revokeObjectURL(a.href);
        });
    }

    // Print button
    const printBtn = document.getElementById('printFeesBtn');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }
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
    window._currentFeeList = students;
    const badge = s => ({ paid: 'badge-success', pending: 'badge-warning', overdue: 'badge-danger' })[s] || 'badge-muted';
    tbody.innerHTML = students.map((r, i) => `<tr>
        <td><strong>${escapeHtml(r.studentId)}</strong></td><td>${escapeHtml(r.name)}</td><td>${escapeHtml(r.department)}</td><td>${escapeHtml(r.semester)}</td>
        <td>${escapeHtml(r.feeType)}</td><td class="fw-600">₹${r.amount.toLocaleString('en-IN')}</td>
        <td><span class="badge ${badge(r.status)}">${r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span></td>
        <td>
            <div style="display:flex;gap:8px;">
                ${r.status !== 'paid' ? `<button class="btn btn-xs btn-success" title="Record Payment" onclick="openPaymentModal(${i})"><i class="fas fa-wallet"></i> Pay</button>` : ''}
                <button class="btn btn-xs btn-primary" title="View Receipt" onclick="viewReceipt(${i})">Receipt</button>
            </div>
        </td>
    </tr>`).join('');
}

// View fee receipt in modal
function viewReceipt(index) {
    const data = window._currentFeeList || window._feeStudents || getDefaultFeeData();
    const r = data[index];
    if (!r) return;
    const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    document.getElementById('detailModalTitle').textContent = 'Fee Receipt — ' + r.studentId;
    document.getElementById('detailModalBody').innerHTML = `
        <div style="border:2px solid var(--primary);border-radius:var(--radius-md);padding:24px;">
            <div style="text-align:center;margin-bottom:20px;border-bottom:2px solid var(--border);padding-bottom:16px;">
                <h3 style="color:var(--primary);font-size:1.1rem;">Government College — Fee Receipt</h3>
                <p style="color:var(--text-muted);font-size:0.82rem;">Date: ${date}</p>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px 24px;font-size:0.88rem;margin-bottom:20px;">
                <div><strong>Student ID:</strong> ${escapeHtml(r.studentId)}</div>
                <div><strong>Name:</strong> ${escapeHtml(r.name)}</div>
                <div><strong>Department:</strong> ${escapeHtml(r.department)}</div>
                <div><strong>Semester:</strong> ${escapeHtml(r.semester)}</div>
                <div><strong>Fee Type:</strong> ${escapeHtml(r.feeType)}</div>
                <div><strong>Status:</strong> <span class="badge ${r.status === 'paid' ? 'badge-success' : r.status === 'overdue' ? 'badge-danger' : 'badge-warning'}">${r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span></div>
            </div>
            <div style="background:var(--primary-light);padding:14px 20px;border-radius:var(--radius);display:flex;justify-content:space-between;align-items:center;">
                <span style="font-weight:700;font-size:1rem;">Amount</span>
                <span style="font-weight:800;font-size:1.2rem;color:var(--primary);">₹${r.amount.toLocaleString('en-IN')}</span>
            </div>
        </div>
    `;
    const actionBtn = document.getElementById('detailModalAction');
    actionBtn.style.display = 'inline-flex';
    actionBtn.innerHTML = '<i class="fas fa-download"></i> Download Receipt';
    actionBtn.onclick = () => {
        const content = `
FEE RECEIPT — GOVERNMENT COLLEGE
========================================
Receipt Date : ${date}
Student ID   : ${r.studentId}
Name         : ${r.name}
Department   : ${r.department}
Semester     : ${r.semester}
Fee Type     : ${r.feeType}
Amount       : ₹${r.amount.toLocaleString('en-IN')}
Status       : ${r.status.charAt(0).toUpperCase() + r.status.slice(1)}
========================================
This is a system-generated receipt.
        `.trim();
        const blob = new Blob([content], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `Receipt_${r.studentId}.txt`;
        a.click();
        URL.revokeObjectURL(a.href);
    };
    openModal('detailViewModal');
}

// Open Payment Modal
function openPaymentModal(index) {
    const data = window._currentFeeList || window._feeStudents || getDefaultFeeData();
    const r = data[index];
    if (!r) return;
    
    document.getElementById('payModalStudentName').textContent = r.name;
    document.getElementById('payModalStudentId').textContent = r.studentId;
    document.getElementById('payModalFeeType').textContent = r.feeType;
    document.getElementById('payModalAmount').textContent = `₹${r.amount.toLocaleString('en-IN')}`;
    document.getElementById('payModalRecordId').value = r._id;
    
    openModal('recordPaymentModal');
}

document.addEventListener('DOMContentLoaded', () => {
    const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
    if (confirmPaymentBtn) {
        confirmPaymentBtn.addEventListener('click', async () => {
            const recordId = document.getElementById('payModalRecordId').value;
            if (!recordId) return;
            
            confirmPaymentBtn.disabled = true;
            confirmPaymentBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            
            try {
                // Update fee status via existing PUT API
                await api(`/fees/${recordId}`, {
                    method: 'PUT',
                    body: JSON.stringify({ status: 'paid' })
                });
                
                closeModal('recordPaymentModal');
                
                // Show success message and reload table
                const msg = document.createElement('div');
                msg.innerHTML = '<div style="position:fixed;top:20px;right:20px;background:var(--success);color:#fff;padding:12px 20px;border-radius:6px;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,0.15);"><i class="fas fa-check-circle"></i> Payment Recorded Successfully!</div>';
                document.body.appendChild(msg);
                setTimeout(() => msg.remove(), 3000);
                
                loadFees();
            } catch (err) {
                alert('Failed to record payment: ' + err.message);
            } finally {
                confirmPaymentBtn.disabled = false;
                confirmPaymentBtn.innerHTML = '<i class="fas fa-check"></i> Confirm Payment';
            }
        });
    }
});

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

/* ========================================================================
   CSV Bulk Import Logic
   ======================================================================== */

// Simple CSV parser — handles quoted fields and commas inside quotes
function parseCSV(text) {
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
        const vals = [];
        let current = '';
        let inQuote = false;
        for (const ch of lines[i]) {
            if (ch === '"') { inQuote = !inQuote; continue; }
            if (ch === ',' && !inQuote) { vals.push(current.trim()); current = ''; continue; }
            current += ch;
        }
        vals.push(current.trim());
        if (vals.length >= headers.length) {
            const obj = {};
            headers.forEach((h, idx) => { obj[h] = vals[idx] || ''; });
            rows.push(obj);
        }
    }
    return rows;
}

// Parsed data holder
let _pendingCsvRecords = [];

document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('csvFileInput');
    const importBtn = document.getElementById('importCsvBtn');
    const sampleBtn = document.getElementById('downloadSampleCsvBtn');
    const previewArea = document.getElementById('csvPreviewArea');
    const previewHead = document.getElementById('csvPreviewHead');
    const previewBody = document.getElementById('csvPreviewBody');
    const rowCount = document.getElementById('csvRowCount');
    const statusArea = document.getElementById('importStatusArea');

    // Download sample CSV
    if (sampleBtn) {
        sampleBtn.addEventListener('click', () => {
            const sample = `studentId,name,department,semester,feeType,amount,status
STU-2026-101,Rahul Sharma,Computer Science,Semester 2,Tuition Fee,24500,pending
STU-2026-102,Sneha Verma,Electronics,Semester 4,Lab Fee,8000,paid
STU-2026-103,Amit Yadav,Mechanical,Semester 6,Exam Fee,5500,overdue`;
            const blob = new Blob([sample], { type: 'text/csv' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'sample_student_fees.csv';
            a.click();
            URL.revokeObjectURL(a.href);
        });
    }

    // File selected → parse & preview
    if (fileInput) {
        fileInput.addEventListener('change', () => {
            statusArea.style.display = 'none';
            const file = fileInput.files[0];
            if (!file) { previewArea.style.display = 'none'; importBtn.disabled = true; _pendingCsvRecords = []; return; }
            const reader = new FileReader();
            reader.onload = (e) => {
                const records = parseCSV(e.target.result);
                _pendingCsvRecords = records;
                if (records.length === 0) {
                    previewArea.style.display = 'none';
                    importBtn.disabled = true;
                    alert('CSV file is empty or format is incorrect. Please use the sample format.');
                    return;
                }
                // Show preview
                const headers = Object.keys(records[0]);
                previewHead.innerHTML = '<tr>' + headers.map(h => `<th>${escapeHtml(h)}</th>`).join('') + '</tr>';
                const previewRows = records.slice(0, 5);
                previewBody.innerHTML = previewRows.map(r => '<tr>' + headers.map(h => `<td>${escapeHtml(r[h] || '')}</td>`).join('') + '</tr>').join('');
                rowCount.textContent = `Total ${records.length} record(s) found in file.`;
                previewArea.style.display = 'block';
                importBtn.disabled = false;
            };
            reader.readAsText(file);
        });
    }

    // Upload & Import
    if (importBtn) {
        importBtn.addEventListener('click', async () => {
            if (_pendingCsvRecords.length === 0) return;
            importBtn.disabled = true;
            importBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Importing...';
            statusArea.style.display = 'none';

            try {
                const result = await api('/fees/bulk-import', {
                    method: 'POST',
                    body: JSON.stringify({ records: _pendingCsvRecords })
                });

                // Show result summary
                const isSuccess = result.inserted > 0;
                statusArea.style.display = 'block';
                statusArea.style.background = isSuccess ? '#d4edda' : '#fff3cd';
                statusArea.style.color = isSuccess ? '#155724' : '#856404';
                statusArea.innerHTML = `
                    <p style="font-weight:700;margin:0 0 6px;"><i class="fas ${isSuccess ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> Import ${isSuccess ? 'Successful' : 'Completed'}</p>
                    <p style="margin:0;font-size:0.88rem;">
                        Total rows: <strong>${result.total}</strong> &nbsp;|&nbsp;
                        Inserted: <strong style="color:#28a745;">${result.inserted}</strong> &nbsp;|&nbsp;
                        Duplicates skipped: <strong style="color:#dc3545;">${result.duplicates}</strong> &nbsp;|&nbsp;
                        Validation errors: <strong style="color:#dc3545;">${result.validationErrors}</strong>
                    </p>
                    ${result.errors && result.errors.length > 0 ? '<p style="margin:8px 0 0;font-size:0.82rem;">Errors: ' + result.errors.map(e => `Row ${e.row}: ${escapeHtml(e.message)}`).join(', ') + '</p>' : ''}
                `;

                // Refresh the fee table
                if (result.inserted > 0) loadFees();
            } catch (err) {
                statusArea.style.display = 'block';
                statusArea.style.background = '#f8d7da';
                statusArea.style.color = '#721c24';
                statusArea.innerHTML = `<p style="font-weight:700;margin:0;"><i class="fas fa-times-circle"></i> Import Failed</p><p style="margin:4px 0 0;font-size:0.88rem;">${escapeHtml(err.message)}</p>`;
            } finally {
                importBtn.disabled = false;
                importBtn.innerHTML = '<i class="fas fa-upload"></i> Upload & Import';
            }
        });
    }
});
