// Global variables
const LOGGED_IN_USER = 'Mike';

// Mock taxpayer database
const TAXPAYERS_DB = [
  {
    accountId: '02082601',
    lastName: 'Dela Cruz',
    firstName: 'Junjun',
    middleName: 'De Leon',
    birthdate: '01/01/2001',
    address: 'Quezon City',
    email: 'junjun@email.com'
  },
  {
    accountId: '02082602',
    lastName: 'Santos',
    firstName: 'Maria',
    middleName: 'Garcia',
    birthdate: '05/15/1995',
    address: 'Manila',
    email: 'maria@email.com'
  },
  {
    accountId: '02082603',
    lastName: 'Reyes',
    firstName: 'Pedro',
    middleName: 'Santos',
    birthdate: '12/20/1988',
    address: 'Pasig City',
    email: 'pedro@email.com'
  },
  {
    accountId: '02082604',
    lastName: 'Garcia',
    firstName: 'Ana',
    middleName: 'Lopez',
    birthdate: '03/08/1992',
    address: 'Makati City',
    email: 'ana@email.com'
  },
  {
    accountId: '02082605',
    lastName: 'Mendoza',
    firstName: 'Carlos',
    middleName: 'Rivera',
    birthdate: '07/22/1990',
    address: 'Taguig City',
    email: 'carlos@email.com'
  }
];

// Set current date
function setCurrentDate() {
  const dateElement = document.getElementById('currentDate');
  if (!dateElement) return;
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const today = new Date();
  dateElement.textContent = today.toLocaleDateString('en-US', options);
}

// Sidebar toggle
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');
const sidebarFloatToggle = document.getElementById('sidebarFloatToggle');
const mobileBreakpoint = 1024;

function toggleSidebar() {
  if (!sidebar) return;

  if (window.innerWidth <= mobileBreakpoint) {
    sidebar.classList.toggle('active');
    return;
  }

  document.body.classList.toggle('sidebar-collapsed');
}

if (sidebarToggle) {
  sidebarToggle.addEventListener('click', toggleSidebar);
}

if (sidebarFloatToggle) {
  sidebarFloatToggle.addEventListener('click', toggleSidebar);
}

window.addEventListener('resize', () => {
  if (window.innerWidth > mobileBreakpoint) {
    sidebar?.classList.remove('active');
  }
});

// Logout function
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    window.location.href = 'index.html';
  }
}

// Generate ID Number
function generateIDNumber() {
  const today = new Date();
  const year = today.getFullYear();
  
  // Find highest ID number for this year
  const tableBody = document.getElementById('tableBody');
  const rows = tableBody ? Array.from(tableBody.querySelectorAll('tr')) : [];
  
  let maxIdNum = 0;
  const yearPrefix = `ID-${year}-`;
  
  rows.forEach(row => {
    const idCell = row.cells[1];
    if (idCell) {
      const id = idCell.textContent.trim();
      if (id.startsWith(yearPrefix)) {
        const num = parseInt(id.split('-')[2]);
        if (num > maxIdNum) {
          maxIdNum = num;
        }
      }
    }
  });
  
  const newNum = String(maxIdNum + 1).padStart(3, '0');
  return `${yearPrefix}${newNum}`;
}

// Generate ID Modal
const generateModal = document.getElementById('generateIDModal');
const previewModal = document.getElementById('previewIDModal');
let currentTaxpayer = null;

function generateNewID() {
  // Reset form
  const form = document.getElementById('generateIDForm');
  if (form) form.reset();
  
  // Generate ID number
  const idNumberField = document.getElementById('idNumber');
  if (idNumberField) {
    idNumberField.value = generateIDNumber();
  }
  
  // Set today's date as issue date
  const issueDateField = document.getElementById('issueDate');
  if (issueDateField) {
    const today = new Date();
    issueDateField.value = today.toISOString().split('T')[0];
  }
  
  // Set expiry date (1 year from now)
  const expiryDateField = document.getElementById('expiryDate');
  if (expiryDateField) {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    expiryDateField.value = nextYear.toISOString().split('T')[0];
  }
  
  // Hide taxpayer info
  const taxpayerInfo = document.getElementById('taxpayerInfo');
  if (taxpayerInfo) {
    taxpayerInfo.style.display = 'none';
  }
  
  currentTaxpayer = null;
  
  generateModal.classList.add('show');
}

function closeGenerateModal() {
  generateModal.classList.remove('show');
  currentTaxpayer = null;
}

// Lookup taxpayer for ID generation
function lookupTaxpayerForID() {
  const accountIdInput = document.getElementById('accountIdInput');
  const accountId = accountIdInput.value.trim();
  
  if (!accountId) {
    showToast('error', 'Please enter an Account ID');
    return;
  }
  
  const taxpayer = TAXPAYERS_DB.find(tp => tp.accountId === accountId);
  
  if (taxpayer) {
    currentTaxpayer = taxpayer;
    
    // Show taxpayer info
    document.getElementById('fullNameDisplay').textContent = 
      `${taxpayer.firstName} ${taxpayer.middleName} ${taxpayer.lastName}`;
    document.getElementById('birthdateDisplay').textContent = taxpayer.birthdate;
    document.getElementById('addressDisplay').textContent = taxpayer.address;
    
    document.getElementById('taxpayerInfo').style.display = 'block';
    
    showToast('success', 'Taxpayer found!');
  } else {
    currentTaxpayer = null;
    document.getElementById('taxpayerInfo').style.display = 'none';
    showToast('error', 'Taxpayer not found!');
  }
}

// Handle Generate ID form submission
const generateIDForm = document.getElementById('generateIDForm');
if (generateIDForm) {
  generateIDForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!currentTaxpayer) {
      showToast('error', 'Please lookup a valid taxpayer first!');
      return;
    }
    
    const idNumber = document.getElementById('idNumber').value;
    const accountId = document.getElementById('accountIdInput').value;
    const issueDate = document.getElementById('issueDate').value;
    const expiryDate = document.getElementById('expiryDate').value;
    
    // Format dates for display
    const issueDateObj = new Date(issueDate);
    const expiryDateObj = new Date(expiryDate);
    const formattedIssue = `${String(issueDateObj.getMonth() + 1).padStart(2, '0')}/${String(issueDateObj.getDate()).padStart(2, '0')}/${issueDateObj.getFullYear()}`;
    const formattedExpiry = `${String(expiryDateObj.getMonth() + 1).padStart(2, '0')}/${String(expiryDateObj.getDate()).padStart(2, '0')}/${expiryDateObj.getFullYear()}`;
    
    const fullName = `${currentTaxpayer.firstName} ${currentTaxpayer.lastName}`;
    
    // Add to table
    const tableBody = document.getElementById('tableBody');
    if (tableBody) {
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td><input type="checkbox" class="row-checkbox"></td>
        <td>${idNumber}</td>
        <td>${accountId}</td>
        <td>${fullName}</td>
        <td>${formattedIssue}</td>
        <td>${formattedExpiry}</td>
        <td><span class="status-badge active">Active</span></td>
        <td>${formattedIssue}</td>
        <td>
          <button class="icon-action-btn preview-btn" title="Preview ID">
            <i class="fas fa-eye"></i>
          </button>
          <button class="icon-action-btn print-btn-icon" title="Print ID">
            <i class="fas fa-print"></i>
          </button>
          <button class="icon-action-btn renew-btn" title="Renew ID">
            <i class="fas fa-sync"></i>
          </button>
        </td>
      `;
      
      // Store full taxpayer data
      newRow.dataset.taxpayer = JSON.stringify(currentTaxpayer);
      newRow.dataset.idNumber = idNumber;
      newRow.dataset.expiry = formattedExpiry;
      
      tableBody.insertBefore(newRow, tableBody.firstChild);
    }
    
    showToast('success', 'ID Card generated successfully!');
    closeGenerateModal();
    applyTableState(true);
  });
}

// Preview ID Card
function previewIDCard(row) {
  const cells = row.cells;
  
  document.getElementById('previewIDNo').textContent = cells[1].textContent;
  document.getElementById('previewName').textContent = cells[3].textContent.toUpperCase();
  document.getElementById('previewAccountID').textContent = cells[2].textContent;
  document.getElementById('previewExpiry').textContent = cells[5].textContent;
  
  previewModal.classList.add('show');
}

function closePreviewModal() {
  previewModal.classList.remove('show');
}

// Print ID Card
function printIDCard() {
  window.print();
}

// Print Selected IDs
function printSelected() {
  const checkboxes = document.querySelectorAll('.row-checkbox:checked');
  if (checkboxes.length === 0) {
    showToast('info', 'Please select at least one ID to print');
    return;
  }
  
  showToast('success', `Printing ${checkboxes.length} ID card(s)...`);
  // In real app, would send to printer
}

// Export IDs
function exportIDs() {
  showToast('success', 'Exporting ID data to Excel...');
  // In real app, would generate Excel file
}

// Event delegation for action buttons
document.addEventListener('click', (e) => {
  const row = e.target.closest('tr');
  
  if (e.target.closest('.preview-btn')) {
    previewIDCard(row);
  }
  
  if (e.target.closest('.print-btn-icon')) {
    const idNumber = row.cells[1].textContent;
    showToast('success', `Printing ID: ${idNumber}`);
  }
  
  if (e.target.closest('.renew-btn')) {
    const idNumber = row.cells[1].textContent;
    const name = row.cells[3].textContent;
    if (confirm(`Renew ID ${idNumber} for ${name}?`)) {
      // Update expiry date
      const newExpiry = new Date();
      newExpiry.setFullYear(newExpiry.getFullYear() + 1);
      const formattedExpiry = `${String(newExpiry.getMonth() + 1).padStart(2, '0')}/${String(newExpiry.getDate()).padStart(2, '0')}/${newExpiry.getFullYear()}`;
      
      row.cells[5].textContent = formattedExpiry;
      row.cells[6].innerHTML = '<span class="status-badge active">Active</span>';
      
      showToast('success', 'ID renewed successfully!');
    }
  }
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
  if (e.target === generateModal) {
    closeGenerateModal();
  }
  if (e.target === previewModal) {
    closePreviewModal();
  }
});

// Select All checkbox
const selectAll = document.getElementById('selectAll');
if (selectAll) {
  selectAll.addEventListener('change', function() {
    const checkboxes = document.querySelectorAll('.row-checkbox');
    checkboxes.forEach(cb => {
      cb.checked = this.checked;
    });
  });
}

// Table search + pagination + filtering
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const tableBody = document.getElementById('tableBody');
const rowsPerPageSelect = document.getElementById('rowsPerPage');
const tableSummary = document.getElementById('tableSummary');
const pageNumbersContainer = document.getElementById('pageNumbers');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentPage = 1;

function getAllRows() {
  if (!tableBody) return [];
  return Array.from(tableBody.querySelectorAll('tr'));
}

function getSearchTerm() {
  return (searchInput?.value || '').trim().toLowerCase();
}

function getStatusFilter() {
  return statusFilter?.value || '';
}

function getRowsPerPage() {
  return Number(rowsPerPageSelect?.value || 10);
}

function renderPageNumbers(totalPages) {
  if (!pageNumbersContainer) return;
  pageNumbersContainer.innerHTML = '';

  const maxButtons = 5;
  const half = Math.floor(maxButtons / 2);
  let startPage = Math.max(1, currentPage - half);
  let endPage = Math.min(totalPages, startPage + maxButtons - 1);

  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  for (let page = startPage; page <= endPage; page++) {
    const button = document.createElement('button');
    button.className = `page-num${page === currentPage ? ' active' : ''}`;
    button.textContent = page;
    button.addEventListener('click', () => {
      currentPage = page;
      applyTableState();
    });
    pageNumbersContainer.appendChild(button);
  }
}

function updateTableSummary(totalRows, startIndex, endIndex) {
  if (!tableSummary) return;
  if (totalRows === 0) {
    tableSummary.textContent = 'Showing 0 of 0 ID cards';
    return;
  }
  tableSummary.textContent = `Showing ${startIndex + 1}-${endIndex} of ${totalRows} ID cards`;
}

function applyTableState(resetPage = false) {
  const allRows = getAllRows();
  const searchTerm = getSearchTerm();
  const statusFilterValue = getStatusFilter();
  const rowsPerPage = getRowsPerPage();

  const filteredRows = allRows.filter((row) => {
    const matchesSearch = row.textContent.toLowerCase().includes(searchTerm);
    
    let matchesStatus = true;
    if (statusFilterValue) {
      const statusBadge = row.querySelector('.status-badge');
      const rowStatus = statusBadge ? statusBadge.textContent.trim() : '';
      matchesStatus = rowStatus === statusFilterValue;
    }
    
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));

  if (resetPage) currentPage = 1;
  if (currentPage > totalPages) currentPage = totalPages;

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredRows.length);
  const visibleRows = filteredRows.slice(startIndex, endIndex);

  allRows.forEach((row) => {
    row.style.display = 'none';
  });

  visibleRows.forEach((row) => {
    row.style.display = '';
  });

  updateTableSummary(filteredRows.length, startIndex, endIndex);
  renderPageNumbers(totalPages);

  if (prevBtn) prevBtn.disabled = currentPage <= 1;
  if (nextBtn) nextBtn.disabled = currentPage >= totalPages || filteredRows.length === 0;
}

if (searchInput) {
  searchInput.addEventListener('input', () => {
    applyTableState(true);
  });
}

if (statusFilter) {
  statusFilter.addEventListener('change', () => {
    applyTableState(true);
  });
}

if (rowsPerPageSelect) {
  rowsPerPageSelect.addEventListener('change', () => {
    applyTableState(true);
  });
}

if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage -= 1;
      applyTableState();
    }
  });
}

if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    currentPage += 1;
    applyTableState();
  });
}

// Toast notification
function showToast(type, message) {
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    info: 'fa-info-circle'
  };
  
  const colors = {
    success: '#48bb78',
    error: '#f56565',
    info: '#4299e1'
  };
  
  toast.innerHTML = `
    <i class="fas ${icons[type]}"></i>
    <span>${message}</span>
  `;
  
  toast.style.cssText = `
    position: fixed;
    top: 30px;
    right: 30px;
    background: white;
    padding: 18px 24px;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    font-weight: 600;
    z-index: 10000;
    border-left: 4px solid ${colors[type]};
    transform: translateX(400px);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  `;
  
  toast.querySelector('i').style.color = colors[type];
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.transform = 'translateX(0)';
    toast.style.opacity = '1';
  }, 100);
  
  setTimeout(() => {
    toast.style.transform = 'translateX(400px)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
  if (window.innerWidth <= mobileBreakpoint) {
    if (!sidebar?.contains(e.target) && !e.target.closest('#sidebarFloatToggle')) {
      sidebar?.classList.remove('active');
    }
  }
});

// Set logged in username
const sidebarUsername = document.getElementById('sidebarUsername');
if (sidebarUsername) {
  sidebarUsername.textContent = LOGGED_IN_USER;
}

// Initialize
setCurrentDate();
applyTableState(true);