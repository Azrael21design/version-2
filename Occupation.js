// Global variables
const LOGGED_IN_USER = 'Mike'; // This would come from login session in real app
let photoData = null;

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

// Generate Account ID based on date + series
function generateAccountId() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const year = String(today.getFullYear()).slice(-2); // Last 2 digits of year
  
  const datePrefix = month + day + year; // Format: mmddyy
  
  // Get all existing IDs from table
  const tableBody = document.getElementById('tableBody');
  const rows = tableBody ? Array.from(tableBody.querySelectorAll('tr')) : [];
  
  // Find the highest series number for today's date
  let maxSeries = 0;
  rows.forEach(row => {
    const idCell = row.cells[0];
    if (idCell) {
      const id = idCell.textContent.trim();
      // Check if ID starts with today's date prefix
      if (id.startsWith(datePrefix)) {
        const series = parseInt(id.slice(6)); // Get series number after mmddyy
        if (series > maxSeries) {
          maxSeries = series;
        }
      }
    }
  });
  
  // Increment series
  const newSeries = String(maxSeries + 1).padStart(3, '0');
  return datePrefix + newSeries;
}

// Get current date and time formatted
function getCurrentDateTime() {
  const now = new Date();
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };
  return now.toLocaleString('en-US', options);
}

// Add Tax Payer Modal
const modal = document.getElementById('addTaxPayerModal');

function addTaxPayer() {
  // Reset form
  const form = document.getElementById('addTaxPayerForm');
  if (form) form.reset();
  
  // Generate new Account ID
  const accountIdField = document.getElementById('accountId');
  if (accountIdField) {
    accountIdField.value = generateAccountId();
  }
  
  // Set encoded by (logged in user)
  const encodedByField = document.getElementById('encodedBy');
  if (encodedByField) {
    encodedByField.value = LOGGED_IN_USER;
  }
  
  // Set current date/time
  const encodedDatetimeField = document.getElementById('encodedDatetime');
  if (encodedDatetimeField) {
    encodedDatetimeField.value = getCurrentDateTime();
  }
  
  // Reset photo
  photoData = null;
  resetPhotoPreview();
  
  // Show modal
  modal.classList.add('show');
}

function closeModal() {
  modal.classList.remove('show');
  photoData = null;
  resetPhotoPreview();
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// Photo Upload Functions
function triggerPhotoUpload() {
  const photoInput = document.getElementById('photoInput');
  if (photoInput) {
    photoInput.click();
  }
}

function resetPhotoPreview() {
  const photoPreview = document.getElementById('photoPreview');
  if (photoPreview) {
    photoPreview.innerHTML = `
      <i class="fas fa-user fa-3x"></i>
      <p>Click to upload photo</p>
    `;
  }
}

// Handle photo selection
const photoInput = document.getElementById('photoInput');
const photoPreview = document.getElementById('photoPreview');

if (photoInput) {
  photoInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = function(event) {
        photoData = event.target.result;
        if (photoPreview) {
          photoPreview.innerHTML = `<img src="${photoData}" alt="Taxpayer Photo">`;
        }
      };
      reader.readAsDataURL(file);
    }
  });
}

// Make photo preview clickable
if (photoPreview) {
  photoPreview.addEventListener('click', triggerPhotoUpload);
}

// Handle form submission
const addTaxPayerForm = document.getElementById('addTaxPayerForm');
if (addTaxPayerForm) {
  addTaxPayerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const accountId = document.getElementById('accountId').value;
    const lastName = document.getElementById('lastName').value;
    const firstName = document.getElementById('firstName').value;
    const middleName = document.getElementById('middleName').value;
    const address = document.getElementById('address').value;
    const birthdate = document.getElementById('birthdate').value;
    const gender = document.getElementById('gender').value;
    const citizenship = document.getElementById('citizenship').value;
    const mobileNo = document.getElementById('mobileNo').value;
    const emailAddress = document.getElementById('emailAddress').value;
    const encodedBy = document.getElementById('encodedBy').value;
    const encodedDatetime = document.getElementById('encodedDatetime').value;
    
    // Format birthdate for display (mm/dd/yyyy)
    const birthdateObj = new Date(birthdate);
    const formattedBirthdate = `${String(birthdateObj.getMonth() + 1).padStart(2, '0')}/${String(birthdateObj.getDate()).padStart(2, '0')}/${birthdateObj.getFullYear()}`;
    
    // Add new row to table
    const tableBody = document.getElementById('tableBody');
    if (tableBody) {
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td>${accountId}</td>
        <td>${lastName}</td>
        <td>${firstName}</td>
        <td>${middleName || '-'}</td>
        <td>${formattedBirthdate}</td>
        <td>${emailAddress}</td>
        <td>${encodedBy}</td>
        <td>
          <button class="icon-action-btn edit-btn" title="Edit">
            <i class="fas fa-edit"></i>
          </button>
          <button class="icon-action-btn delete-btn" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
      
      // Store additional data as data attributes for future use
      newRow.dataset.address = address;
      newRow.dataset.gender = gender;
      newRow.dataset.citizenship = citizenship;
      newRow.dataset.mobileNo = mobileNo;
      newRow.dataset.encodedDatetime = encodedDatetime;
      if (photoData) {
        newRow.dataset.photo = photoData;
      }
      
      tableBody.insertBefore(newRow, tableBody.firstChild);
    }
    
    // Show success message
    showToast('success', 'Tax payer added successfully!');
    
    // Close modal and reset form
    closeModal();
    addTaxPayerForm.reset();
    
    // Refresh table state
    applyTableState(true);
    
    // Log to console (in real app, would send to server)
    console.log('New taxpayer added:', {
      accountId,
      lastName,
      firstName,
      middleName,
      address,
      birthdate: formattedBirthdate,
      gender,
      citizenship,
      mobileNo,
      emailAddress,
      encodedBy,
      encodedDatetime,
      photo: photoData ? 'Photo uploaded' : 'No photo'
    });
  });
}

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
    tableSummary.textContent = 'Showing 0 of 0 tax payers';
    return;
  }
  tableSummary.textContent = `Showing ${startIndex + 1}-${endIndex} of ${totalRows} tax payers`;
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

// Print function
function printTable() {
  window.print();
}

// Edit and Delete buttons
document.addEventListener('click', (e) => {
  if (e.target.closest('.edit-btn')) {
    const row = e.target.closest('tr');
    const id = row.cells[0].textContent;
    showToast('info', `Edit functionality coming soon for ID: ${id}`);
    // In a real application, open edit modal with pre-filled data
  }
  
  if (e.target.closest('.delete-btn')) {
    const row = e.target.closest('tr');
    const id = row.cells[0].textContent;
    const name = row.cells[2].textContent + ' ' + row.cells[1].textContent;
    
    if (confirm(`Are you sure you want to delete ${name} (ID: ${id})?`)) {
      row.remove();
      applyTableState();
      showToast('success', 'Tax payer deleted successfully!');
    }
  }
});

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

// Print styles
const printStyles = document.createElement('style');
printStyles.textContent = `
  @media print {
    .sidebar,
    .sidebar-float-toggle,
    .top-bar-actions,
    .action-bar,
    .table-toolbar,
    .pagination,
    .icon-action-btn {
      display: none !important;
    }
    
    .main-content {
      margin-left: 0 !important;
    }
    
    .table-container {
      box-shadow: none !important;
    }
    
    body {
      background: white !important;
    }
  }
`;
document.head.appendChild(printStyles);

// Set logged in username in sidebar
const sidebarUsername = document.getElementById('sidebarUsername');
if (sidebarUsername) {
  sidebarUsername.textContent = LOGGED_IN_USER;
}

// Initialize
setCurrentDate();
applyTableState(true);