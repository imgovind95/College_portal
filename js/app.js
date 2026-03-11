/* ========================================================================
   GCAMS — Core Application Logic with Secure API Integration
   ======================================================================== */

// ==========================================
// API Configuration
// ==========================================
const API_BASE = window.location.origin + '/api';
let authToken = localStorage.getItem('gcams_token') || null;

// Secure API helper — attaches JWT token to every request
async function api(endpoint, options = {}) {
    const config = {
        headers: { 'Content-Type': 'application/json' },
        ...options
    };
    if (authToken) {
        config.headers['Authorization'] = `Bearer ${authToken}`;
    }
    try {
        const res = await fetch(`${API_BASE}${endpoint}`, config);
        if (res.status === 401) {
            // Token expired or invalid — redirect to login
            localStorage.removeItem('gcams_token');
            localStorage.removeItem('gcams_user');
            authToken = null;
            window.location.href = 'index.html';
            return null;
        }
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Request failed');
        return data;
    } catch (err) {
        console.error(`API Error [${endpoint}]:`, err.message);
        throw err;
    }
}

// ==========================================
// Session & Inactivity Timeout (30 min)
// ==========================================
let inactivityTimer;
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        alert('Session expired due to inactivity. Please log in again.');
        localStorage.removeItem('gcams_token');
        localStorage.removeItem('gcams_user');
        authToken = null;
        window.location.href = 'index.html';
    }, SESSION_TIMEOUT);
}

// Track user activity
['click', 'keypress', 'scroll', 'mousemove'].forEach(event => {
    document.addEventListener(event, resetInactivityTimer);
});

// ==========================================
// Initialization
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    const user = JSON.parse(localStorage.getItem('gcams_user') || 'null');
    if (!user || !authToken) {
        window.location.href = 'index.html';
        return;
    }

    // Set user info in header and sidebar
    const nameEl = document.getElementById('headerUserName');
    const avatarEl = document.getElementById('headerAvatar');
    const sidebarNameEl = document.getElementById('sidebarName');
    const sidebarRoleEl = document.getElementById('sidebarRole');
    const sidebarAvatarEl = document.getElementById('sidebarAvatar');

    if (nameEl) nameEl.textContent = user.name || 'User';
    if (avatarEl) avatarEl.textContent = (user.name || 'U')[0].toUpperCase();
    if (sidebarNameEl) sidebarNameEl.textContent = user.name || 'User';
    if (sidebarRoleEl) sidebarRoleEl.textContent = user.role || 'accountant';
    if (sidebarAvatarEl) sidebarAvatarEl.textContent = (user.name || 'U')[0].toUpperCase();

    // Set date
    const dateEl = document.getElementById('headerDate');
    if (dateEl) dateEl.textContent = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    // Setup sidebar navigation
    setupSidebar();

    // Setup modals
    setupModals();

    // Setup tabs
    setupTabs();

    // Start inactivity timer
    resetInactivityTimer();

    // Logout
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', async () => {
            try { await api('/auth/logout', { method: 'POST' }); } catch (e) { /* Continue logout regardless */ }
            localStorage.removeItem('gcams_token');
            localStorage.removeItem('gcams_user');
            authToken = null;
            window.location.href = 'index.html';
        });
    }
});

// ==========================================
// Sidebar Navigation
// ==========================================
const moduleNames = {
    dashboard: 'Dashboard', fees: 'Student Fee Management', payroll: 'Payroll Management',
    budget: 'Budget & Expenses', purchase: 'Purchase & Vendor Management',
    scholarship: 'Scholarship Management', ledger: 'Financial Records', audit: 'Audit & Reports'
};

function setupSidebar() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link[data-module]');
    const sections = document.querySelectorAll('.module-section');
    const headerTitle = document.getElementById('headerTitle');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            const mod = link.dataset.module;

            // Update active link
            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Show active module section
            sections.forEach(s => s.classList.remove('active'));
            const target = document.getElementById('mod-' + mod);
            if (target) target.classList.add('active');

            // Update header title
            if (headerTitle) headerTitle.textContent = moduleNames[mod] || 'Dashboard';

            // Close sidebar on mobile
            if (window.innerWidth < 1024) {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
            }
        });
    });

    // Sidebar toggle (mobile/tablet)
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('active');
        });
    }
    if (overlay) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        });
    }
}

// ==========================================
// Modals
// ==========================================
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('active');
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active');
}

function setupModals() {
    // Open modals via data-modal-target attribute
    document.querySelectorAll('[data-modal-target]').forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-modal-target');
            openModal(modalId);
        });
    });

    // Close modals via data-modal-close attribute
    document.querySelectorAll('[data-modal-close]').forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-modal-close');
            closeModal(modalId);
        });
    });

    // Close modal when clicking the overlay background
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.classList.remove('active');
        });
    });
}

// ==========================================
// Tabs
// ==========================================
function setupTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabGroup = btn.closest('.tabs');
            const panes = btn.closest('.module-section').querySelectorAll('.tab-pane');

            tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            panes.forEach(p => p.classList.remove('active'));
            const target = document.getElementById(btn.dataset.tab);
            if (target) target.classList.add('active');
        });
    });
}

// ==========================================
// XSS-safe text rendering
// ==========================================
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
}
