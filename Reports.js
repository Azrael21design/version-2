// Global variables
const LOGGED_IN_USER = 'Mike';

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

// Initialize charts
let revenueChart = null;
let transactionPieChart = null;

function initCharts() {
  // Revenue Trend Chart
  const revenueCtx = document.getElementById('revenueChart');
  if (revenueCtx) {
    const gradient1 = revenueCtx.getContext('2d').createLinearGradient(0, 0, 0, 300);
    gradient1.addColorStop(0, 'rgba(102, 126, 234, 0.3)');
    gradient1.addColorStop(1, 'rgba(102, 126, 234, 0.05)');

    const gradient2 = revenueCtx.getContext('2d').createLinearGradient(0, 0, 0, 300);
    gradient2.addColorStop(0, 'rgba(72, 187, 120, 0.3)');
    gradient2.addColorStop(1, 'rgba(72, 187, 120, 0.05)');

    revenueChart = new Chart(revenueCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Revenue',
            data: [180, 210, 245, 225, 268, 295, 312, 325, 298, 315, 332, 345],
            borderColor: '#667eea',
            backgroundColor: gradient1,
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 5,
            pointBackgroundColor: '#667eea',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointHoverRadius: 7,
          },
          {
            label: 'Target',
            data: [200, 220, 240, 260, 280, 300, 320, 340, 320, 340, 360, 380],
            borderColor: '#48bb78',
            backgroundColor: gradient2,
            borderWidth: 3,
            borderDash: [5, 5],
            fill: true,
            tension: 0.4,
            pointRadius: 0,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                size: 13,
                family: "'Plus Jakarta Sans', sans-serif",
                weight: 600
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(45, 55, 72, 0.95)',
            titleFont: {
              size: 14,
              family: "'Plus Jakarta Sans', sans-serif",
              weight: 700
            },
            bodyFont: {
              size: 13,
              family: "'Plus Jakarta Sans', sans-serif"
            },
            padding: 12,
            cornerRadius: 8,
            displayColors: true,
            callbacks: {
              label: function(context) {
                return context.dataset.label + ': ₱' + context.parsed.y + 'K';
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
              drawBorder: false
            },
            ticks: {
              font: {
                size: 12,
                family: "'Plus Jakarta Sans', sans-serif"
              },
              color: '#718096',
              padding: 10,
              callback: function(value) {
                return '₱' + value + 'K';
              }
            }
          },
          x: {
            grid: {
              display: false,
              drawBorder: false
            },
            ticks: {
              font: {
                size: 12,
                family: "'Plus Jakarta Sans', sans-serif",
                weight: 600
              },
              color: '#718096',
              padding: 10
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    });
  }

  // Transaction Pie Chart
  const pieCtx = document.getElementById('transactionPieChart');
  if (pieCtx) {
    transactionPieChart = new Chart(pieCtx, {
      type: 'doughnut',
      data: {
        labels: ['New Applications', 'Renewals', 'Updates', 'Others'],
        datasets: [{
          data: [45, 30, 15, 10],
          backgroundColor: [
            '#667eea',
            '#48bb78',
            '#ed8936',
            '#9f7aea'
          ],
          borderWidth: 3,
          borderColor: '#fff',
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 15,
              font: {
                size: 13,
                family: "'Plus Jakarta Sans', sans-serif",
                weight: 600
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(45, 55, 72, 0.95)',
            titleFont: {
              size: 14,
              family: "'Plus Jakarta Sans', sans-serif",
              weight: 700
            },
            bodyFont: {
              size: 13,
              family: "'Plus Jakarta Sans', sans-serif"
            },
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: function(context) {
                return context.label + ': ' + context.parsed + '%';
              }
            }
          }
        }
      }
    });
  }
}

// Quick Filter Functions
function quickFilter(period) {
  // Remove active class from all buttons
  document.querySelectorAll('.quick-filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Add active class to clicked button
  event.target.classList.add('active');
  
  const today = new Date();
  let fromDate, toDate;
  
  switch(period) {
    case 'today':
      fromDate = new Date(today);
      toDate = new Date(today);
      break;
    case 'week':
      fromDate = new Date(today);
      fromDate.setDate(today.getDate() - 7);
      toDate = new Date(today);
      break;
    case 'month':
      fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
      toDate = new Date(today);
      break;
    case 'year':
      fromDate = new Date(today.getFullYear(), 0, 1);
      toDate = new Date(today);
      break;
  }
  
  // Set date inputs
  document.getElementById('fromDate').value = formatDateForInput(fromDate);
  document.getElementById('toDate').value = formatDateForInput(toDate);
  
  showToast('success', `Filter applied: ${period}`);
}

function formatDateForInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Apply Date Filter
function applyDateFilter() {
  const fromDate = document.getElementById('fromDate').value;
  const toDate = document.getElementById('toDate').value;
  
  if (!fromDate || !toDate) {
    showToast('error', 'Please select both From and To dates');
    return;
  }
  
  if (new Date(fromDate) > new Date(toDate)) {
    showToast('error', 'From date cannot be later than To date');
    return;
  }
  
  showToast('success', 'Custom date filter applied');
  
  // In real app, would fetch filtered data from server
  console.log('Filtering from', fromDate, 'to', toDate);
}

// Generate Report
function generateReport(reportType) {
  const reportNames = {
    'transactions': 'Transaction Report',
    'revenue': 'Revenue Report',
    'taxpayers': 'Taxpayer Report',
    'ids': 'ID Cards Report',
    'encoders': 'Encoder Performance Report',
    'summary': 'Summary Report'
  };
  
  const reportName = reportNames[reportType] || 'Report';
  
  showToast('success', `Generating ${reportName}...`);
  
  // Simulate report generation
  setTimeout(() => {
    showToast('success', `${reportName} ready for download!`);
    // In real app, would download PDF or Excel file
    console.log('Generated report:', reportType);
  }, 1500);
}

// Export Top Performers
function exportTopPerformers() {
  showToast('success', 'Exporting to Excel...');
  
  setTimeout(() => {
    showToast('success', 'Excel file downloaded successfully!');
    // In real app, would generate Excel file
  }, 1000);
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

// Chart controls
document.querySelectorAll('.chart-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const parent = this.parentElement;
    parent.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    
    // In real app, would update chart data based on selected period
    showToast('info', `Chart updated: ${this.textContent}`);
  });
});

// Set default dates (this month)
window.addEventListener('load', () => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  
  document.getElementById('fromDate').value = formatDateForInput(firstDay);
  document.getElementById('toDate').value = formatDateForInput(today);
});

// Initialize everything
setCurrentDate();
initCharts();