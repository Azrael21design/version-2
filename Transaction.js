// Global variables
const LOGGED_IN_USER = 'Mike'; // This would come from login session in real app

// Mock taxpayer database (in real app, this would come from server/database)
const TAXPAYERS_DB = [
  {
    accountId: '02082601',
    lastName: 'Dela Cruz',
    firstName: 'Junjun',
    middleName: 'De Leon',
    birthdate: '01/01/2001',
    email: 'junjun@email.com',
    address: 'Quezon City',
    gender: 'Male',
    citizenship: 'Filipino',
    mobileNo: '09171234567'
  },
  {
    accountId: '02082602',
    lastName: 'Santos',
    firstName: 'Maria',
    middleName: 'Garcia',
    birthdate: '05/15/1995',
    email: 'maria@email.com',
    address: 'Manila',
    gender: 'Female',
    citizenship: 'Filipino',
    mobileNo: '09181234567'
  },
  {
    accountId: '02082603',
    lastName: 'Reyes',
    firstName: 'Pedro',
    middleName: 'Santos',
    birthdate: '12/20/1988',
    email: 'pedro@email.com',
    address: 'Pasig City',
    gender: 'Male',
    citizenship: 'Filipino',
    mobileNo: '09191234567'
  },
  {
    accountId: '02082604',
    lastName: 'Garcia',
    firstName: 'Ana',
    middleName: 'Lopez',
    birthdate: '03/08/1992',
    email: 'ana@email.com',
    address: 'Makati City',
    gender: 'Female',
    citizenship: 'Filipino',
    mobileNo: '09201234567'
  },
  {
    accountId: '02082605',
    lastName: 'Mendoza',
    firstName: 'Carlos',
    middleName: 'Rivera',
    birthdate: '07/22/1990',
    email: 'carlos@email.com',
    address: 'Taguig City',
    gender: 'Male',
    citizenship: 'Filipino',
    mobileNo: '09211234567'
  },
  {
    accountId: '02082606',
    lastName: 'Connor',
    firstName: 'John',
    middleName: 'Can',
    birthdate: '03/15/1987',
    email: 'john@email.com',
    address: 'BGC Taguig',
    gender: 'Male',
    citizenship: 'American',
    mobileNo: '09221234567'
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

// Generate Transaction Number (simple sequential)
function generateTransactionNo() {
  const tableBody = document.getElementById('tableBody');
  const rows = tableBody ? Array.from(tableBody.querySelectorAll('tr')) : [];
  
  // Find the highest transaction number
  let maxTxNo = 0;
  rows.forEach(row => {
    const txCell = row.cells[0];
    if (txCell) {
      const txNo = parseInt(txCell.textContent.trim());
      if (txNo > maxTxNo) {
        maxTxNo = txNo;
      }
    }
  });
  
  // Return next number
  return maxTxNo + 1;
}

// Get current date and time formatted
function getCurrentDateTime() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const year = now.getFullYear();
  
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  
  return `${month}/${day}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
}

// Add Transaction Modal
const addModal = document.getElementById('addTransactionModal');
const viewModal = document.getElementById('viewTransactionModal');

function addTransaction() {
  // Reset form
  const form = document.getElementById('addTransactionForm');
  if (form) form.reset();
  
  // Generate new Transaction No
  const transactionNoField = document.getElementById('transactionNo');
  if (transactionNoField) {
    transactionNoField.value = generateTransactionNo();
  }
  
  // Set encoder (logged in user)
  const encoderField = document.getElementById('encoder');
  if (encoderField) {
    encoderField.value = LOGGED_IN_USER;
  }
  
  // Set current date/time
  const dateTimeField = document.getElementById('dateTime');
  if (dateTimeField) {
    dateTimeField.value = getCurrentDateTime();
  }
  
  // Clear display fields
  document.getElementById('lastNameDisplay').value = '';
  document.getElementById('firstNameDisplay').value = '';
  document.getElementById('middleNameDisplay').value = '';
  
  // Show modal
  addModal.classList.add('show');
}

function closeAddModal() {
  addModal.classList.remove('show');
}

// Lookup Taxpayer by Account ID
function lookupTaxpayer() {
  const accountIdInput = document.getElementById('accountIdInput');
  const accountId = accountIdInput.value.trim();
  
  if (!accountId) {
    showToast('error', 'Please enter an Account ID');
    return;
  }
  
  // Search in taxpayers database
  const taxpayer = TAXPAYERS_DB.find(tp => tp.accountId === accountId);
  
  if (taxpayer) {
    // Found! Fill in the details
    document.getElementById('lastNameDisplay').value = taxpayer.lastName;
    document.getElementById('firstNameDisplay').value = taxpayer.firstName;
    document.getElementById('middleNameDisplay').value = taxpayer.middleName;
    
    showToast('success', 'Taxpayer found!');
  } else {
    // Not found
    document.getElementById('lastNameDisplay').value = '';
    document.getElementById('firstNameDisplay').value = '';
    document.getElementById('middleNameDisplay').value = '';
    
    showToast('error', 'Taxpayer not found! Please check the Account ID.');
  }
}

// Auto-lookup on Enter key in Account ID field
const accountIdInput = document.getElementById('accountIdInput');
if (accountIdInput) {
  accountIdInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      lookupTaxpayer();
    }
  });
}

// Handle form submission
const addTransactionForm = document.getElementById('addTransactionForm');
if (addTransactionForm) {
  addTransactionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const transactionNo = document.getElementById('transactionNo').value;
    const accountId = document.getElementById('accountIdInput').value.trim();
    const lastName = document.getElementById('lastNameDisplay').value;
    const firstName = document.getElementById('firstNameDisplay').value;
    const middleName = document.getElementById('middleNameDisplay').value;
    const purpose = document.getElementById('purpose').value.trim();
    const occupation = document.getElementById('occupation').value.trim();
    const encoder = document.getElementById('encoder').value;
    const dateTime = document.getElementById('dateTime').value;
    
    // Validate that taxpayer was looked up
    if (!lastName || !firstName) {
      showToast('error', 'Please lookup a valid taxpayer first!');
      return;
    }
    
    // Add new row to table
    const tableBody = document.getElementById('tableBody');
    if (tableBody) {
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td>${transactionNo}</td>
        <td>${accountId}</td>
        <td>${lastName}</td>
        <td>${firstName}</td>
        <td>${middleName}</td>
        <td>${dateTime}</td>
        <td>${purpose}</td>
        <td>${encoder}</td>
        <td>${occupation}</td>
        <td>
          <button class="icon-action-btn view-btn-icon" title="View">
            <i class="fas fa-eye"></i>
          </button>
          <button class="icon-action-btn delete-btn" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
      
      tableBody.insertBefore(newRow, tableBody.firstChild);
    }
    
    // Show success message
    showToast('success', 'Transaction added successfully!');
    
    // Close modal and reset form
    closeAddModal();
    addTransactionForm.reset();
    
    // Refresh table state
    applyTableState(true);
    
    // Log to console
    console.log('New transaction added:', {
      transactionNo,
      accountId,
      lastName,
      firstName,
      middleName,
      purpose,
      occupation,
      encoder,
      dateTime
    });
  });
}

// View Transaction
let selectedRow = null;

function viewTransaction() {
  if (!selectedRow) {
    showToast('info', 'Please select a transaction from the table');
    return;
  }
  
  // Get data from selected row
  const cells = selectedRow.cells;
  
  document.getElementById('viewTransactionNo').textContent = cells[0].textContent;
  document.getElementById('viewAccountId').textContent = cells[1].textContent;
  document.getElementById('viewLastName').textContent = cells[2].textContent;
  document.getElementById('viewFirstName').textContent = cells[3].textContent;
  document.getElementById('viewMiddleName').textContent = cells[4].textContent;
  document.getElementById('viewDateTime').textContent = cells[5].textContent;
  document.getElementById('viewPurpose').textContent = cells[6].textContent || '-';
  document.getElementById('viewEncoder').textContent = cells[7].textContent || '-';
  document.getElementById('viewOccupation').textContent = cells[8].textContent || '-';
  
  viewModal.classList.add('show');
}

function closeViewModal() {
  viewModal.classList.remove('show');
}

// Print transaction details
function printTransactionDetails() {
  window.print();
}

// Click on table row to select
document.addEventListener('click', (e) => {
  const row = e.target.closest('tbody tr');
  if (row && e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
    // Remove previous selection
    document.querySelectorAll('tbody tr').forEach(r => {
      r.style.backgroundColor = '';
    });
    
    // Select this row
    selectedRow = row;
    row.style.backgroundColor = 'rgba(102, 126, 234, 0.15)';
  }
});

// View button in table
document.addEventListener('click', (e) => {
  if (e.target.closest('.view-btn-icon')) {
    const row = e.target.closest('tr');
    selectedRow = row;
    viewTransaction();
  }
  
  if (e.target.closest('.delete-btn')) {
    const row = e.target.closest('tr');
    const txNo = row.cells[0].textContent;
    const name = row.cells[3].textContent + ' ' + row.cells[2].textContent;
    
    if (confirm(`Are you sure you want to delete transaction #${txNo} for ${name}?`)) {
      row.remove();
      applyTableState();
      showToast('success', 'Transaction deleted successfully!');
      
      // Clear selection
      if (selectedRow === row) {
        selectedRow = null;
      }
    }
  }
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
  if (e.target === addModal) {
    closeAddModal();
  }
  if (e.target === viewModal) {
    closeViewModal();
  }
});

// Table search + pagination
const searchInput = document.getElementById('searchInput');
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
    tableSummary.textContent = 'Showing 0 of 0 transactions';
    return;
  }
  tableSummary.textContent = `Showing ${startIndex + 1}-${endIndex} of ${totalRows} transactions`;
}

function applyTableState(resetPage = false) {
  const allRows = getAllRows();
  const searchTerm = getSearchTerm();
  const rowsPerPage = getRowsPerPage();

  const filteredRows = allRows.filter((row) =>
    row.textContent.toLowerCase().includes(searchTerm)
  );

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

// Print function
function printTable() {
  window.print();
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

// Set logged in username in sidebar
const sidebarUsername = document.getElementById('sidebarUsername');
if (sidebarUsername) {
  sidebarUsername.textContent = LOGGED_IN_USER;
}

// Initialize
setCurrentDate();
applyTableState(true);