// Set current date
function setCurrentDate() {
  const dateElement = document.getElementById('currentDate');
  if (!dateElement) return;
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
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

// Initialize Chart
function initChart() {
  const ctx = document.getElementById('activityChart');
  if (!ctx) return;

  const gradient1 = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
  gradient1.addColorStop(0, 'rgba(102, 126, 234, 0.3)');
  gradient1.addColorStop(1, 'rgba(102, 126, 234, 0.05)');

  const gradient2 = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
  gradient2.addColorStop(0, 'rgba(118, 75, 162, 0.3)');
  gradient2.addColorStop(1, 'rgba(118, 75, 162, 0.05)');

  const gradient3 = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
  gradient3.addColorStop(0, 'rgba(72, 187, 120, 0.3)');
  gradient3.addColorStop(1, 'rgba(72, 187, 120, 0.05)');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'New Tax Payers',
          data: [12, 19, 15, 25, 22, 30, 28],
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
          label: 'Transactions',
          data: [8, 15, 20, 18, 25, 28, 32],
          borderColor: '#764ba2',
          backgroundColor: gradient2,
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: '#764ba2',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointHoverRadius: 7,
        },
        {
          label: 'Printed IDs',
          data: [5, 10, 12, 15, 18, 22, 25],
          borderColor: '#48bb78',
          backgroundColor: gradient3,
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: '#48bb78',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointHoverRadius: 7,
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
              return context.dataset.label + ': ' + context.parsed.y + ' entries';
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
            padding: 10
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

// Chart controls
const chartButtons = document.querySelectorAll('.chart-btn');
chartButtons.forEach(btn => {
  btn.addEventListener('click', function() {
    chartButtons.forEach(b => b.classList.remove('active'));
    this.classList.add('active');
  });
});

// Add animation to stat cards on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeIn 0.6s ease forwards';
    }
  });
}, observerOptions);

document.querySelectorAll('.stat-card, .data-card').forEach(card => {
  observer.observe(card);
});

// Animate numbers on page load
function animateNumber(element, target, duration = 1000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

// Animate stat numbers on load
window.addEventListener('load', () => {
  const statNumbers = document.querySelectorAll('.stat-number');
  statNumbers.forEach(stat => {
    const text = stat.textContent;
    const number = parseInt(text.replace(/[^0-9]/g, ''));
    if (number && !isNaN(number)) {
      stat.textContent = '0';
      setTimeout(() => {
        animateNumber(stat, number);
        // Add the currency or suffix back
        if (text.includes('₱')) {
          const timer = setInterval(() => {
            if (stat.textContent == number) {
              stat.textContent = '₱' + number.toLocaleString() + 'M';
              clearInterval(timer);
            }
          }, 50);
        }
      }, 300);
    }
  });
});

// Add row hover effect with subtle animation
document.querySelectorAll('tbody tr').forEach(row => {
  row.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.01)';
  });
  
  row.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
  });
});

// Notification bell animation
const notificationBtn = document.querySelector('.notification-btn');
if (notificationBtn) {
  setInterval(() => {
    notificationBtn.classList.add('shake');
    setTimeout(() => {
      notificationBtn.classList.remove('shake');
    }, 500);
  }, 10000);
}

// Add shake animation style
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
  
  .shake {
    animation: shake 0.3s ease-in-out;
  }
`;
document.head.appendChild(shakeStyle);

// Initialize everything
setCurrentDate();
initChart();

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
  if (window.innerWidth <= mobileBreakpoint) {
    if (!sidebar?.contains(e.target) && !e.target.closest('#sidebarFloatToggle')) {
      sidebar?.classList.remove('active');
    }
  }
});
